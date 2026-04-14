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
import { getNaiveNowString, toLocalISOString } from "../../utils/dateUtils.js";
let PatientFinancialService = class PatientFinancialService {
    repository;
    agendaRepository;
    activityService;
    logger;
    settingRepository;
    constructor(repository, agendaRepository, activityService, logger, settingRepository) {
        this.repository = repository;
        this.agendaRepository = agendaRepository;
        this.activityService = activityService;
        this.logger = logger;
        this.settingRepository = settingRepository;
    }
    async getPatientFinancial(patientId) {
        this.logger.debug("Buscando financeiro do paciente", { patientId });
        try {
            const financial = await this.repository.findByPatientId(patientId);
            this.logger.debug("Registros financeiros do paciente encontrados", { patientId, count: financial.length });
            return financial;
        }
        catch (error) {
            this.logger.error("Erro ao buscar financeiro do paciente", error, { patientId });
            throw error;
        }
    }
    async getFinancialById(id) {
        this.logger.debug("Buscando registro financeiro por ID", { financialId: id });
        try {
            const financial = await this.repository.findById(id);
            if (financial) {
                this.logger.debug("Registro financeiro encontrado", { financialId: id, patientId: financial.patientId });
            }
            else {
                this.logger.warn("Registro financeiro não encontrado", { financialId: id });
            }
            return financial;
        }
        catch (error) {
            this.logger.error("Erro ao buscar registro financeiro por ID", error, { financialId: id });
            throw error;
        }
    }
    async createFinancial(financial) {
        this.logger.debug("Criando novo registro financeiro", { patientId: financial.patientId, type: financial.type });
        try {
            const normalized = { ...financial };
            if (normalized.date)
                normalized.date = toLocalISOString(normalized.date);
            if (normalized.dueDate)
                normalized.dueDate = toLocalISOString(normalized.dueDate);
            if (normalized.paymentDate)
                normalized.paymentDate = toLocalISOString(normalized.paymentDate);
            const newFinancial = await this.repository.create(normalized);
            await this.activityService.logActivity({
                patientId: newFinancial.patientId,
                userId: newFinancial.userId || "",
                type: newFinancial.status === 'paid' ? 'payment_paid' : 'payment_pending',
                description: `Pagamento ${newFinancial.status === 'paid' ? 'realizado' : 'pendente'}: R$ ${newFinancial.amount.toFixed(2)}`,
                metadata: { financialId: newFinancial.id }
            }).catch(err => this.logger.error("Erro ao logar atividade (create financial)", err));
            this.logger.info("Registro financeiro criado com sucesso", {
                financialId: newFinancial.id,
                patientId: financial.patientId,
                amount: financial.amount
            });
            return newFinancial;
        }
        catch (error) {
            this.logger.error("Erro ao criar registro financeiro", error, { patientId: financial.patientId });
            throw error;
        }
    }
    async updateFinancial(id, financial) {
        this.logger.debug("Atualizando registro financeiro", { financialId: id });
        try {
            const normalized = { ...financial };
            if (normalized.date)
                normalized.date = toLocalISOString(normalized.date);
            if (normalized.dueDate)
                normalized.dueDate = toLocalISOString(normalized.dueDate);
            if (normalized.paymentDate)
                normalized.paymentDate = toLocalISOString(normalized.paymentDate);
            const updatedFinancial = await this.repository.update(id, normalized);
            if (updatedFinancial) {
                this.logger.info("Registro financeiro atualizado com sucesso", { financialId: id });
            }
            else {
                this.logger.warn("Registro financeiro não encontrado para atualização", { financialId: id });
            }
            return updatedFinancial;
        }
        catch (error) {
            this.logger.error("Erro ao atualizar registro financeiro", error, { financialId: id });
            throw error;
        }
    }
    async deleteFinancial(id) {
        this.logger.debug("Deletando registro financeiro", { financialId: id });
        try {
            const deleted = await this.repository.delete(id);
            if (deleted) {
                this.logger.info("Registro financeiro deletado com sucesso", { financialId: id });
            }
            else {
                this.logger.warn("Registro financeiro não encontrado para deleção", { financialId: id });
            }
            return deleted;
        }
        catch (error) {
            this.logger.error("Erro ao deletar registro financeiro", error, { financialId: id });
            throw error;
        }
    }
    async getPatientBalance(patientId) {
        this.logger.debug("Calculando saldo do paciente", { patientId });
        try {
            const balance = await this.repository.getBalanceByPatientId(patientId);
            this.logger.debug("Saldo do paciente calculado", { patientId, balance });
            return balance;
        }
        catch (error) {
            this.logger.error("Erro ao calcular saldo do paciente", error, { patientId });
            throw error;
        }
    }
    async getPendingPayments(patientId) {
        this.logger.debug("Buscando pagamentos pendentes do paciente", { patientId });
        try {
            const payments = await this.repository.findPendingPaymentsByPatientId(patientId);
            this.logger.debug("Pagamentos pendentes encontrados", { patientId, count: payments.length });
            return payments;
        }
        catch (error) {
            this.logger.error("Erro ao buscar pagamentos pendentes", error, { patientId });
            throw error;
        }
    }
    async getFinancialByDateRange(patientId, startDate, endDate) {
        this.logger.debug("Buscando registros financeiros por período", { patientId, startDate, endDate });
        try {
            const financial = await this.repository.findByDateRange(patientId, startDate, endDate);
            this.logger.debug("Registros financeiros do período encontrados", { patientId, count: financial.length });
            return financial;
        }
        catch (error) {
            this.logger.error("Erro ao buscar registros financeiros por período", error, { patientId, startDate, endDate });
            throw error;
        }
    }
    async getFinancialSummary(patientId) {
        this.logger.debug("Gerando resumo financeiro do paciente", { patientId });
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
            this.logger.error("Erro ao gerar resumo financeiro", error, { patientId });
            throw error;
        }
    }
    async payFinancial(id, paymentMethod) {
        this.logger.debug("Marcando registro financeiro como pago", { financialId: id });
        try {
            // Buscar timezone
            const existing = await this.repository.findById(id);
            let timezone = 'America/Sao_Paulo';
            if (existing?.userId) {
                const settings = await this.settingRepository.findByUserId(existing.userId);
                if (settings?.timezone)
                    timezone = settings.timezone;
            }
            const updates = {
                status: 'paid',
                paymentDate: getNaiveNowString(timezone)
            };
            if (paymentMethod) {
                updates.paymentMethod = paymentMethod;
            }
            const updatedFinancial = await this.repository.update(id, updates);
            if (updatedFinancial) {
                await this.activityService.logActivity({
                    patientId: updatedFinancial.patientId,
                    userId: updatedFinancial.userId || "",
                    type: 'payment_paid',
                    description: `Pagamento realizado: R$ ${updatedFinancial.amount.toFixed(2)}`,
                    metadata: { financialId: id }
                }).catch(err => this.logger.error("Erro ao logar atividade (pay financial)", err));
                this.logger.info("Registro financeiro marcado como pago com sucesso", { financialId: id });
            }
            else {
                this.logger.warn("Registro financeiro não encontrado para pagamento", { financialId: id });
            }
            return updatedFinancial;
        }
        catch (error) {
            this.logger.error("Erro ao marcar registro financeiro como pago", error, { financialId: id });
            throw error;
        }
    }
};
PatientFinancialService = __decorate([
    injectable(),
    __param(0, inject("IPatientFinancialRepository")),
    __param(1, inject("IAgendaRepository")),
    __param(2, inject("IPatientActivityService")),
    __param(3, inject("Logger")),
    __param(4, inject("ISettingRepository")),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object])
], PatientFinancialService);
export { PatientFinancialService };
//# sourceMappingURL=PatientFinancialService.js.map