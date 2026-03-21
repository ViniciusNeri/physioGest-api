import type { IPaymentMethodRepository } from "../../../domain/interfaces/IPaymentMethodRepository.js";
import type { PaymentMethod } from "../../../domain/entities/PaymentMethod.js";
export declare class PaymentMethodRepository implements IPaymentMethodRepository {
    findById(id: string): Promise<PaymentMethod | null>;
    findAll(): Promise<PaymentMethod[]>;
    findByUserId(userId: string): Promise<PaymentMethod[]>;
    create(paymentMethod: PaymentMethod): Promise<PaymentMethod>;
    update(id: string, paymentMethod: Partial<PaymentMethod>): Promise<PaymentMethod | null>;
    delete(id: string): Promise<boolean>;
}
//# sourceMappingURL=PaymentMethodRepository.d.ts.map