var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { injectable, inject } from "tsyringe";
let AgendaService = class AgendaService {
    repository;
    lockRepository;
    patientRepository;
    authRepository;
    logger;
    activityService;
    emailProvider;
    userRepository;
    constructor(repository, lockRepository, patientRepository, authRepository, logger, activityService, emailProvider, userRepository) {
        this.repository = repository;
        this.lockRepository = lockRepository;
        this.patientRepository = patientRepository;
        this.authRepository = authRepository;
        this.logger = logger;
        this.activityService = activityService;
        this.emailProvider = emailProvider;
        this.userRepository = userRepository;
    }
    normalizeStatus(status) {
        if (!status)
            return status;
        const mapping = {
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
    isPastDate(date) {
        const now = new Date();
        // Considera apenas o início do minuto para evitar falsos positivos por segundos
        const checkDate = new Date(date);
        checkDate.setSeconds(0, 0);
        const nowDate = new Date(now);
        nowDate.setSeconds(0, 0);
        return checkDate < nowDate;
    }
    async getAgendaById(id) {
        this.logger.info(`Buscando agenda por ID: ${id}`);
        return this.repository.findById(id);
    }
    async getAllAgendas() {
        this.logger.info("Buscando todas as agendas");
        return this.repository.findAll();
    }
    async getAgendasByUserId(userId) {
        this.logger.info(`Buscando agendas e bloqueios por usuário: ${userId}`);
        const [appointments, locks] = await Promise.all([
            this.repository.findByUserId(userId),
            this.lockRepository.findByUserId(userId)
        ]);
        return [...appointments, ...locks];
    }
    async getAgendasByPatientId(patientId) {
        this.logger.info(`Buscando agendas por paciente: ${patientId}`);
        return this.repository.findByPatientId(patientId);
    }
    async createAgenda(agenda) {
        this.logger.info(`Criando agenda para usuário: ${agenda.userId}`);
        if (!agenda.userId)
            throw new Error("Erro: userId é obrigatório.");
        if (!agenda.startDate || !agenda.endDate)
            throw new Error("Erro: startDate e endDate são obrigatórios.");
        const start = new Date(agenda.startDate);
        const end = new Date(agenda.endDate);
        if (this.isPastDate(start)) {
            throw new Error("Não é possível realizar agendamentos para datas passadas.");
        }
        if (agenda.status) {
            agenda.status = this.normalizeStatus(agenda.status);
        }
        // Verificar conflito com outros agendamentos
        const overlap = await this.repository.hasOverlap(agenda.userId, agenda.patientId, start, end);
        if (overlap) {
            throw new Error("Horário indisponível. Já existe um agendamento para este período.");
        }
        // Verificar conflito com bloqueios (Locks)
        const locks = await this.lockRepository.findByDateRange(agenda.userId, start, end);
        if (locks.length > 0) {
            // Verificação simplificada: se houver qualquer bloqueio no dia/período
            // Para bloqueios parciais, validamos o horário
            for (const lock of locks) {
                if (lock.type === 'total')
                    throw new Error("Horário indisponível devido a um bloqueio total na agenda.");
                if (lock.startTime && lock.endTime) {
                    const appointmentStartStr = start.toTimeString().substring(0, 5);
                    const appointmentEndStr = end.toTimeString().substring(0, 5);
                    if ((appointmentStartStr >= lock.startTime && appointmentStartStr < lock.endTime) ||
                        (appointmentEndStr > lock.startTime && appointmentEndStr <= lock.endTime) ||
                        (appointmentStartStr <= lock.startTime && appointmentEndStr >= lock.endTime)) {
                        throw new Error("Horário indisponível devido a um bloqueio parcial na agenda.");
                    }
                }
            }
        }
        const created = await this.repository.create(agenda);
        await this.activityService.logActivity({
            patientId: created.patientId,
            userId: created.userId,
            type: 'appointment_created',
            description: `Agendamento criado para ${new Date(created.startDate).toLocaleDateString('pt-BR')}`,
            metadata: { agendaId: created.id }
        }).catch(err => this.logger.error("Erro ao logar atividade", err));
        return created;
    }
    async updateAgenda(id, agenda) {
        this.logger.info(`Atualizando agenda: ${id}`);
        if (agenda.status) {
            agenda.status = this.normalizeStatus(agenda.status);
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
            let activityType = null;
            let description = "";
            if (agenda.status === 'completed') {
                activityType = 'appointment_completed';
                description = "Atendimento realizado";
            }
            else if (agenda.status === 'cancelled') {
                activityType = 'appointment_cancelled';
                description = "Atendimento cancelado";
            }
            else if (agenda.status === 'no_show') {
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
    async deleteAgenda(id) {
        this.logger.info(`Deletando agenda: ${id}`);
        return this.repository.delete(id);
    }
    async createLock(lock) {
        this.logger.info(`Criando bloqueio de agenda para usuário: ${lock.userId}`);
        if (lock.type === 'partial' && (!lock.startTime || !lock.endTime)) {
            throw new Error("Para bloqueios parciais, o horário de início e fim são obrigatórios.");
        }
        return this.lockRepository.create(lock);
    }
    async deleteLock(lockId) {
        this.logger.info(`Deletando bloqueio: ${lockId}`);
        return this.lockRepository.delete(lockId);
    }
    async createOnlineAppointment(params) {
        this.logger.info(`Tentativa de agendamento online via PIN`, { userId: params.userId });
        // 1. Validar Paciente pelo PIN
        const patient = await this.patientRepository.findByPin(params.userId, params.pin);
        if (!patient) {
            throw new Error("PIN ou Identificador de Usuário inválidos.");
        }
        // 2. Preparar datas
        const [hours, minutes] = params.time.split(':').map(Number);
        const startDate = new Date(params.date);
        startDate.setHours(hours, minutes, 0, 0);
        const endDate = new Date(startDate);
        endDate.setMinutes(endDate.getMinutes() + 60); // Padrão 1 hora
        // 3. Criar a agenda (reutilizando lógica de validação de createAgenda)
        const newAgenda = {
            userId: params.userId,
            patientId: patient.id,
            startDate,
            endDate,
            categoryId: params.categoryId,
            status: 'scheduled',
            description: "Agendamento realizado via portal do paciente."
        };
        const created = await this.createAgenda(newAgenda);
        // 4. Buscar dados do usuário (profissional) para enviar o e-mail
        const user = await this.userRepository.findById(params.userId);
        if (user && user.email) {
            this.sendAppointmentNotificationEmail(user.email, user.name, patient.name, startDate, params.categoryId);
        }
        return created;
    }
    async sendAppointmentNotificationEmail(to, userName, patientName, date, categoryId) {
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
            await this.emailProvider.sendEmail(message);
        }
        catch (error) {
            this.logger.error("Falha ao enviar email de notificação de agendamento", error);
        }
    }
};
AgendaService = __decorate([
    injectable(),
    __param(0, inject("IAgendaRepository")),
    __param(1, inject("IAgendaLockRepository")),
    __param(2, inject("IPatientRepository")),
    __param(3, inject("IAuthenticateRepository")),
    __param(4, inject("Logger")),
    __param(5, inject("IPatientActivityService")),
    __param(6, inject("EmailProvider")),
    __param(7, inject("IUserRepository")),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object, Function, Object])
], AgendaService);
export { AgendaService };
//# sourceMappingURL=AgendaService.js.map