import { injectable } from "tsyringe";
import { getLocalMonthRange, getLocalYearRange } from "../../../utils/dateUtils.js";
import type { IFinancialRepository } from "../../../domain/interfaces/IFinancialRepository.js";
import type { Financial } from "../../../domain/entities/Financial.js";
import FinancialModel from "../models/FinancialModel.js";

@injectable()
export class FinancialRepository implements IFinancialRepository {
  async findById(id: string): Promise<Financial | null> {
    return FinancialModel.findById(id).lean<Financial>({ virtuals: true }).exec();
  }

  async findAll(): Promise<Financial[]> {
    return FinancialModel.find().lean<Financial[]>({ virtuals: true }).exec();
  }

  async findByUserId(userId: string): Promise<Financial[]> {
    return FinancialModel.find({ userId }).lean<Financial[]>({ virtuals: true }).exec();
  }

  async findByFilters(userId: string, month: number, year: number): Promise<Financial[]> {
    const { start, end } = getLocalMonthRange(month, year);
    return FinancialModel.find({ 
      userId, 
      date: { $gte: start, $lte: end } 
    }).lean<Financial[]>({ virtuals: true }).exec();
  }

  async findByYear(userId: string, year: number): Promise<Financial[]> {
    const { start, end } = getLocalYearRange(year);
    return FinancialModel.find({ 
      userId, 
      date: { $gte: start, $lte: end } 
    }).lean<Financial[]>({ virtuals: true }).exec();
  }

  async findByPatientId(patientId: string): Promise<Financial[]> {
    return FinancialModel.find({ patientId }).lean<Financial[]>({ virtuals: true }).exec();
  }

  async create(financial: Financial): Promise<Financial> {
    const newFinancial = new FinancialModel(financial);
    return newFinancial.save();
  }

  async update(id: string, financial: Partial<Financial>): Promise<Financial | null> {
    return FinancialModel.findByIdAndUpdate(id, financial, { new: true }).lean<Financial>({ virtuals: true }).exec();
  }

  async delete(id: string): Promise<boolean> {
    const result = await FinancialModel.findByIdAndDelete(id).exec();
    return result !== null;
  }
}