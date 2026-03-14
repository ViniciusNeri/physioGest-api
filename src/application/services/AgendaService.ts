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

  async createAgenda(agenda: Omit<Agenda, 'id'>): Promise<Agenda> {
    this.logger.info(`Criando agenda para usuário: ${agenda.userId}`);
    return this.repository.create(agenda);
  }

  async updateAgenda(id: string, agenda: Partial<Agenda>): Promise<Agenda | null> {
    this.logger.info(`Atualizando agenda: ${id}`);
    return this.repository.update(id, agenda);
  }

  async deleteAgenda(id: string): Promise<boolean> {
    this.logger.info(`Deletando agenda: ${id}`);
    return this.repository.delete(id);
  }
}