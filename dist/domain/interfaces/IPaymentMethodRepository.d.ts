import type { PaymentMethod } from "../entities/PaymentMethod.js";
export interface IPaymentMethodRepository {
    findById(id: string): Promise<PaymentMethod | null>;
    findAll(): Promise<PaymentMethod[]>;
    findByUserId(userId: string): Promise<PaymentMethod[]>;
    create(paymentMethod: PaymentMethod): Promise<PaymentMethod>;
    update(id: string, paymentMethod: Partial<PaymentMethod>): Promise<PaymentMethod | null>;
    delete(id: string): Promise<boolean>;
}
//# sourceMappingURL=IPaymentMethodRepository.d.ts.map