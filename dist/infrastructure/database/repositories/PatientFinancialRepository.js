var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { injectable } from "tsyringe";
import PatientFinancialModel from "../models/PatientFinancialModel.js";
import { getLocalMonthRange, getLocalYearRange } from "../../../utils/dateUtils.js";
let PatientFinancialRepository = class PatientFinancialRepository {
    async findByPatientId(patientId) {
        return PatientFinancialModel.find({ patientId })
            .sort({ date: -1 })
            .lean({ virtuals: true })
            .exec();
    }
    async findById(id) {
        return PatientFinancialModel.findById(id)
            .lean({ virtuals: true })
            .exec();
    }
    async create(financial) {
        const newFinancial = new PatientFinancialModel(financial);
        return newFinancial.save();
    }
    async update(id, financial) {
        const updatedFinancial = await PatientFinancialModel.findByIdAndUpdate(id, financial, { new: true })
            .lean({ virtuals: true })
            .exec();
        return updatedFinancial;
    }
    async delete(id) {
        const result = await PatientFinancialModel.findByIdAndDelete(id).exec();
        return result !== null;
    }
    async getBalanceByPatientId(patientId) {
        const result = await PatientFinancialModel.aggregate([
            {
                $match: { patientId }
            },
            {
                $group: {
                    _id: null,
                    totalIncome: {
                        $sum: {
                            $cond: [
                                { $eq: ["$type", "income"] },
                                "$amount",
                                0
                            ]
                        }
                    },
                    totalExpense: {
                        $sum: {
                            $cond: [
                                { $eq: ["$type", "expense"] },
                                "$amount",
                                0
                            ]
                        }
                    }
                }
            },
            {
                $project: {
                    balance: { $subtract: ["$totalIncome", "$totalExpense"] }
                }
            }
        ]);
        return result.length > 0 ? result[0].balance : 0;
    }
    async findPendingPaymentsByPatientId(patientId) {
        return PatientFinancialModel.find({
            patientId,
            status: 'pending'
        })
            .sort({ dueDate: 1 })
            .lean({ virtuals: true })
            .exec();
    }
    async findByUserAndDate(userId, month, year) {
        const { start, end } = getLocalMonthRange(month, year);
        return PatientFinancialModel.find({
            userId,
            date: { $gte: start, $lte: end }
        }).lean({ virtuals: true }).exec();
    }
    async findByUserAndYear(userId, year) {
        const { start, end } = getLocalYearRange(year);
        return PatientFinancialModel.find({
            userId,
            date: { $gte: start, $lte: end }
        }).lean({ virtuals: true }).exec();
    }
    async findByDateRange(patientId, startDate, endDate) {
        return PatientFinancialModel.find({
            patientId,
            date: {
                $gte: startDate,
                $lte: endDate
            }
        })
            .sort({ date: -1 })
            .lean({ virtuals: true })
            .exec();
    }
};
PatientFinancialRepository = __decorate([
    injectable()
], PatientFinancialRepository);
export { PatientFinancialRepository };
//# sourceMappingURL=PatientFinancialRepository.js.map