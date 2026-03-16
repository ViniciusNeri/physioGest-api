import { injectable, inject } from "tsyringe";
import type { IPatientAgendaRepository } from "../../domain/interfaces/IPatientSubdomainRepositories.js";
import type { IPatientAgendaService } from "../../domain/services/IPatientSubdomainServices.js";
import type { PatientAgenda } from "../../domain/entities/PatientSubdomains.js";
import logger from "../../infrastructure/logging/Logger.js";

@injectable()
export class PatientAgendaService implements IPatientAgendaService {
  constructor(
    @inject("IPatientAgendaRepository")
    private repository: IPatientAgendaRepository
  ) {}

  async getPatientAgenda(patientId: string): Promise<PatientAgenda[]> {
    logger.debug("Buscando agenda do paciente", { patientId });

    try {
      const agenda = await this.repository.findByPatientId(patientId);
      logger.debug("Agenda do paciente encontrada", { patientId, count: agenda.length });
      return agenda;
    } catch (error) {
      logger.error("Erro ao buscar agenda do paciente", error, { patientId });
      throw error;
    }
  }

  async getAgendaById(id: string): Promise<PatientAgenda | null> {
    logger.debug("Buscando agendamento por ID", { agendaId: id });

    try {
      const agenda = await this.repository.findById(id);
      if (agenda) {
        logger.debug("Agendamento encontrado", { agendaId: id, patientId: agenda.patientId });
      } else {
        logger.warn("Agendamento não encontrado", { agendaId: id });
      }
      return agenda;
    } catch (error) {
      logger.error("Erro ao buscar agendamento por ID", error, { agendaId: id });
      throw error;
    }
  }

  async createAgenda(agenda: Omit<PatientAgenda, 'id'>): Promise<PatientAgenda> {
    logger.debug("Criando novo agendamento", { patientId: agenda.patientId });

    try {
      const newAgenda = await this.repository.create(agenda);
      logger.info("Agendamento criado com sucesso", { agendaId: newAgenda.id, patientId: agenda.patientId });
      return newAgenda;
    } catch (error) {
      logger.error("Erro ao criar agendamento", error, { patientId: agenda.patientId });
      throw error;
    }
  }

  async updateAgenda(id: string, agenda: Partial<PatientAgenda>): Promise<PatientAgenda | null> {
    logger.debug("Atualizando agendamento", { agendaId: id });

    try {
      const updatedAgenda = await this.repository.update(id, agenda);
      if (updatedAgenda) {
        logger.info("Agendamento atualizado com sucesso", { agendaId: id });
      } else {
        logger.warn("Agendamento não encontrado para atualização", { agendaId: id });
      }
      return updatedAgenda;
    } catch (error) {
      logger.error("Erro ao atualizar agendamento", error, { agendaId: id });
      throw error;
    }
  }

  async deleteAgenda(id: string): Promise<boolean> {
    logger.debug("Deletando agendamento", { agendaId: id });

    try {
      const deleted = await this.repository.delete(id);
      if (deleted) {
        logger.info("Agendamento deletado com sucesso", { agendaId: id });
      } else {
        logger.warn("Agendamento não encontrado para deleção", { agendaId: id });
      }
      return deleted;
    } catch (error) {
      logger.error("Erro ao deletar agendamento", error, { agendaId: id });
      throw error;
    }
  }

  async getUpcomingAgenda(patientId: string, limit?: number): Promise<PatientAgenda[]> {
    logger.debug("Buscando próximos agendamentos", { patientId, limit });

    try {
      const agenda = await this.repository.findUpcomingByPatientId(patientId, limit);
      logger.debug("Próximos agendamentos encontrados", { patientId, count: agenda.length });
      return agenda;
    } catch (error) {
      logger.error("Erro ao buscar próximos agendamentos", error, { patientId });
      throw error;
    }
  }

  async getAgendaByDateRange(patientId: string, startDate: Date, endDate: Date): Promise<PatientAgenda[]> {
    logger.debug("Buscando agendamentos por período", { patientId, startDate, endDate });

    try {
      const agenda = await this.repository.findByDateRange(patientId, startDate, endDate);
      logger.debug("Agendamentos do período encontrados", { patientId, count: agenda.length });
      return agenda;
    } catch (error) {
      logger.error("Erro ao buscar agendamentos por período", error, { patientId, startDate, endDate });
      throw error;
    }
  }
}