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
import { getUTCRangeForLocalDate } from "../../utils/dateUtils.js";

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

  private isPastDate(date: Date): boolean {
    const now = new Date();
    const checkDate = new Date(date);
    checkDate.setSeconds(0, 0);
    const nowDate = new Date(now);
    nowDate.setSeconds(0, 0);
    return checkDate < nowDate;
  }

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

  async getAgendaById(id: string): Promise<Agenda | null> {
    this.logger.info(`Buscando agenda por ID: ${id}`);
    return this.repository.findById(id);
  }

  async getAllAgendas(): Promise<Agenda[]> {
    this.logger.info("Buscando todas as agendas");
    return this.repository.findAll();
  }

  async getAgendasByUserId(userId: string): Promise<Array<Agenda | AgendaLock>> {
    this.logger.info(`Buscando agendas e bloqueios por usuário: ${userId}`);
    const [appointments, locks] = await Promise.all([
      this.repository.findByUserId(userId),
      this.lockRepository.findByUserId(userId)
    ]);
    return [...appointments, ...locks];
  }

  async getAppointmentsByUserId(userId: string): Promise<Agenda[]> {
    this.logger.info(`Buscando apenas agendamentos por usuário: ${userId}`);
    return this.repository.findByUserId(userId);
  }

  async getLocksByUserId(userId: string): Promise<AgendaLock[]> {
    this.logger.info(`Buscando apenas bloqueios por usuário: ${userId}`);
    return this.lockRepository.findByUserId(userId);
  }

  async getAgendasByPatientId(patientId: string): Promise<Agenda[]> {
    this.logger.info(`Buscando agendas por paciente: ${patientId}`);
    return this.repository.findByPatientId(patientId);
  }

  async createAgenda(agenda: Omit<Agenda, 'id'>): Promise<Agenda> {
    this.logger.info(`Criando agenda para usuário: ${agenda.userId}`);

    if (!agenda.userId) throw new Error("Erro: userId é obrigatório.");
    if (!agenda.startDate || !agenda.endDate) throw new Error("Erro: startDate e endDate são obrigatórios.");

    const start = new Date(agenda.startDate);
    const end = new Date(agenda.endDate);

    if (this.isPastDate(start)) {
      throw new Error("Não é possível realizar agendamentos para datas passadas.");
    }

    if (agenda.status) {
      (agenda as any).status = this.normalizeStatus(agenda.status);
    }

    const overlap = await this.repository.hasOverlap(agenda.userId, agenda.patientId, start, end);
    if (overlap) {
      throw new Error("Horário indisponível. Já existe um agendamento para este período.");
    }

    const settings = await this.settingRepository.findByUserId(agenda.userId);
    if (settings) {
      const timezone = settings.timezone || 'America/Sao_Paulo';
      const localStart = this.getLocalDetails(start, timezone);
      const localEnd = this.getLocalDetails(end, timezone);

      if (settings.operatingDays && !settings.operatingDays.includes(localStart.weekday)) {
        const daysMap: Record<number, string> = {
          0: 'domingos', 1: 'segundas-feiras', 2: 'terças-feiras', 3: 'quartas-feiras',
          4: 'quintas-feiras', 5: 'sextas-feiras', 6: 'sábados'
        };
        throw new Error(`Não há funcionamento aos ${daysMap[localStart.weekday]}.`);
      }

      if (settings.businessHours) {
        const { startTime, endTime, lunchStart, lunchEnd } = settings.businessHours;

        if (localStart.time < startTime || localEnd.time > endTime) {
          throw new Error(`Horário fora do expediente (${startTime} às ${endTime}).`);
        }

        if (lunchStart && lunchEnd) {
          if (
            (localStart.time >= lunchStart && localStart.time < lunchEnd) ||
            (localEnd.time > lunchStart && localEnd.time <= lunchEnd) ||
            (localStart.time <= lunchStart && localEnd.time >= lunchEnd)
          ) {
            throw new Error(`Horário indisponível devido ao intervalo de almoço (${lunchStart} às ${lunchEnd}).`);
          }
        }
      }
    }

    const locks = await this.lockRepository.findByDateRange(agenda.userId, start, end);
    if (locks.length > 0) {
      for (const lock of locks) {
        if (lock.type === 'total') throw new Error("Horário indisponível devido a um bloqueio total na agenda.");

        if (lock.startTime && lock.endTime) {
          const appointmentStartStr = start.toTimeString().substring(0, 5);
          const appointmentEndStr = end.toTimeString().substring(0, 5);

          if (
            (appointmentStartStr >= lock.startTime && appointmentStartStr < lock.endTime) ||
            (appointmentEndStr > lock.startTime && appointmentEndStr <= lock.endTime) ||
            (appointmentStartStr <= lock.startTime && appointmentEndStr >= lock.endTime)
          ) {
            throw new Error("Horário indisponível devido a um bloqueio parcial na agenda.");
          }
        }
      }
    }

    const created = await this.repository.create(agenda as Agenda);

    await this.activityService.logActivity({
      patientId: created.patientId,
      userId: created.userId,
      type: 'appointment_created',
      description: `Agendamento criado para ${new Date(created.startDate).toLocaleDateString('pt-BR')}`,
      metadata: { agendaId: created.id }
    }).catch(err => this.logger.error("Erro ao logar atividade", err));

    return created;
  }

  async updateAgenda(id: string, agenda: Partial<Agenda>): Promise<Agenda | null> {
    this.logger.info(`Atualizando agenda: ${id}`);

    if (agenda.status) {
      (agenda as any).status = this.normalizeStatus(agenda.status);
    }

    if (agenda.startDate || agenda.endDate) {
      const existing = await this.repository.findById(id);
      if (existing) {
        const start = agenda.startDate ? new Date(agenda.startDate) : existing.startDate;
        const end = agenda.endDate ? new Date(agenda.endDate) : existing.endDate;
        const patientId = agenda.patientId || existing.patientId;

        const overlap = await this.repository.hasOverlap(existing.userId, patientId, start, end, id);
        if (overlap) {
          throw new Error("Horário indisponível. Já existe um agendamento para este período.");
        }
      }
    }

    const updated = await this.repository.update(id, agenda);

    if (updated && agenda.status) {
      let activityType: any = null;
      let description = "";

      if (agenda.status === 'completed') {
        activityType = 'appointment_completed';
        description = "Atendimento realizado";
      } else if (agenda.status === 'cancelled') {
        activityType = 'appointment_cancelled';
        description = "Atendimento cancelado";
      } else if (agenda.status === 'no_show') {
        activityType = 'appointment_no_show';
        description = "Falta (Paciente não compareceu)";
      }

      if (activityType) {
        await this.activityService.logActivity({
          patientId: updated.patientId,
          userId: updated.userId,
          type: activityType,
          description,
          metadata: { agendaId: id }
        }).catch(err => this.logger.error("Erro ao logar atividade", err));
      }
    }

    return updated;
  }

  async deleteAgenda(id: string): Promise<boolean> {
    this.logger.info(`Deletando agenda: ${id}`);
    return this.repository.delete(id);
  }

  async createLock(lockData: Omit<AgendaLock, 'id'> & { dates?: (Date | string)[] }): Promise<AgendaLock[]> {
    this.logger.info(`Criando bloqueio(s) de agenda para usuário: ${lockData.userId}`);

    const datesToProcess = lockData.dates && lockData.dates.length > 0
      ? lockData.dates
      : [lockData.date];

    const results: AgendaLock[] = [];

    for (const date of datesToProcess) {
      if (lockData.type === 'partial' && (!lockData.startTime || !lockData.endTime)) {
        throw new Error("Para bloqueios parciais, o horário de início e fim são obrigatórios.");
      }

      const lockDate = new Date(date);

      let rangeStart: Date;
      let rangeEnd: Date;

      if (lockData.type === 'total') {
        rangeStart = new Date(lockDate);
        rangeStart.setHours(0, 1, 0, 0);
        rangeEnd = new Date(lockDate);
        rangeEnd.setHours(23, 59, 0, 0);
      } else {
        const [startH, startM] = lockData.startTime!.split(':').map(Number);
        const [endH, endM] = lockData.endTime!.split(':').map(Number);
        rangeStart = new Date(lockDate);
        rangeStart.setHours(startH, startM, 0, 0);
        rangeEnd = new Date(lockDate);
        rangeEnd.setHours(endH, endM, 0, 0);
      }

      const conflictingAppointments = await this.repository.findByDateRange(lockData.userId, rangeStart, rangeEnd);

      if (conflictingAppointments.length > 0) {
        const type = lockData.type === 'total' ? 'dia' : 'período';
        const formattedDate = lockDate.toLocaleDateString('pt-BR');
        throw new Error(
          `Não é possível criar o bloqueio para a data ${formattedDate}. Existem ${conflictingAppointments.length} agendamento(s) marcado(s) neste ${type}.`
        );
      }

      const lockToSave: any = { ...lockData };
      delete lockToSave.dates;
      lockToSave.date = lockDate;

      const created = await this.lockRepository.create(lockToSave as AgendaLock);
      results.push(created);
    }

    return results;
  }

  async deleteLock(lockId: string): Promise<boolean> {
    this.logger.info(`Deletando bloqueio: ${lockId}`);
    return this.lockRepository.delete(lockId);
  }

  async createOnlineAppointment(params: {
    userId: string;
    pin: string;
    startDate: string | Date;
    categoryId: string;
  }): Promise<Agenda> {
    this.logger.info(`Tentativa de agendamento online via PIN`, { userId: params.userId });

    const patient = await this.patientRepository.findByPin(params.userId, params.pin);
    if (!patient) {
      throw new Error("PIN ou Identificador de Usuário inválidos.");
    }

    const startDate = new Date(params.startDate);
    const endDate = new Date(startDate);
    endDate.setHours(endDate.getHours() + 1);

    const newAgenda: Omit<Agenda, 'id'> = {
      userId: params.userId,
      patientId: patient.id!,
      startDate,
      endDate,
      categoryId: params.categoryId,
      status: 'scheduled',
      description: "Agendamento realizado via portal do paciente."
    };

    const created = await this.createAgenda(newAgenda);

    const user = await this.userRepository.findById(params.userId);
    if (user && user.email) {
      this.sendAppointmentNotificationEmail(user.email, user.name, patient.name, startDate, params.categoryId);
    }

    return created;
  }

  private async sendAppointmentNotificationEmail(to: string, userName: string, patientName: string, date: Date, categoryId: string) {
    this.logger.info("Iniciando processo de envio de e-mail de notificação", { to, userName, patientName });
    const formattedDate = date.toLocaleDateString('pt-BR');
    const formattedTime = date.toTimeString().substring(0, 5);

    const message = {
      to,
      subject: 'Novo Agendamento Realizado - PhysioGest',
      html: `
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Novo Agendamento - PhysioGest</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
            .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 30px; text-align: center; }
            .header h1 { margin: 0; font-size: 28px; font-weight: 300; }
            .content { padding: 40px 30px; color: #333333; line-height: 1.6; }
            .details { background-color: #f8f9fa; border-left: 4px solid #667eea; padding: 20px; margin: 20px 0; }
            .footer { background-color: #f8f9fa; padding: 20px 30px; text-align: center; color: #666666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>PhysioGest</h1>
              <p>Sistema de Gestão Fisioterapêutica</p>
            </div>
            <div class="content">
              <h2>Novo Agendamento Online</h2>
              <p>Olá, <strong>${userName}</strong>!</p>
              <p>Um novo agendamento foi realizado através do portal do paciente.</p>
              
              <div class="details">
                <p><strong>Paciente:</strong> ${patientName}</p>
                <p><strong>Data:</strong> ${formattedDate}</p>
                <p><strong>Horário:</strong> ${formattedTime}</p>
              </div>
              
              <p>O agendamento já foi adicionado à sua agenda. Se houver algum imprevisto, entre em contato diretamente com o paciente.</p>
              
              <p>Atenciosamente,<br><strong>Equipe PhysioGest</strong></p>
            </div>
            <div class="footer">
              <p>&copy; 2026 PhysioGest. Todos os direitos reservados.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `PhysioGest - Novo Agendamento Online\n\nOlá ${userName}!\n\nUm novo agendamento foi realizado por ${patientName} para o dia ${formattedDate} às ${formattedTime}.\n\nAtenciosamente,\nEquipe PhysioGest`
    };

    try {
      this.logger.info("Chamando provedor de e-mail para envio...", { to });
      await this.emailProvider.sendEmail(message);
      this.logger.info("E-mail de notificação enviado com sucesso", { to });
    } catch (error) {
      this.logger.error("Falha fatal ao enviar email de notificação de agendamento", error, { to });
    }
  }

  async getAvailableSlots(userId: string, date: string): Promise<string[]> {
    this.logger.info(`Buscando horários disponíveis para usuário ${userId} em ${date}`);

    // 1. Buscar configurações
    const settings = await this.settingRepository.findByUserId(userId);
    if (!settings || !settings.businessHours) {
      throw new Error("Configurações de horário de funcionamento não encontradas para este usuário.");
    }

    const { startTime, endTime, lunchStart, lunchEnd } = settings.businessHours;
    const timezone = settings.timezone || 'America/Sao_Paulo';
    const duration = settings.sessionDuration || 60;
    const operatingDays = settings.operatingDays || [1, 2, 3, 4, 5];

    // 2. Validar se o dia é operante (usando meio-dia local para segurança)
    const { start: startRange, end: endRange } = getUTCRangeForLocalDate(date, timezone);
    const midDayLocal = new Date(startRange.getTime() + 12 * 3600000);
    const localDetails = this.getLocalDetails(midDayLocal, timezone);

    if (!operatingDays.includes(localDetails.weekday)) {
      return [];
    }

    // 3. Buscar agendamentos e bloqueios usando a janela UTC real do dia local
    const [appointments, locks] = await Promise.all([
      this.repository.findByDateRange(userId, startRange, endRange),
      this.lockRepository.findByDateRange(userId, startRange, endRange)
    ]);

    // Verificação de bloqueio total no dia
    if (locks.some(l => l.type === 'total')) {
      return [];
    }

    // 4. Gerar slots
    const slots: string[] = [];
    let currentSlot = startTime;

    while (currentSlot < endTime) {
      const [sh, sm] = currentSlot.split(':').map(Number);

      // SlotStart e SlotEnd em UTC real
      const slotStart = new Date(startRange.getTime());
      slotStart.setUTCHours(startRange.getUTCHours() + sh, startRange.getUTCMinutes() + sm);

      const slotEnd = new Date(slotStart.getTime() + duration * 60000);

      // Formatar fim do slot localmente para comparação com endTime e lunchEnd
      const localEndDetails = this.getLocalDetails(slotEnd, timezone);
      const slotEndStr = localEndDetails.time;

      if (slotEndStr > endTime || slotEnd > endRange) {
        if (slotEndStr !== "00:00" || currentSlot >= endTime) break;
      }

      // Validar contra Almoço
      let isLunchConflict = false;
      if (lunchStart && lunchEnd) {
        if (
          (currentSlot >= lunchStart && currentSlot < lunchEnd) ||
          (slotEndStr > lunchStart && slotEndStr <= lunchEnd) ||
          (currentSlot <= lunchStart && slotEndStr >= lunchEnd)
        ) {
          isLunchConflict = true;
        }
      }

      if (!isLunchConflict) {
        // Validar contra Agendamentos
        const hasAppointmentConflict = appointments.some(app => {
          const appStart = new Date(app.startDate);
          const appEnd = new Date(app.endDate);
          return (slotStart < appEnd && slotEnd > appStart);
        });

        if (!hasAppointmentConflict) {
          // Validar contra Bloqueios Parciais
          const hasLockConflict = locks.some(lock => {
            if (lock.type === 'partial' && lock.startTime && lock.endTime) {
              return (currentSlot < lock.endTime && slotEndStr > lock.startTime);
            }
            return false;
          });

          if (!hasLockConflict) {
            slots.push(currentSlot);
          }
        }
      }

      // Calcular próximo slot
      const nextDate = new Date(slotStart.getTime() + duration * 60000);
      const nextDetails = this.getLocalDetails(nextDate, timezone);
      currentSlot = nextDetails.time;

      if (duration <= 0) break;
    }

    return slots;
  }
}