import { injectable } from "tsyringe";
import type { IPatientFinancialRepository } from "../../../domain/interfaces/IPatientSubdomainRepositories.js";
import type { PatientFinancial } from "../../../domain/entities/PatientSubdomains.js";
import PatientFinancialModel from "../models/PatientFinancialModel.js";
import { getLocalMonthRange, getLocalYearRange } from "../../../utils/dateUtils.js";

@injectable()
export class PatientFinancialRepository implements IPatientFinancialRepository {
  async findByPatientId(patientId: string): Promise<PatientFinancial[]> {
    return PatientFinancialModel.find({ patientId })
      .sort({ date: -1 })
      .lean<PatientFinancial[]>({ virtuals: true })
      .exec();
  }

  async findById(id: string): Promise<PatientFinancial | null> {
    return PatientFinancialModel.findById(id)
      .lean<PatientFinancial>({ virtuals: true })
      .exec();
  }

  async create(financial: Omit<PatientFinancial, 'id'>): Promise<PatientFinancial> {
    const newFinancial = new PatientFinancialModel(financial);
    return newFinancial.save();
  }

  async update(id: string, financial: Partial<PatientFinancial>): Promise<PatientFinancial | null> {
    const updatedFinancial = await PatientFinancialModel.findByIdAndUpdate(id, financial, { new: true })
      .lean<PatientFinancial>({ virtuals: true })
      .exec();
    return updatedFinancial;
  }

  async delete(id: string): Promise<boolean> {
    const result = await PatientFinancialModel.findByIdAndDelete(id).exec();
    return result !== null;
  }

  async getBalanceByPatientId(patientId: string): Promise<number> {
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

  async findPendingPaymentsByPatientId(patientId: string): Promise<PatientFinancial[]> {
    return PatientFinancialModel.find({
      patientId,
      status: 'pending'
    })
      .sort({ dueDate: 1 })
      .lean<PatientFinancial[]>({ virtuals: true })
      .exec();
  }

  async findByUserAndDate(userId: string, month: number, year: number): Promise<PatientFinancial[]> {
    const { start, end } = getLocalMonthRange(month, year);
    return PatientFinancialModel.find({ 
      userId, 
      date: { $gte: start, $lte: end } 
    }).lean<PatientFinancial[]>({ virtuals: true }).exec();
  }

  async findByUserAndYear(userId: string, year: number): Promise<PatientFinancial[]> {
    const { start, end } = getLocalYearRange(year);
    return PatientFinancialModel.find({ 
      userId, 
      date: { $gte: start, $lte: end } 
    }).lean<PatientFinancial[]>({ virtuals: true }).exec();
  }

  async findByDateRange(patientId: string, startDate: string, endDate: string): Promise<PatientFinancial[]> {
    return PatientFinancialModel.find({
      patientId,
      date: {
        $gte: startDate,
        $lte: endDate
      }
    })
      .sort({ date: -1 })
      .lean<PatientFinancial[]>({ virtuals: true })
      .exec();
  }
}