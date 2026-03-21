import { injectable } from "tsyringe";
import type { IPaymentMethodRepository } from "../../../domain/interfaces/IPaymentMethodRepository.js";
import type { PaymentMethod } from "../../../domain/entities/PaymentMethod.js";
import PaymentMethodModel from "../models/PaymentMethodModel.js";

@injectable()
export class PaymentMethodRepository implements IPaymentMethodRepository {
  async findById(id: string): Promise<PaymentMethod | null> {
    return PaymentMethodModel.findById(id).lean<PaymentMethod>({ virtuals: true }).exec();
  }

  async findAll(): Promise<PaymentMethod[]> {
    return PaymentMethodModel.find().lean<PaymentMethod[]>({ virtuals: true }).exec();
  }

  async findByUserId(userId: string): Promise<PaymentMethod[]> {
    return PaymentMethodModel.find({ userId }).lean<PaymentMethod[]>({ virtuals: true }).exec();
  }

  async create(paymentMethod: PaymentMethod): Promise<PaymentMethod> {
    const newPaymentMethod = new PaymentMethodModel(paymentMethod);
    return newPaymentMethod.save();
  }

  async update(id: string, paymentMethod: Partial<PaymentMethod>): Promise<PaymentMethod | null> {
    return PaymentMethodModel.findByIdAndUpdate(id, paymentMethod, { new: true }).lean<PaymentMethod>({ virtuals: true }).exec();
  }

  async delete(id: string): Promise<boolean> {
    const result = await PaymentMethodModel.findByIdAndDelete(id).exec();
    return result !== null;
  }
}
