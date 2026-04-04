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
    constructor(repository, logger) {
        this.repository = repository;
        this.logger = logger;
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
        const start = new Date(agenda.startDate);
        const end = new Date(agenda.endDate);
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            throw new Error("Erro: Formato de startDate ou endDate inválidos.");
        }
        const overlap = await this.repository.hasOverlap(agenda.userId, start, end);
        if (overlap) {
            throw new Error("Horário indisponível. Já existe um agendamento para este período.");
        }
        return this.repository.create(agenda);
    }
    async updateAgenda(id, agenda) {
        this.logger.info(`Atualizando agenda: ${id}`);
        // Se o update inclui intervalo de data, validar novamente
        if (agenda.startDate || agenda.endDate) {
            const existing = await this.repository.findById(id);
            if (existing) {
                const start = agenda.startDate ? new Date(agenda.startDate) : existing.startDate;
                const end = agenda.endDate ? new Date(agenda.endDate) : existing.endDate;
                const overlap = await this.repository.hasOverlap(existing.userId, start, end, id);
                if (overlap) {
                    throw new Error("Horário indisponível. Já existe um agendamento para este período.");
                }
            }
        }
        return this.repository.update(id, agenda);
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
    __metadata("design:paramtypes", [Object, Object])
], AgendaService);
export { AgendaService };
//# sourceMappingURL=AgendaService.js.map