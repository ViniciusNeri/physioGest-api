import { injectable, inject } from "tsyringe";
import type { ISettingRepository } from "../../domain/interfaces/ISettingRepository.js";
import type { ISettingService } from "../../domain/services/ISettingService.js";
import type { Setting } from "../../domain/entities/Setting.js";
import type { ILogger } from "../../infrastructure/logging/Logger.js";
import type { IAgendaRepository } from "../../domain/interfaces/IAgendaRepository.js";
import { getNaiveNowString, getLocalDayRange } from "../../utils/dateUtils.js";

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

  /** Extrai HH:mm e dia da semana de uma string "YYYY-MM-DDTHH:mm:ss" */
  private getLocalDetails(dateStr: string) {
    const time = dateStr.substring(11, 16); // "HH:mm"
    const datePart = dateStr.substring(0, 10);
    const weekday = new Date(datePart + 'T12:00:00Z').getUTCDay();
    return { weekday, time };
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

        const nowStr = getNaiveNowString(newTimezone);
        // Far future = 2 years from now as a date string
        const farFutureYear = parseInt(nowStr.substring(0, 4)) + 2;
        const farFutureStr = `${farFutureYear}${nowStr.substring(4)}`;

        const appointments = await this.agendaRepository.findByDateRange(current.userId, nowStr, farFutureStr);

        for (const app of appointments) {
          const localStart = this.getLocalDetails(app.startDate);
          const localEnd = this.getLocalDetails(app.endDate);

          if (!newOperatingDays.includes(localStart.weekday)) {
            const formattedDate = `${app.startDate.substring(8, 10)}/${app.startDate.substring(5, 7)}`;
            throw new Error(`Conflito: Existe um agendamento em ${formattedDate}, mas o dia não terá funcionamento.`);
          }

          if (newBusinessHours) {
            const { startTime, endTime, lunchStart, lunchEnd } = newBusinessHours;
            if (localStart.time < startTime || localEnd.time > endTime) {
              const formattedDate = `${app.startDate.substring(8, 10)}/${app.startDate.substring(5, 7)} ${localStart.time}`;
              throw new Error(`Conflito: Agendamento em ${formattedDate} fora do novo expediente.`);
            }

            if (lunchStart && lunchEnd) {
              if ((localStart.time >= lunchStart && localStart.time < lunchEnd) ||
                  (localEnd.time > lunchStart && localEnd.time <= lunchEnd)) {
                const formattedDate = `${app.startDate.substring(8, 10)}/${app.startDate.substring(5, 7)} ${localStart.time}`;
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
