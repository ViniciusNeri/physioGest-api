import { injectable, inject } from "tsyringe";
import type { IPaymentMethodRepository } from "../../domain/interfaces/IPaymentMethodRepository.js";
import type { IPaymentMethodService } from "../../domain/services/IPaymentMethodService.js";
import type { PaymentMethod } from "../../domain/entities/PaymentMethod.js";
import type { ILogger } from "../../infrastructure/logging/Logger.js";

@injectable()
export class PaymentMethodService implements IPaymentMethodService {
  constructor(
    @inject("IPaymentMethodRepository")
    private repository: IPaymentMethodRepository,
    @inject("Logger")
    private logger: ILogger
  ) {}

  async getPaymentMethodById(id: string): Promise<PaymentMethod | null> {
    this.logger.info(`Buscando forma de pagamento por ID: ${id}`);
    return this.repository.findById(id);
  }

  async getAllPaymentMethods(): Promise<PaymentMethod[]> {
    this.logger.info("Buscando todas as formas de pagamento");
    return this.repository.findAll();
  }

  async getPaymentMethodsByUserId(userId: string): Promise<PaymentMethod[]> {
    this.logger.info(`Buscando formas de pagamento por usuário: ${userId}`);
    return this.repository.findByUserId(userId);
  }

  async createPaymentMethod(paymentMethod: Omit<PaymentMethod, 'id'>): Promise<PaymentMethod> {
    this.logger.info(`Criando forma de pagamento para usuário: ${paymentMethod.userId}`);
    return this.repository.create(paymentMethod as PaymentMethod);
  }

  async updatePaymentMethod(id: string, paymentMethod: Partial<PaymentMethod>): Promise<PaymentMethod | null> {
    this.logger.info(`Atualizando forma de pagamento: ${id}`);
    return this.repository.update(id, paymentMethod);
  }

  async deletePaymentMethod(id: string): Promise<boolean> {
    this.logger.info(`Deletando forma de pagamento: ${id}`);
    return this.repository.delete(id);
  }
}
