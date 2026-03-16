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
    logger;
    constructor(repository, logger) {
        this.repository = repository;
        this.logger = logger;
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
    async deleteFinancial(id) {
        this.logger.info(`Deletando registro financeiro: ${id}`);
        return this.repository.delete(id);
    }
};
FinancialService = __decorate([
    injectable(),
    __param(0, inject("IFinancialRepository")),
    __param(1, inject("Logger")),
    __metadata("design:paramtypes", [Object, Object])
], FinancialService);
export { FinancialService };
//# sourceMappingURL=FinancialService.js.map