import { injectable, inject } from "tsyringe";
import type { IAgendaRepository } from "../../domain/interfaces/IAgendaRepository.js";
import type { IAgendaService } from "../../domain/services/IAgendaService.js";
import type { Agenda } from "../../domain/entities/Agenda.js";
import type { ILogger } from "../../infrastructure/logging/Logger.js";

@injectable()
export class AgendaService implements IAgendaService {
  constructor(
    @inject("IAgendaRepository")
    private repository: IAgendaRepository,
    @inject("Logger")
    private logger: ILogger
  ) {}

  async getAgendaById(id: string): Promise<Agenda | null> {
    this.logger.info(`Buscando agenda por ID: ${id}`);
    return this.repository.findById(id);
  }

  async getAllAgendas(): Promise<Agenda[]> {
    this.logger.info("Buscando todas as agendas");
    return this.repository.findAll();
  }

  async getAgendasByUserId(userId: string): Promise<Agenda[]> {
    this.logger.info(`Buscando agendas por usuário: ${userId}`);
    return this.repository.findByUserId(userId);
  }

  async getAgendasByPatientId(patientId: string): Promise<Agenda[]> {
    this.logger.info(`Buscando agendas por paciente: ${patientId}`);
    return this.repository.findByPatientId(patientId);
  }

  async createAgenda(agenda: Omit<Agenda, 'id'>): Promise<Agenda> {
    this.logger.info(`Criando agenda para usuário: ${agenda.userId}`);
    
    if (!agenda.userId) throw new Error("Erro: userId é obrigatório para registrar a agenda.");
    if (!agenda.startDate || !agenda.endDate) throw new Error("Erro: startDate e endDate são obrigatórios.");

    const start = new Date(agenda.startDate);
    const end = new Date(agenda.endDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
       throw new Error("Erro: Formato de startDate ou endDate inválidos.");
    }

    const overlap = await this.repository.hasOverlap(agenda.userId, start, end);
    if (overlap) {
      throw new Error("Horário indisponível. Já existe um agendamento para este período.");
    }
    return this.repository.create(agenda as Agenda);
  }

  async updateAgenda(id: string, agenda: Partial<Agenda>): Promise<Agenda | null> {
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

  async deleteAgenda(id: string): Promise<boolean> {
    this.logger.info(`Deletando agenda: ${id}`);
    return this.repository.delete(id);
  }
}