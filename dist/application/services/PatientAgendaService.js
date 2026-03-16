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
import logger from "../../infrastructure/logging/Logger.js";
let PatientAgendaService = class PatientAgendaService {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async getPatientAgenda(patientId) {
        logger.debug("Buscando agenda do paciente", { patientId });
        try {
            const agenda = await this.repository.findByPatientId(patientId);
            logger.debug("Agenda do paciente encontrada", { patientId, count: agenda.length });
            return agenda;
        }
        catch (error) {
            logger.error("Erro ao buscar agenda do paciente", error, { patientId });
            throw error;
        }
    }
    async getAgendaById(id) {
        logger.debug("Buscando agendamento por ID", { agendaId: id });
        try {
            const agenda = await this.repository.findById(id);
            if (agenda) {
                logger.debug("Agendamento encontrado", { agendaId: id, patientId: agenda.patientId });
            }
            else {
                logger.warn("Agendamento não encontrado", { agendaId: id });
            }
            return agenda;
        }
        catch (error) {
            logger.error("Erro ao buscar agendamento por ID", error, { agendaId: id });
            throw error;
        }
    }
    async createAgenda(agenda) {
        logger.debug("Criando novo agendamento", { patientId: agenda.patientId });
        try {
            const newAgenda = await this.repository.create(agenda);
            logger.info("Agendamento criado com sucesso", { agendaId: newAgenda.id, patientId: agenda.patientId });
            return newAgenda;
        }
        catch (error) {
            logger.error("Erro ao criar agendamento", error, { patientId: agenda.patientId });
            throw error;
        }
    }
    async updateAgenda(id, agenda) {
        logger.debug("Atualizando agendamento", { agendaId: id });
        try {
            const updatedAgenda = await this.repository.update(id, agenda);
            if (updatedAgenda) {
                logger.info("Agendamento atualizado com sucesso", { agendaId: id });
            }
            else {
                logger.warn("Agendamento não encontrado para atualização", { agendaId: id });
            }
            return updatedAgenda;
        }
        catch (error) {
            logger.error("Erro ao atualizar agendamento", error, { agendaId: id });
            throw error;
        }
    }
    async deleteAgenda(id) {
        logger.debug("Deletando agendamento", { agendaId: id });
        try {
            const deleted = await this.repository.delete(id);
            if (deleted) {
                logger.info("Agendamento deletado com sucesso", { agendaId: id });
            }
            else {
                logger.warn("Agendamento não encontrado para deleção", { agendaId: id });
            }
            return deleted;
        }
        catch (error) {
            logger.error("Erro ao deletar agendamento", error, { agendaId: id });
            throw error;
        }
    }
    async getUpcomingAgenda(patientId, limit) {
        logger.debug("Buscando próximos agendamentos", { patientId, limit });
        try {
            const agenda = await this.repository.findUpcomingByPatientId(patientId, limit);
            logger.debug("Próximos agendamentos encontrados", { patientId, count: agenda.length });
            return agenda;
        }
        catch (error) {
            logger.error("Erro ao buscar próximos agendamentos", error, { patientId });
            throw error;
        }
    }
    async getAgendaByDateRange(patientId, startDate, endDate) {
        logger.debug("Buscando agendamentos por período", { patientId, startDate, endDate });
        try {
            const agenda = await this.repository.findByDateRange(patientId, startDate, endDate);
            logger.debug("Agendamentos do período encontrados", { patientId, count: agenda.length });
            return agenda;
        }
        catch (error) {
            logger.error("Erro ao buscar agendamentos por período", error, { patientId, startDate, endDate });
            throw error;
        }
    }
};
PatientAgendaService = __decorate([
    injectable(),
    __param(0, inject("IPatientAgendaRepository")),
    __metadata("design:paramtypes", [Object])
], PatientAgendaService);
export { PatientAgendaService };
//# sourceMappingURL=PatientAgendaService.js.map