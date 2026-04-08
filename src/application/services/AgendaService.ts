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
import { getNaiveNow } from "../../utils/dateUtils.js";

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

  private isPastDate(date: Date, timezone: string): boolean {
    const now = getNaiveNow(timezone);
    const checkDate = new Date(date);
    checkDate.setSeconds(0, 0);
    const nowDate = new Date(now);
    nowDate.setSeconds(0, 0);
    return checkDate < nowDate;
  }

  private getDetails(date: Date) {
    const hour = date.getUTCHours();
    const minute = date.getUTCMinutes();
    const weekday = date.getUTCDay();

    return {
      weekday,
      time: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
    };
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

    const start = new Date(agenda.startDate);
    const end = new Date(agenda.endDate);

    if (this.isPastDate(start, timezone)) {
      throw new Error("Não é possível realizar agendamentos para datas passadas.");
    }

    if (agenda.status) (agenda as any).status = this.normalizeStatus(agenda.status);

    const overlap = await this.repository.hasOverlap(agenda.userId, agenda.patientId, start, end);
    if (overlap) throw new Error("Horário indisponível. Já existe um agendamento.");

    const detailsStart = this.getDetails(start);
    const detailsEnd = this.getDetails(end);

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
          if ((detailsStart.time >= lunchStart && detailsStart.time < lunchEnd) || (detailsEnd.time > lunchStart && detailsEnd.time <= lunchEnd)) {
            throw new Error(`Intervalo de almoço.`);
          }
        }
      }
    }

    const locks = await this.lockRepository.findByDateRange(agenda.userId, start, end);
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

    const created = await this.repository.create(agenda as Agenda);

    await this.activityService.logActivity({
      patientId: created.patientId,
      userId: created.userId,
      type: 'appointment_created',
      description: `Agendamento: ${created.startDate.getUTCDate().toString().padStart(2, '0')}/${(created.startDate.getUTCMonth() + 1).toString().padStart(2, '0')}`
    }).catch(() => {});

    return created;
  }

  async updateAgenda(id: string, agenda: Partial<Agenda>): Promise<Agenda | null> {
    if (agenda.status) (agenda as any).status = this.normalizeStatus(agenda.status);
    return this.repository.update(id, agenda);
  }

  async deleteAgenda(id: string): Promise<boolean> {
    return this.repository.delete(id);
  }

  async createLock(lockData: Omit<AgendaLock, 'id'> & { dates?: (Date | string)[] }): Promise<AgendaLock[]> {
    const datesToProcess = lockData.dates && lockData.dates.length > 0 ? lockData.dates : [lockData.date];
    const results: AgendaLock[] = [];

    for (const date of datesToProcess) {
      if (!date) continue;
      const lockDate = new Date(date);
      const year = lockDate.getUTCFullYear();
      const month = lockDate.getUTCMonth();
      const day = lockDate.getUTCDate();

      let rangeStart: Date;
      let rangeEnd: Date;

      if (lockData.type === 'total') {
        rangeStart = new Date(Date.UTC(year, month, day, 0, 0, 0));
        rangeEnd = new Date(Date.UTC(year, month, day, 23, 59, 59));
      } else {
        const [startH, startM] = lockData.startTime!.split(':').map(Number);
        const [endH, endM] = lockData.endTime!.split(':').map(Number);
        rangeStart = new Date(Date.UTC(year, month, day, startH, startM, 0));
        rangeEnd = new Date(Date.UTC(year, month, day, endH, endM, 0));
      }

      const lockToSave: any = { ...lockData };
      delete lockToSave.dates;
      lockToSave.date = rangeStart;

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

    const startDate = new Date(params.startDate);
    const endDate = new Date(startDate);
    endDate.setUTCHours(endDate.getUTCHours() + 1);

    return this.createAgenda({
      userId: params.userId,
      patientId: patient.id!,
      startDate,
      endDate,
      categoryId: params.categoryId,
      status: 'scheduled',
      description: "Online via portal."
    });
  }

  async getAvailableSlots(userId: string, date: string): Promise<string[]> {
    const settings = await this.settingRepository.findByUserId(userId);
    if (!settings || !settings.businessHours) throw new Error("Configurações ausentes.");

    const { startTime, endTime, lunchStart, lunchEnd } = settings.businessHours;
    const duration = settings.sessionDuration || 60;
    const [year, month, day] = date.split('-').map(Number);
    const startRange = new Date(Date.UTC(year, month - 1, day, 0, 0, 0));
    const endRange = new Date(Date.UTC(year, month - 1, day, 23, 59, 59));

    const [appointments, locks] = await Promise.all([
      this.repository.findByDateRange(userId, startRange, endRange),
      this.lockRepository.findByDateRange(userId, startRange, endRange)
    ]);

    if (locks.some(l => l.type === 'total')) return [];

    const slots: string[] = [];
    let currentTime = startTime;

    while (currentTime < endTime) {
      const [h, m] = currentTime.split(':').map(Number);
      const slotStart = new Date(Date.UTC(year, month - 1, day, h, m));
      const slotEnd = new Date(slotStart.getTime() + duration * 60000);
      const slotEndStr = slotEnd.getUTCHours().toString().padStart(2, '0') + ':' + slotEnd.getUTCMinutes().toString().padStart(2, '0');

      if (slotEndStr > endTime && slotEnd.getUTCDate() === slotStart.getUTCDate()) break;

      const hasAppConflict = appointments.some(app => slotStart < new Date(app.endDate) && slotEnd > new Date(app.startDate));
      if (!hasAppConflict) {
        const hasLockConflict = locks.some(lock => lock.type === 'partial' && lock.startTime && lock.endTime && (currentTime < lock.endTime && slotEndStr > lock.startTime));
        if (!hasLockConflict) slots.push(currentTime);
      }

      const nextDate = new Date(slotStart.getTime() + duration * 60000);
      currentTime = nextDate.getUTCHours().toString().padStart(2, '0') + ':' + nextDate.getUTCMinutes().toString().padStart(2, '0');
      if (duration <= 0) break;
    }
    return slots;
  }
}