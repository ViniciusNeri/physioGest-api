import { injectable, inject } from "tsyringe";
import type { IAgendaRepository } from "../../domain/interfaces/IAgendaRepository.js";
import type { IAgendaLockRepository } from "../../domain/interfaces/IAgendaLockRepository.js";
import type { IPatientRepository } from "../../domain/interfaces/IPatientRepository.js";
import type { IAuthenticateRepository } from "../../domain/interfaces/IAuthenticateRepository.js";
import type { IUserRepository } from "../../domain/interfaces/IUserRepository.js";
import type { IAgendaService } from "../../domain/services/IAgendaService.js";
import type { Agenda } from "../../domain/entities/Agenda.js";
import type { AgendaLock } from "../../domain/entities/AgendaLock.js";
import type { ILogger } from "../../infrastructure/logging/Logger.js";
import type { IPatientActivityService } from "../../domain/services/IPatientActivityService.js";
import type { EmailProvider } from "../../infrastructure/external/EmailProvider.js";
import type { ISettingRepository } from "../../domain/interfaces/ISettingRepository.js";
import type { ICategoryRepository } from "../../domain/interfaces/ICategoryRepository.js";
import { toLocalISOString, getNaiveNowString, getLocalDayRange } from "../../utils/dateUtils.js";

@injectable()
export class AgendaService implements IAgendaService {
  constructor(
    @inject("IAgendaRepository")
    private repository: IAgendaRepository,
    @inject("IAgendaLockRepository")
    private lockRepository: IAgendaLockRepository,
    @inject("IPatientRepository")
    private patientRepository: IPatientRepository,
    @inject("IAuthenticateRepository")
    private authRepository: IAuthenticateRepository,
    @inject("Logger")
    private logger: ILogger,
    @inject("IPatientActivityService")
    private activityService: IPatientActivityService,
    @inject("EmailProvider")
    private emailProvider: EmailProvider,
    @inject("IUserRepository")
    private userRepository: IUserRepository,
    @inject("ISettingRepository")
    private settingRepository: ISettingRepository,
    @inject("ICategoryRepository")
    private categoryRepository: ICategoryRepository,
  ) { }

  private normalizeStatus(status?: string): any {
    if (!status) return status;
    const mapping: Record<string, string> = {
      'agendado': 'scheduled',
      'realizado': 'completed',
      'cancelado': 'cancelled',
      'falta': 'no_show',
      'scheduled': 'scheduled',
      'completed': 'completed',
      'cancelled': 'cancelled',
      'no_show': 'no_show'
    };
    return mapping[status.toLowerCase()] || status;
  }

  /** Compara string ISO local "YYYY-MM-DDTHH:mm:ss" com o agora local */
  private isPastDate(localDateStr: string, timezone: string): boolean {
    const nowStr = getNaiveNowString(timezone);
    console.log("Data: ", localDateStr, " Agora: ", nowStr, 'timezone: ', timezone);
    // Remove seconds for minute-level comparison
    return localDateStr.substring(0, 16) < nowStr.substring(0, 16);
  }

  /** Extrai HH:mm e dia-da-semana de uma string "YYYY-MM-DDTHH:mm:ss" */
  private getDetails(localDateStr: string) {
    // "2026-04-11T10:30:00" → time: "10:30", weekday: 6 (sábado)
    const time = localDateStr.substring(11, 16); // "HH:mm"
    const datePart = localDateStr.substring(0, 10); // "YYYY-MM-DD"
    const weekday = new Date(datePart + 'T12:00:00Z').getUTCDay(); // safe weekday calc
    return { time, weekday };
  }

  async getAgendaById(id: string): Promise<Agenda | null> {
    return this.repository.findById(id);
  }

  async getAllAgendas(): Promise<Agenda[]> {
    return this.repository.findAll();
  }

  async getAgendasByUserId(userId: string): Promise<Array<Agenda | AgendaLock>> {
    const [appointments, locks] = await Promise.all([
      this.repository.findByUserId(userId),
      this.lockRepository.findByUserId(userId)
    ]);
    return [...appointments, ...locks];
  }

  async getAppointmentsByUserId(userId: string): Promise<Agenda[]> {
    return this.repository.findByUserId(userId);
  }

  async getLocksByUserId(userId: string): Promise<AgendaLock[]> {
    return this.lockRepository.findByUserId(userId);
  }

  async getAgendasByPatientId(patientId: string): Promise<Agenda[]> {
    return this.repository.findByPatientId(patientId);
  }

  async createAgenda(agenda: Omit<Agenda, 'id'>): Promise<Agenda> {
    if (!agenda.userId) throw new Error("userId é obrigatório.");
    if (!agenda.startDate || !agenda.endDate) throw new Error("Datas são obrigatórias.");

    const settings = await this.settingRepository.findByUserId(agenda.userId);
    const timezone = settings?.timezone || 'America/Sao_Paulo';

    // Converte para string local "YYYY-MM-DDTHH:mm:ss"
    const startStr = toLocalISOString(agenda.startDate, timezone);
    const endStr = toLocalISOString(agenda.endDate, timezone);

    if (this.isPastDate(startStr, timezone)) {
      console.log("Data: ", startStr, " Agora: ", getNaiveNowString(timezone), 'timezone: ', timezone, 'isPastDate: ', this.isPastDate(startStr, timezone));
      throw new Error("Não é possível realizar agendamentos para datas passadas.");
    }

    if (agenda.status) (agenda as any).status = this.normalizeStatus(agenda.status);

    const overlap = await this.repository.hasOverlap(agenda.userId, agenda.patientId, startStr, endStr);
    if (overlap) throw new Error("Horário indisponível. Já existe um agendamento.");

    const detailsStart = this.getDetails(startStr);
    const detailsEnd = this.getDetails(endStr);

    if (settings) {
      if (settings.operatingDays && !settings.operatingDays.includes(detailsStart.weekday)) {
        throw new Error(`Não há funcionamento neste dia.`);
      }

      if (settings.businessHours) {
        const { startTime, endTime, lunchStart, lunchEnd } = settings.businessHours;
        if (detailsStart.time < startTime || detailsEnd.time > endTime) {
          throw new Error(`Fora do expediente (${startTime}-${endTime}).`);
        }
        if (lunchStart && lunchEnd) {
          if ((detailsStart.time >= lunchStart && detailsStart.time < lunchEnd) ||
            (detailsEnd.time > lunchStart && detailsEnd.time <= lunchEnd)) {
            throw new Error(`Intervalo de almoço.`);
          }
        }
      }
    }

    const locks = await this.lockRepository.findByDateRange(agenda.userId, startStr, endStr);
    for (const lock of locks) {
      if (lock.type === 'total') {
        throw new Error("Não é possível realizar agendamento: Existe um bloqueio total para este dia.");
      }
      if (lock.type === 'partial' && lock.startTime && lock.endTime) {
        if (
          (detailsStart.time >= lock.startTime && detailsStart.time < lock.endTime) ||
          (detailsEnd.time > lock.startTime && detailsEnd.time <= lock.endTime) ||
          (detailsStart.time <= lock.startTime && detailsEnd.time >= lock.endTime)
        ) {
          throw new Error(`Não é possível realizar agendamento: Existe um bloqueio parcial das ${lock.startTime} às ${lock.endTime}.`);
        }
      }
    }

    // Salva com strings locais
    const agendaToSave = { ...agenda, startDate: startStr, endDate: endStr };
    const created = await this.repository.create(agendaToSave as Agenda);

    await this.activityService.logActivity({
      patientId: (created as any)._id.toString(),
      userId: created.userId,
      type: 'appointment_created',
      description: `Agendamento: ${startStr.substring(8, 10)}/${startStr.substring(5, 7)}`
    }).catch(() => { });

    return created;
  }

  async updateAgenda(id: string, agenda: Partial<Agenda>): Promise<Agenda | null> {
    if (agenda.status) (agenda as any).status = this.normalizeStatus(agenda.status);
    // Normaliza datas se presentes
    const update = { ...agenda } as any;
    if (update.startDate) update.startDate = toLocalISOString(update.startDate);
    if (update.endDate) update.endDate = toLocalISOString(update.endDate);
    return this.repository.update(id, update);
  }

  async deleteAgenda(id: string): Promise<boolean> {
    return this.repository.delete(id);
  }

  async createLock(lockData: Omit<AgendaLock, 'id'> & { dates?: (Date | string)[] }): Promise<AgendaLock[]> {
    const datesToProcess = lockData.dates && lockData.dates.length > 0 ? lockData.dates : [lockData.date];
    const results: AgendaLock[] = [];

    for (const date of datesToProcess) {
      if (!date) continue;

      let lockDateStr: string;
      let startOverlapStr: string;
      let endOverlapStr: string;

      if (lockData.type === 'total') {
        lockDateStr = `${date}T00:00:00`;
        startOverlapStr = `${date}T00:00:00`;
        endOverlapStr = `${date}T23:59:59`;
      } else {
        const [startH, startM] = lockData.startTime!.split(':');
        const [endH, endM] = lockData.endTime!.split(':');
        lockDateStr = `${date}T${startH.padStart(2, '0')}:${startM.padStart(2, '0')}:00`;
        startOverlapStr = lockDateStr;
        endOverlapStr = `${date}T${endH.padStart(2, '0')}:${endM.padStart(2, '0')}:00`;
      }

      // Valida conflito com agendamentos existentes
      const overlappingAppointments = await this.repository.findByDateRange(lockData.userId, startOverlapStr, endOverlapStr);
      if (overlappingAppointments.length > 0) {
        if (lockData.type === 'total') {
          throw new Error('Não é possível criar o bloqueio total: Existem agendamentos marcados para este dia.');
        } else {
          throw new Error(`Não é possível criar um bloqueio no período: Existem agendamentos marcados das ${lockData.startTime} às ${lockData.endTime}.`);
        }
      }

      const lockToSave: any = { ...lockData };
      delete lockToSave.dates;
      lockToSave.date = lockDateStr;

      results.push(await this.lockRepository.create(lockToSave as AgendaLock));
    }
    return results;
  }

  async deleteLock(lockId: string): Promise<boolean> {
    return this.lockRepository.delete(lockId);
  }

  async createOnlineAppointment(params: {
    userId: string;
    pin: string;
    startDate: string | Date;
    categoryId: string;
  }): Promise<Agenda> {
    const patient = await this.patientRepository.findByPin(params.userId, params.pin);
    if (!patient) throw new Error("PIN inválido.");

    const settings = await this.settingRepository.findByUserId(params.userId);
    const timezone = settings?.timezone || 'America/Sao_Paulo';

    const startStr = toLocalISOString(params.startDate, timezone);
    // Adiciona 1 hora como string
    const [datePart, timePart] = startStr.split('T');
    const [h, min, s] = timePart.split(':').map(Number);
    const endH = (h + 1).toString().padStart(2, '0');
    const endStr = `${datePart}T${endH}:${min.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;

    return this.createAgenda({
      userId: params.userId,
      patientId: patient.id!,
      startDate: startStr,
      endDate: endStr,
      categoryId: params.categoryId,
      status: 'scheduled',
      description: "Online via portal."
    });
  }

  async getAvailableSlots(userId: string, date: string, categoryId?: string): Promise<string[]> {
    const settings = await this.settingRepository.findByUserId(userId);
    if (!settings || !settings.businessHours) throw new Error("Configurações ausentes.");
    const timezone = settings?.timezone || 'America/Sao_Paulo';

    const { startTime, endTime, lunchStart, lunchEnd } = settings.businessHours;
    let duration = settings.sessionDuration || 60;

    if (categoryId) {
      const category = await this.categoryRepository.findById(categoryId);
      if (category && category.duration) {
        duration = category.duration;
      }
    }

    const { start: rangeStartStr, end: rangeEndStr } = getLocalDayRange(date);

    const [appointments, locks] = await Promise.all([
      this.repository.findByDateRange(userId, rangeStartStr, rangeEndStr),
      this.lockRepository.findByDateRange(userId, rangeStartStr, rangeEndStr)
    ]);

    if (locks.some(l => l.type === 'total')) return [];

    const slots: string[] = [];
    let currentTime = startTime;

    while (currentTime < endTime) {
      const [h, m] = currentTime.split(':').map(Number);
      const endH = Math.floor((h * 60 + m + duration) / 60);
      const endM = (h * 60 + m + duration) % 60;
      const slotEndStr = `${endH.toString().padStart(2, '0')}:${endM.toString().padStart(2, '0')}`;

      if (slotEndStr > endTime) break;

      const slotStartFull = `${date}T${currentTime}:00`;
      const slotEndFull = `${date}T${slotEndStr}:00`;

      const hasAppConflict = appointments.some(app =>
        slotStartFull < app.endDate && slotEndFull > app.startDate
      );

      if (!hasAppConflict) {
        const hasLockConflict = locks.some(lock =>
          lock.type === 'partial' && lock.startTime && lock.endTime &&
          (currentTime < lock.endTime && slotEndStr > lock.startTime)
        );
        if (!hasLockConflict) {
          let isLunchConflict = false;
          if (lunchStart && lunchEnd) {
            if ((currentTime >= lunchStart && currentTime < lunchEnd) ||
              (slotEndStr > lunchStart && slotEndStr <= lunchEnd)) {
              isLunchConflict = true;
            }
          }
          if (!isLunchConflict) slots.push(currentTime);
        }
      }

      // Próximo slot
      const gridStep = settings.sessionDuration || 60;
      const nextTotalMin = h * 60 + m + gridStep;
      const nextH = Math.floor(nextTotalMin / 60).toString().padStart(2, '0');
      const nextM = (nextTotalMin % 60).toString().padStart(2, '0');
      currentTime = `${nextH}:${nextM}`;
      if (gridStep <= 0) break;
    }
    return slots;
  }
}