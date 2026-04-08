import { injectable, inject } from "tsyringe";
import type { ISettingRepository } from "../../domain/interfaces/ISettingRepository.js";
import type { ISettingService } from "../../domain/services/ISettingService.js";
import type { Setting } from "../../domain/entities/Setting.js";
import type { ILogger } from "../../infrastructure/logging/Logger.js";
import type { IAgendaRepository } from "../../domain/interfaces/IAgendaRepository.js";
import { getNaiveNow } from "../../utils/dateUtils.js";

@injectable()
export class SettingService implements ISettingService {
  constructor(
    @inject("ISettingRepository")
    private repository: ISettingRepository,
    @inject("IAgendaRepository")
    private agendaRepository: IAgendaRepository,
    @inject("Logger")
    private logger: ILogger
  ) {}

  private getLocalDetails(date: Date) {
    // No modelo Naive UTC, as horas UTC são as horas nominais da clínica.
    const hour = date.getUTCHours();
    const minute = date.getUTCMinutes();
    const weekday = date.getUTCDay();

    return {
      weekday,
      time: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
    };
  }

  async getSettingById(id: string): Promise<Setting | null> {
    this.logger.info(`Buscando configuração por ID: ${id}`);
    return this.repository.findById(id);
  }

  async getAllSettings(): Promise<Setting[]> {
    this.logger.info("Buscando todas as configurações");
    return this.repository.findAll();
  }

  async getSettingByUserId(userId: string): Promise<Setting | null> {
    this.logger.info(`Buscando configuração do usuário: ${userId}`);
    return this.repository.findByUserId(userId);
  }

  async createSetting(setting: Omit<Setting, 'id'>): Promise<Setting> {
    this.logger.info(`Criando configuração para usuário: ${setting.userId}`);
    return this.repository.create(setting as Setting);
  }

  async updateSetting(id: string, setting: Partial<Setting>): Promise<Setting | null> {
    this.logger.info(`Atualizando configuração: ${id}`);

    if (setting.operatingDays || setting.businessHours || setting.timezone) {
      const current = await this.repository.findById(id);
      if (current) {
        const newOperatingDays = setting.operatingDays ?? current.operatingDays ?? [1, 2, 3, 4, 5];
        const newBusinessHours = setting.businessHours ?? current.businessHours;
        const newTimezone = setting.timezone ?? current.timezone ?? 'America/Sao_Paulo';

        const now = getNaiveNow(newTimezone);
        const farFuture = new Date(now);
        farFuture.setUTCFullYear(now.getUTCFullYear() + 2);
        
        const appointments = await this.agendaRepository.findByDateRange(current.userId, now, farFuture);

        for (const app of appointments) {
          const localStart = this.getLocalDetails(app.startDate);
          const localEnd = this.getLocalDetails(app.endDate);

          if (!newOperatingDays.includes(localStart.weekday)) {
            const formattedDate = `${app.startDate.getUTCDate().toString().padStart(2, '0')}/${(app.startDate.getUTCMonth() + 1).toString().padStart(2, '0')}`;
            throw new Error(`Conflito: Existe um agendamento em ${formattedDate}, mas o dia não terá funcionamento.`);
          }

          if (newBusinessHours) {
            const { startTime, endTime, lunchStart, lunchEnd } = newBusinessHours;
            if (localStart.time < startTime || localEnd.time > endTime) {
              const formattedDate = `${app.startDate.getUTCDate().toString().padStart(2, '0')}/${(app.startDate.getUTCMonth() + 1).toString().padStart(2, '0')} ${localStart.time}`;
              throw new Error(`Conflito: Agendamento em ${formattedDate} fora do novo expediente.`);
            }

            if (lunchStart && lunchEnd) {
              if ((localStart.time >= lunchStart && localStart.time < lunchEnd) || (localEnd.time > lunchStart && localEnd.time <= lunchEnd)) {
                const formattedDate = `${app.startDate.getUTCDate().toString().padStart(2, '0')}/${(app.startDate.getUTCMonth() + 1).toString().padStart(2, '0')} ${localStart.time}`;
                throw new Error(`Conflito: Agendamento em ${formattedDate} no novo intervalo de almoço.`);
              }
            }
          }
        }
      }
    }

    return this.repository.update(id, setting);
  }

  async deleteSetting(id: string): Promise<boolean> {
    this.logger.info(`Deletando configuração: ${id}`);
    return this.repository.delete(id);
  }
}
