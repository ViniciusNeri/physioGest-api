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
    async createAgenda(agenda) {
        this.logger.info(`Criando agenda para usuário: ${agenda.userId}`);
        return this.repository.create(agenda);
    }
    async updateAgenda(id, agenda) {
        this.logger.info(`Atualizando agenda: ${id}`);
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