import { injectable, inject } from "tsyringe";
import type { ISettingRepository } from "../../domain/interfaces/ISettingRepository.js";
import type { ISettingService } from "../../domain/services/ISettingService.js";
import type { Setting } from "../../domain/entities/Setting.js";
import type { ILogger } from "../../infrastructure/logging/Logger.js";
import type { IAgendaRepository } from "../../domain/interfaces/IAgendaRepository.js";

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

  private getLocalDetails(date: Date, timezone: string) {
    const options: Intl.DateTimeFormatOptions = {
      timeZone: timezone,
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: false,
    };
    const formatter = new Intl.DateTimeFormat('en-US', options);
    const parts = formatter.formatToParts(date);
    const getPart = (type: string) => parts.find(p => p.type === type)?.value || '0';

    const year = parseInt(getPart('year'));
    const month = parseInt(getPart('month')) - 1;
    const day = parseInt(getPart('day'));
    const hour = parseInt(getPart('hour'));
    const minute = parseInt(getPart('minute'));

    const d = new Date(Date.UTC(year, month, day, hour, minute));
    return {
      weekday: d.getUTCDay(),
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

    // Se houver alteração em regras de horário, validar com agendamentos existentes
    if (setting.operatingDays || setting.businessHours || setting.timezone) {
      const current = await this.repository.findById(id);
      if (current) {
        const newOperatingDays = setting.operatingDays ?? current.operatingDays ?? [1, 2, 3, 4, 5];
        const newBusinessHours = setting.businessHours ?? current.businessHours;
        const newTimezone = setting.timezone ?? current.timezone ?? 'America/Sao_Paulo';

        // Buscar todos os agendamentos futuros
        const now = new Date();
        const farFuture = new Date();
        farFuture.setFullYear(farFuture.getFullYear() + 2); // Validar próximos 2 anos
        
        const appointments = await this.agendaRepository.findByDateRange(current.userId, now, farFuture);

        for (const app of appointments) {
          const localStart = this.getLocalDetails(app.startDate, newTimezone);
          const localEnd = this.getLocalDetails(app.endDate, newTimezone);

          // 1. Validar dia de funcionamento
          if (!newOperatingDays.includes(localStart.weekday)) {
            const formattedDate = app.startDate.toLocaleDateString('pt-BR');
            throw new Error(`Conflito: Existe um agendamento em ${formattedDate}, mas o dia da semana não terá mais funcionamento.`);
          }

          // 2. Validar horário (apenas se businessHours existir)
          if (newBusinessHours) {
            const { startTime, endTime, lunchStart, lunchEnd } = newBusinessHours;
            
            // Fora do expediente
            if (localStart.time < startTime || localEnd.time > endTime) {
              const formattedDate = app.startDate.toLocaleString('pt-BR');
              throw new Error(`Conflito: O agendamento em ${formattedDate} ficaria fora do novo horário de expediente.`);
            }

            // Intervalo de almoço
            if (lunchStart && lunchEnd) {
              if (
                (localStart.time >= lunchStart && localStart.time < lunchEnd) ||
                (localEnd.time > lunchStart && localEnd.time <= lunchEnd) ||
                (localStart.time <= lunchStart && localEnd.time >= lunchEnd)
              ) {
                const formattedDate = app.startDate.toLocaleString('pt-BR');
                throw new Error(`Conflito: O agendamento em ${formattedDate} coincide com o novo intervalo de almoço.`);
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
