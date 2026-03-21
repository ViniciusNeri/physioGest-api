import type { PaymentMethod } from "../entities/PaymentMethod.js";

export interface IPaymentMethodService {
  getPaymentMethodById(id: string): Promise<PaymentMethod | null>;
  getAllPaymentMethods(): Promise<PaymentMethod[]>;
  getPaymentMethodsByUserId(userId: string): Promise<PaymentMethod[]>;
  createPaymentMethod(paymentMethod: Omit<PaymentMethod, 'id'>): Promise<PaymentMethod>;
  updatePaymentMethod(id: string, paymentMethod: Partial<PaymentMethod>): Promise<PaymentMethod | null>;
  deletePaymentMethod(id: string): Promise<boolean>;
}
