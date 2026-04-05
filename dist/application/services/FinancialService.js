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
let FinancialService = class FinancialService {
    repository;
    patientFinancialRepository;
    patientRepository;
    logger;
    constructor(repository, patientFinancialRepository, patientRepository, logger) {
        this.repository = repository;
        this.patientFinancialRepository = patientFinancialRepository;
        this.patientRepository = patientRepository;
        this.logger = logger;
    }
    async getMonthlyConsolidated(userId, month, year) {
        this.logger.info(`Gerando resumo consolidado para usuário ${userId}, mês ${month}, ano ${year}`);
        // Busca registros das duas fontes
        const clinicFinancials = await this.repository.findByFilters(userId, month, year);
        const patientFinancials = await this.patientFinancialRepository.findByUserAndDate(userId, month, year);
        let totalIncome = 0;
        let totalExpenses = 0;
        let pendingTotal = 0;
        let expensesTotal = 0; // Para o antigo 'fixedExpenses' agora chamado 'expenses'
        let variableExpensesTotal = 0;
        const incomeByMethod = {};
        const expenseByMethod = {};
        const expensesByCategory = {};
        const cashFlow = [];
        const patientIds = new Set();
        // Processa registros da clínica
        clinicFinancials.forEach((item) => {
            const amount = item.amount;
            const method = item.paymentMethod || 'other';
            if (item.type === 'income') {
                totalIncome += amount;
                incomeByMethod[method] = (incomeByMethod[method] || 0) + amount;
            }
            else {
                totalExpenses += amount;
                expenseByMethod[method] = (expenseByMethod[method] || 0) + amount;
                // Agrupamento por categoria
                const category = item.category || 'Outros';
                expensesByCategory[category] = (expensesByCategory[category] || 0) + amount;
                if (item.expenseType === 'fixed') {
                    expensesTotal += amount;
                }
                else if (item.expenseType === 'variable') {
                    variableExpensesTotal += amount;
                }
            }
            if (item.patientId)
                patientIds.add(item.patientId);
            cashFlow.push({
                id: item.id,
                source: 'clinic',
                date: item.date,
                amount: item.amount,
                type: item.type,
                description: item.description,
                category: item.category,
                expenseType: item.expenseType,
                status: item.status || 'paid'
            });
        });
        // Processa registros de pacientes
        patientFinancials.forEach((item) => {
            const amount = item.amount;
            const method = item.paymentMethod || 'other';
            if (item.type === 'income') {
                totalIncome += amount;
                incomeByMethod[method] = (incomeByMethod[method] || 0) + amount;
                if (item.status === 'pending') {
                    pendingTotal += amount;
                }
            }
            else {
                totalExpenses += amount;
                expenseByMethod[method] = (expenseByMethod[method] || 0) + amount;
                const category = item.category || 'Serviços';
                expensesByCategory[category] = (expensesByCategory[category] || 0) + amount;
            }
            if (item.patientId)
                patientIds.add(item.patientId);
            cashFlow.push({
                id: item.id,
                source: 'patient',
                date: item.date,
                amount: item.amount,
                type: item.type,
                description: item.description,
                category: item.category,
                patientName: undefined, // Será preenchido abaixo
                status: item.status
            });
        });
        // Busca nomes dos pacientes
        const patientMap = new Map();
        if (patientIds.size > 0) {
            await Promise.all(Array.from(patientIds).map(async (id) => {
                try {
                    const patient = await this.patientRepository.findById(id);
                    if (patient) {
                        patientMap.set(id, patient.name);
                    }
                }
                catch (e) {
                    this.logger.warn(`Erro ao buscar nome do paciente ${id}`);
                }
            }));
        }
        // Vincula nomes no cashFlow
        cashFlow.forEach(flow => {
            // Para registros de pacientes, precisamos do ID original
            if (flow.source === 'patient') {
                const original = patientFinancials.find((p) => p.id === flow.id);
                if (original?.patientId) {
                    flow.patientName = patientMap.get(original.patientId);
                }
            }
            else {
                // Para clínica, possivelmente tem patientId na entidade Financial
                const original = clinicFinancials.find(f => f.id === flow.id);
                if (original?.patientId) {
                    flow.patientName = patientMap.get(original.patientId);
                }
            }
            // Fallback amigável
            if (!flow.patientName) {
                if (flow.type === 'income') {
                    flow.patientName = 'Cliente Externo';
                }
                else {
                    // Para despesas, para evitar () se o frontend mostrar as parens, vou usar o nome da clinica ou categoria
                    flow.patientName = flow.category || 'Clínica';
                }
            }
        });
        // Ordena fluxo de caixa por data
        cashFlow.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        return {
            monthlyTotal: totalIncome, // Voltou para as variaveis que eram antes (monthlyTotal = receita total)
            pendingTotal,
            expenses: expensesTotal, // Onde tem despesas fixas deixe apenas despesas
            variableExpenses: variableExpensesTotal,
            totalIncome,
            totalExpenses,
            netProfit: totalIncome - totalExpenses,
            incomeByMethod,
            expenseByMethod,
            expensesByCategory,
            cashFlow
        };
    }
    async getFinancialById(id) {
        this.logger.info(`Buscando registro financeiro por ID: ${id}`);
        return this.repository.findById(id);
    }
    async getAllFinancials() {
        this.logger.info("Buscando todos os registros financeiros");
        return this.repository.findAll();
    }
    async getFinancialsByUserId(userId) {
        this.logger.info(`Buscando registros financeiros por usuário: ${userId}`);
        return this.repository.findByUserId(userId);
    }
    async getFinancialsByPatientId(patientId) {
        this.logger.info(`Buscando registros financeiros por paciente: ${patientId}`);
        return this.repository.findByPatientId(patientId);
    }
    async createFinancial(financial) {
        this.logger.info(`Criando registro financeiro para usuário: ${financial.userId}`);
        return this.repository.create(financial);
    }
    async updateFinancial(id, financial) {
        this.logger.info(`Atualizando registro financeiro: ${id}`);
        return this.repository.update(id, financial);
    }
    async deleteFinancial(id, source) {
        this.logger.info(`Deletando registro financeiro: ${id} (fonte: ${source || 'clinic'})`);
        if (source === 'patient') {
            return this.patientFinancialRepository.delete(id);
        }
        return this.repository.delete(id);
    }
};
FinancialService = __decorate([
    injectable(),
    __param(0, inject("IFinancialRepository")),
    __param(1, inject("IPatientFinancialRepository")),
    __param(2, inject("IPatientRepository")),
    __param(3, inject("Logger")),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], FinancialService);
export { FinancialService };
//# sourceMappingURL=FinancialService.js.map