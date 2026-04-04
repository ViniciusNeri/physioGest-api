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
    logger;
    activityService;
    constructor(repository, logger, activityService) {
        this.repository = repository;
        this.logger = logger;
        this.activityService = activityService;
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
    async getAgendaById(id) {
        this.logger.info(`Buscando agenda por ID: ${id}`);
        return this.repository.findById(id);
    }
    async getAllAgendas() {
        this.logger.info("Buscando todas as agendas");
        return this.repository.findAll();
    }
    async getAgendasByUserId(userId) {
        this.logger.info(`Buscando agendas por usuário: ${userId}`);
        return this.repository.findByUserId(userId);
    }
    async getAgendasByPatientId(patientId) {
        this.logger.info(`Buscando agendas por paciente: ${patientId}`);
        return this.repository.findByPatientId(patientId);
    }
    async createAgenda(agenda) {
        this.logger.info(`Criando agenda para usuário: ${agenda.userId}`);
        if (!agenda.userId)
            throw new Error("Erro: userId é obrigatório para registrar a agenda.");
        if (!agenda.startDate || !agenda.endDate)
            throw new Error("Erro: startDate e endDate são obrigatórios.");
        // Normaliza o status se vier em português
        if (agenda.status) {
            agenda.status = this.normalizeStatus(agenda.status);
        }
        const start = new Date(agenda.startDate);
        const end = new Date(agenda.endDate);
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            throw new Error("Erro: Formato de startDate ou endDate inválidos.");
        }
        console.log(`[AgendaService.create] Verificando conflito: ${start.toISOString()} - ${end.toISOString()} para usuário ${agenda.userId} e paciente ${agenda.patientId}`);
        const overlap = await this.repository.hasOverlap(agenda.userId, agenda.patientId, start, end);
        if (overlap) {
            console.log(`[AgendaService.create] Conflito impediu gravação.`);
            throw new Error("Horário indisponível. Já existe um agendamento para este período.");
        }
        const created = await this.repository.create(agenda);
        // Registra atividade
        await this.activityService.logActivity({
            patientId: created.patientId,
            userId: created.userId,
            type: 'appointment_created',
            description: `Agendamento criado para ${new Date(created.startDate).toLocaleDateString('pt-BR')}`,
            metadata: { agendaId: created.id }
        }).catch(err => this.logger.error("Erro ao logar atividade (create agenda)", err));
        return created;
    }
    async updateAgenda(id, agenda) {
        this.logger.info(`Atualizando agenda: ${id}`);
        // Normaliza o status se vier em português
        if (agenda.status) {
            agenda.status = this.normalizeStatus(agenda.status);
        }
        // Se o update inclui intervalo de data, validar novamente
        if (agenda.startDate || agenda.endDate) {
            const existing = await this.repository.findById(id);
            if (existing) {
                const start = agenda.startDate ? new Date(agenda.startDate) : existing.startDate;
                const end = agenda.endDate ? new Date(agenda.endDate) : existing.endDate;
                const patientId = agenda.patientId || existing.patientId;
                console.log(`[AgendaService.update] Verificando conflito para update: ${start.toISOString()} - ${end.toISOString()} (excluindo ID ${id})`);
                const overlap = await this.repository.hasOverlap(existing.userId, patientId, start, end, id);
                if (overlap) {
                    console.log(`[AgendaService.update] Conflito impediu atualização.`);
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
                }).catch(err => this.logger.error("Erro ao logar atividade (update agenda)", err));
            }
        }
        return updated;
    }
    async deleteAgenda(id) {
        this.logger.info(`Deletando agenda: ${id}`);
        return this.repository.delete(id);
    }
};
AgendaService = __decorate([
    injectable(),
    __param(0, inject("IAgendaRepository")),
    __param(1, inject("Logger")),
    __param(2, inject("IPatientActivityService")),
    __metadata("design:paramtypes", [Object, Object, Object])
], AgendaService);
export { AgendaService };
//# sourceMappingURL=AgendaService.js.map