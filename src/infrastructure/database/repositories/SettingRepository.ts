import { injectable } from "tsyringe";
import type { ISettingRepository } from "../../../domain/interfaces/ISettingRepository.js";
import type { Setting } from "../../../domain/entities/Setting.js";
import SettingModel from "../models/SettingModel.js";

@injectable()
export class SettingRepository implements ISettingRepository {
  private mapSetting(doc: any): Setting | null {
    if (!doc) return null;
    
    // Converte para objeto se for um documento Mongoose e adiciona id se faltar
    const obj = doc.toObject ? doc.toObject({ virtuals: true }) : doc;
    
    // Garantir que todos os campos tenham valores default caso não existam no banco (devido ao .lean())
    return {
      dashboardTheme: 'light',
      showWeeklyAppointments: true,
      showMonthlyIncome: true,
      showActivePayments: true,
      showNextAppointment: true,
      showPendingPayments: true,
      showBirthdays: true,
      showOccupancyGraph: true,
      showOverdueAppointments: true,
      categoryControlMode: 'none',
      ...obj,
      id: obj.id || obj._id?.toString()
    } as Setting;
  }

  async findById(id: string): Promise<Setting | null> {
    const doc = await SettingModel.findById(id).lean().exec();
    return this.mapSetting(doc);
  }

  async findAll(): Promise<Setting[]> {
    const docs = await SettingModel.find().lean().exec();
    return docs.map(doc => this.mapSetting(doc) as Setting);
  }

  async findByUserId(userId: string): Promise<Setting | null> {
    const doc = await SettingModel.findOne({ userId }).lean().exec();
    return this.mapSetting(doc);
  }

  async create(setting: Setting): Promise<Setting> {
    const newSetting = new SettingModel(setting);
    const saved = await newSetting.save();
    return this.mapSetting(saved.toObject()) as Setting;
  }

  async update(id: string, setting: Partial<Setting>): Promise<Setting | null> {
    const updated = await SettingModel.findByIdAndUpdate(id, setting, { new: true }).lean().exec();
    return this.mapSetting(updated);
  }

  async delete(id: string): Promise<boolean> {
    const result = await SettingModel.findByIdAndDelete(id).exec();
    return result !== null;
  }
}
