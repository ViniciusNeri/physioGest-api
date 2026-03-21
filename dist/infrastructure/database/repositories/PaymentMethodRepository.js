var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { injectable } from "tsyringe";
import PaymentMethodModel from "../models/PaymentMethodModel.js";
let PaymentMethodRepository = class PaymentMethodRepository {
    async findById(id) {
        return PaymentMethodModel.findById(id).lean({ virtuals: true }).exec();
    }
    async findAll() {
        return PaymentMethodModel.find().lean({ virtuals: true }).exec();
    }
    async findByUserId(userId) {
        return PaymentMethodModel.find({ userId }).lean({ virtuals: true }).exec();
    }
    async create(paymentMethod) {
        const newPaymentMethod = new PaymentMethodModel(paymentMethod);
        return newPaymentMethod.save();
    }
    async update(id, paymentMethod) {
        return PaymentMethodModel.findByIdAndUpdate(id, paymentMethod, { new: true }).lean({ virtuals: true }).exec();
    }
    async delete(id) {
        const result = await PaymentMethodModel.findByIdAndDelete(id).exec();
        return result !== null;
    }
};
PaymentMethodRepository = __decorate([
    injectable()
], PaymentMethodRepository);
export { PaymentMethodRepository };
//# sourceMappingURL=PaymentMethodRepository.js.map