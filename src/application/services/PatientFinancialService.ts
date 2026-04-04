import { injectable, inject } from "tsyringe";
import type { IPatientFinancialRepository } from "../../domain/interfaces/IPatientSubdomainRepositories.js";
import type { IAgendaRepository } from "../../domain/interfaces/IAgendaRepository.js";
import type { IPatientFinancialService } from "../../domain/services/IPatientSubdomainServices.js";
import type { PatientFinancial, PatientFinancialSummary } from "../../domain/entities/PatientSubdomains.js";
import logger from "../../infrastructure/logging/Logger.js";

@injectable()
export class PatientFinancialService implements IPatientFinancialService {
  constructor(
    @inject("IPatientFinancialRepository")
    private repository: IPatientFinancialRepository,
    @inject("IAgendaRepository")
    private agendaRepository: IAgendaRepository
  ) {}

  async getPatientFinancial(patientId: string): Promise<PatientFinancial[]> {
    logger.debug("Buscando financeiro do paciente", { patientId });

    try {
      const financial = await this.repository.findByPatientId(patientId);
      logger.debug("Registros financeiros do paciente encontrados", { patientId, count: financial.length });
      return financial;
    } catch (error) {
      logger.error("Erro ao buscar financeiro do paciente", error, { patientId });
      throw error;
    }
  }

  async getFinancialById(id: string): Promise<PatientFinancial | null> {
    logger.debug("Buscando registro financeiro por ID", { financialId: id });

    try {
      const financial = await this.repository.findById(id);
      if (financial) {
        logger.debug("Registro financeiro encontrado", { financialId: id, patientId: financial.patientId });
      } else {
        logger.warn("Registro financeiro não encontrado", { financialId: id });
      }
      return financial;
    } catch (error) {
      logger.error("Erro ao buscar registro financeiro por ID", error, { financialId: id });
      throw error;
    }
  }

  async createFinancial(financial: Omit<PatientFinancial, 'id'>): Promise<PatientFinancial> {
    logger.debug("Criando novo registro financeiro", { patientId: financial.patientId, type: financial.type });

    try {
      const newFinancial = await this.repository.create(financial);
      logger.info("Registro financeiro criado com sucesso", {
        financialId: newFinancial.id,
        patientId: financial.patientId,
        amount: financial.amount
      });
      return newFinancial;
    } catch (error) {
      logger.error("Erro ao criar registro financeiro", error, { patientId: financial.patientId });
      throw error;
    }
  }

  async updateFinancial(id: string, financial: Partial<PatientFinancial>): Promise<PatientFinancial | null> {
    logger.debug("Atualizando registro financeiro", { financialId: id });

    try {
      const updatedFinancial = await this.repository.update(id, financial);
      if (updatedFinancial) {
        logger.info("Registro financeiro atualizado com sucesso", { financialId: id });
      } else {
        logger.warn("Registro financeiro não encontrado para atualização", { financialId: id });
      }
      return updatedFinancial;
    } catch (error) {
      logger.error("Erro ao atualizar registro financeiro", error, { financialId: id });
      throw error;
    }
  }

  async deleteFinancial(id: string): Promise<boolean> {
    logger.debug("Deletando registro financeiro", { financialId: id });

    try {
      const deleted = await this.repository.delete(id);
      if (deleted) {
        logger.info("Registro financeiro deletado com sucesso", { financialId: id });
      } else {
        logger.warn("Registro financeiro não encontrado para deleção", { financialId: id });
      }
      return deleted;
    } catch (error) {
      logger.error("Erro ao deletar registro financeiro", error, { financialId: id });
      throw error;
    }
  }

  async getPatientBalance(patientId: string): Promise<number> {
    logger.debug("Calculando saldo do paciente", { patientId });

    try {
      const balance = await this.repository.getBalanceByPatientId(patientId);
      logger.debug("Saldo do paciente calculado", { patientId, balance });
      return balance;
    } catch (error) {
      logger.error("Erro ao calcular saldo do paciente", error, { patientId });
      throw error;
    }
  }

  async getPendingPayments(patientId: string): Promise<PatientFinancial[]> {
    logger.debug("Buscando pagamentos pendentes do paciente", { patientId });

    try {
      const payments = await this.repository.findPendingPaymentsByPatientId(patientId);
      logger.debug("Pagamentos pendentes encontrados", { patientId, count: payments.length });
      return payments;
    } catch (error) {
      logger.error("Erro ao buscar pagamentos pendentes", error, { patientId });
      throw error;
    }
  }

  async getFinancialByDateRange(patientId: string, startDate: Date, endDate: Date): Promise<PatientFinancial[]> {
    logger.debug("Buscando registros financeiros por período", { patientId, startDate, endDate });

    try {
      const financial = await this.repository.findByDateRange(patientId, startDate, endDate);
      logger.debug("Registros financeiros do período encontrados", { patientId, count: financial.length });
      return financial;
    } catch (error) {
      logger.error("Erro ao buscar registros financeiros por período", error, { patientId, startDate, endDate });
      throw error;
    }
  }

  async getFinancialSummary(patientId: string): Promise<PatientFinancialSummary> {
    logger.debug("Gerando resumo financeiro do paciente", { patientId });

    try {
      const financialRecords = await this.repository.findByPatientId(patientId);
      const agendas = await this.agendaRepository.findByPatientId(patientId);

      let outstandingBalance = 0;
      let totalPaidAmount = 0;
      let totalContractedSessions = 0;

      financialRecords.forEach(record => {
        if (record.status === 'pending') {
          outstandingBalance += record.amount;
        } else if (record.status === 'paid') {
          totalPaidAmount += record.amount;
        }

        // Soma sessões apenas de entradas (income)
        if (record.type === 'income' && record.totalSessions) {
          totalContractedSessions += record.totalSessions;
        }
      });

      const completedSessions = agendas.filter(a => a.status === 'completed').length;
      const remainingSessions = Math.max(0, totalContractedSessions - completedSessions);

      return {
        outstandingBalance,
        totalSessions: remainingSessions,
        totalPaidAmount,
        payments: financialRecords
      };
    } catch (error) {
      logger.error("Erro ao gerar resumo financeiro", error, { patientId });
      throw error;
    }
  }

  async payFinancial(id: string, paymentMethod?: string): Promise<PatientFinancial | null> {
    logger.debug("Marcando registro financeiro como pago", { financialId: id });

    try {
      const updates: Partial<PatientFinancial> = {
        status: 'paid',
        paymentDate: new Date()
      };

      if (paymentMethod) {
        updates.paymentMethod = paymentMethod as any;
      }

      const updatedFinancial = await this.repository.update(id, updates);
      if (updatedFinancial) {
        logger.info("Registro financeiro marcado como pago com sucesso", { financialId: id });
      } else {
        logger.warn("Registro financeiro não encontrado para pagamento", { financialId: id });
      }
      return updatedFinancial;
    } catch (error) {
      logger.error("Erro ao marcar registro financeiro como pago", error, { financialId: id });
      throw error;
    }
  }
}