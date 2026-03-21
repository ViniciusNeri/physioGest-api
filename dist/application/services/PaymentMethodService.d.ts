import type { IPaymentMethodRepository } from "../../domain/interfaces/IPaymentMethodRepository.js";
import type { IPaymentMethodService } from "../../domain/services/IPaymentMethodService.js";
import type { PaymentMethod } from "../../domain/entities/PaymentMethod.js";
import type { ILogger } from "../../infrastructure/logging/Logger.js";
export declare class PaymentMethodService implements IPaymentMethodService {
    private repository;
    private logger;
    constructor(repository: IPaymentMethodRepository, logger: ILogger);
    getPaymentMethodById(id: string): Promise<PaymentMethod | null>;
    getAllPaymentMethods(): Promise<PaymentMethod[]>;
    getPaymentMethodsByUserId(userId: string): Promise<PaymentMethod[]>;
    createPaymentMethod(paymentMethod: Omit<PaymentMethod, 'id'>): Promise<PaymentMethod>;
    updatePaymentMethod(id: string, paymentMethod: Partial<PaymentMethod>): Promise<PaymentMethod | null>;
    deletePaymentMethod(id: string): Promise<boolean>;
}
//# sourceMappingURL=PaymentMethodService.d.ts.map