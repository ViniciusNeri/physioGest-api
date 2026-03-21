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
let PaymentMethodService = class PaymentMethodService {
    repository;
    logger;
    constructor(repository, logger) {
        this.repository = repository;
        this.logger = logger;
    }
    async getPaymentMethodById(id) {
        this.logger.info(`Buscando forma de pagamento por ID: ${id}`);
        return this.repository.findById(id);
    }
    async getAllPaymentMethods() {
        this.logger.info("Buscando todas as formas de pagamento");
        return this.repository.findAll();
    }
    async getPaymentMethodsByUserId(userId) {
        this.logger.info(`Buscando formas de pagamento por usuário: ${userId}`);
        return this.repository.findByUserId(userId);
    }
    async createPaymentMethod(paymentMethod) {
        this.logger.info(`Criando forma de pagamento para usuário: ${paymentMethod.userId}`);
        return this.repository.create(paymentMethod);
    }
    async updatePaymentMethod(id, paymentMethod) {
        this.logger.info(`Atualizando forma de pagamento: ${id}`);
        return this.repository.update(id, paymentMethod);
    }
    async deletePaymentMethod(id) {
        this.logger.info(`Deletando forma de pagamento: ${id}`);
        return this.repository.delete(id);
    }
};
PaymentMethodService = __decorate([
    injectable(),
    __param(0, inject("IPaymentMethodRepository")),
    __param(1, inject("Logger")),
    __metadata("design:paramtypes", [Object, Object])
], PaymentMethodService);
export { PaymentMethodService };
//# sourceMappingURL=PaymentMethodService.js.map