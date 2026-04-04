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
let PatientFinancialService = class PatientFinancialService {
    repository;
    agendaRepository;
    constructor(repository, agendaRepository) {
        this.repository = repository;
        this.agendaRepository = agendaRepository;
    }
    async getPatientFinancial(patientId) {
        logger.debug("Buscando financeiro do paciente", { patientId });
        try {
            const financial = await this.repository.findByPatientId(patientId);
            logger.debug("Registros financeiros do paciente encontrados", { patientId, count: financial.length });
            return financial;
        }
        catch (error) {
            logger.error("Erro ao buscar financeiro do paciente", error, { patientId });
            throw error;
        }
    }
    async getFinancialById(id) {
        logger.debug("Buscando registro financeiro por ID", { financialId: id });
        try {
            const financial = await this.repository.findById(id);
            if (financial) {
                logger.debug("Registro financeiro encontrado", { financialId: id, patientId: financial.patientId });
            }
            else {
                logger.warn("Registro financeiro não encontrado", { financialId: id });
            }
            return financial;
        }
        catch (error) {
            logger.error("Erro ao buscar registro financeiro por ID", error, { financialId: id });
            throw error;
        }
    }
    async createFinancial(financial) {
        logger.debug("Criando novo registro financeiro", { patientId: financial.patientId, type: financial.type });
        try {
            const newFinancial = await this.repository.create(financial);
            logger.info("Registro financeiro criado com sucesso", {
                financialId: newFinancial.id,
                patientId: financial.patientId,
                amount: financial.amount
            });
            return newFinancial;
        }
        catch (error) {
            logger.error("Erro ao criar registro financeiro", error, { patientId: financial.patientId });
            throw error;
        }
    }
    async updateFinancial(id, financial) {
        logger.debug("Atualizando registro financeiro", { financialId: id });
        try {
            const updatedFinancial = await this.repository.update(id, financial);
            if (updatedFinancial) {
                logger.info("Registro financeiro atualizado com sucesso", { financialId: id });
            }
            else {
                logger.warn("Registro financeiro não encontrado para atualização", { financialId: id });
            }
            return updatedFinancial;
        }
        catch (error) {
            logger.error("Erro ao atualizar registro financeiro", error, { financialId: id });
            throw error;
        }
    }
    async deleteFinancial(id) {
        logger.debug("Deletando registro financeiro", { financialId: id });
        try {
            const deleted = await this.repository.delete(id);
            if (deleted) {
                logger.info("Registro financeiro deletado com sucesso", { financialId: id });
            }
            else {
                logger.warn("Registro financeiro não encontrado para deleção", { financialId: id });
            }
            return deleted;
        }
        catch (error) {
            logger.error("Erro ao deletar registro financeiro", error, { financialId: id });
            throw error;
        }
    }
    async getPatientBalance(patientId) {
        logger.debug("Calculando saldo do paciente", { patientId });
        try {
            const balance = await this.repository.getBalanceByPatientId(patientId);
            logger.debug("Saldo do paciente calculado", { patientId, balance });
            return balance;
        }
        catch (error) {
            logger.error("Erro ao calcular saldo do paciente", error, { patientId });
            throw error;
        }
    }
    async getPendingPayments(patientId) {
        logger.debug("Buscando pagamentos pendentes do paciente", { patientId });
        try {
            const payments = await this.repository.findPendingPaymentsByPatientId(patientId);
            logger.debug("Pagamentos pendentes encontrados", { patientId, count: payments.length });
            return payments;
        }
        catch (error) {
            logger.error("Erro ao buscar pagamentos pendentes", error, { patientId });
            throw error;
        }
    }
    async getFinancialByDateRange(patientId, startDate, endDate) {
        logger.debug("Buscando registros financeiros por período", { patientId, startDate, endDate });
        try {
            const financial = await this.repository.findByDateRange(patientId, startDate, endDate);
            logger.debug("Registros financeiros do período encontrados", { patientId, count: financial.length });
            return financial;
        }
        catch (error) {
            logger.error("Erro ao buscar registros financeiros por período", error, { patientId, startDate, endDate });
            throw error;
        }
    }
    async getFinancialSummary(patientId) {
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
                }
                else if (record.status === 'paid') {
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
        }
        catch (error) {
            logger.error("Erro ao gerar resumo financeiro", error, { patientId });
            throw error;
        }
    }
    async payFinancial(id, paymentMethod) {
        logger.debug("Marcando registro financeiro como pago", { financialId: id });
        try {
            const updates = {
                status: 'paid',
                paymentDate: new Date()
            };
            if (paymentMethod) {
                updates.paymentMethod = paymentMethod;
            }
            const updatedFinancial = await this.repository.update(id, updates);
            if (updatedFinancial) {
                logger.info("Registro financeiro marcado como pago com sucesso", { financialId: id });
            }
            else {
                logger.warn("Registro financeiro não encontrado para pagamento", { financialId: id });
            }
            return updatedFinancial;
        }
        catch (error) {
            logger.error("Erro ao marcar registro financeiro como pago", error, { financialId: id });
            throw error;
        }
    }
};
PatientFinancialService = __decorate([
    injectable(),
    __param(0, inject("IPatientFinancialRepository")),
    __param(1, inject("IAgendaRepository")),
    __metadata("design:paramtypes", [Object, Object])
], PatientFinancialService);
export { PatientFinancialService };
//# sourceMappingURL=PatientFinancialService.js.map