import { injectable } from "tsyringe";
import type { IPaymentMethodRepository } from "../../../domain/interfaces/IPaymentMethodRepository.js";
import type { PaymentMethod } from "../../../domain/entities/PaymentMethod.js";
import PaymentMethodModel from "../models/PaymentMethodModel.js";
import mongoose from "mongoose";

@injectable()
export class PaymentMethodRepository implements IPaymentMethodRepository {
  async findById(id: string): Promise<PaymentMethod | null> {
    const isObjectId = mongoose.Types.ObjectId.isValid(id);
    const query = isObjectId ? { _id: id } : { id: id };
    return PaymentMethodModel.findOne(query).lean<PaymentMethod>({ virtuals: true }).exec();
  }

  async findAll(): Promise<PaymentMethod[]> {
    console.log("[REPO DEBUG] findAll called");
    return PaymentMethodModel.find().lean<PaymentMethod[]>({ virtuals: true }).exec();
  }

async findByUserId(userId: string): Promise<PaymentMethod[]> {
  console.log(`[REPO DEBUG] findByUserId called with userId: ${userId}`);
  return PaymentMethodModel.find({
    $or: [
      { userId: userId }, 
      { userId: null }    
    ]
  })
  .lean<PaymentMethod[]>({ virtuals: true })
  .exec();
}

  async create(paymentMethod: PaymentMethod): Promise<PaymentMethod> {
    const newPaymentMethod = new PaymentMethodModel(paymentMethod);
    return newPaymentMethod.save();
  }

  async update(id: string, paymentMethod: Partial<PaymentMethod>): Promise<PaymentMethod | null> {
    const isObjectId = mongoose.Types.ObjectId.isValid(id);
    const query = isObjectId ? { _id: id } : { id: id };
    return PaymentMethodModel.findOneAndUpdate(query, paymentMethod, { new: true }).lean<PaymentMethod>({ virtuals: true }).exec();
  }

  async delete(id: string): Promise<boolean> {
    const isObjectId = mongoose.Types.ObjectId.isValid(id);
    const query = isObjectId ? { _id: id } : { id: id };
    const result = await PaymentMethodModel.findOneAndDelete(query).exec();
    return result !== null;
  }


}
