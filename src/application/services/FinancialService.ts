import { injectable, inject } from "tsyringe";
import type { IFinancialRepository } from "../../domain/interfaces/IFinancialRepository.js";
import type { IFinancialService } from "../../domain/services/IFinancialService.js";
import type { Financial } from "../../domain/entities/Financial.js";
import type { ILogger } from "../../infrastructure/logging/Logger.js";

@injectable()
export class FinancialService implements IFinancialService {
  constructor(
    @inject("IFinancialRepository")
    private repository: IFinancialRepository,
    @inject("Logger")
    private logger: ILogger
  ) {}

  async getFinancialById(id: string): Promise<Financial | null> {
    this.logger.info(`Buscando registro financeiro por ID: ${id}`);
    return this.repository.findById(id);
  }

  async getAllFinancials(): Promise<Financial[]> {
    this.logger.info("Buscando todos os registros financeiros");
    return this.repository.findAll();
  }

  async getFinancialsByUserId(userId: string): Promise<Financial[]> {
    this.logger.info(`Buscando registros financeiros por usuário: ${userId}`);
    return this.repository.findByUserId(userId);
  }

  async getFinancialsByPatientId(patientId: string): Promise<Financial[]> {
    this.logger.info(`Buscando registros financeiros por paciente: ${patientId}`);
    return this.repository.findByPatientId(patientId);
  }

  async createFinancial(financial: Omit<Financial, 'id'>): Promise<Financial> {
    this.logger.info(`Criando registro financeiro para usuário: ${financial.userId}`);
    return this.repository.create(financial);
  }

  async updateFinancial(id: string, financial: Partial<Financial>): Promise<Financial | null> {
    this.logger.info(`Atualizando registro financeiro: ${id}`);
    return this.repository.update(id, financial);
  }

  async deleteFinancial(id: string): Promise<boolean> {
    this.logger.info(`Deletando registro financeiro: ${id}`);
    return this.repository.delete(id);
  }
}