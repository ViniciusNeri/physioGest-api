var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { injectable } from "tsyringe";
import FinancialModel from "../models/FinancialModel.js";
let FinancialRepository = class FinancialRepository {
    async findById(id) {
        return FinancialModel.findById(id).lean().exec();
    }
    async findAll() {
        return FinancialModel.find().lean().exec();
    }
    async findByUserId(userId) {
        return FinancialModel.find({ userId }).lean().exec();
    }
    async create(financial) {
        const newFinancial = new FinancialModel(financial);
        return newFinancial.save();
    }
    async update(id, financial) {
        return FinancialModel.findByIdAndUpdate(id, financial, { new: true }).lean().exec();
    }
    async delete(id) {
        const result = await FinancialModel.findByIdAndDelete(id).exec();
        return result !== null;
    }
};
FinancialRepository = __decorate([
    injectable()
], FinancialRepository);
export { FinancialRepository };
//# sourceMappingURL=FinancialRepository.js.map