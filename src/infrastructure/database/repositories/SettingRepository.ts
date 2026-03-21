import { injectable } from "tsyringe";
import type { ISettingRepository } from "../../../domain/interfaces/ISettingRepository.js";
import type { Setting } from "../../../domain/entities/Setting.js";
import SettingModel from "../models/SettingModel.js";

@injectable()
export class SettingRepository implements ISettingRepository {
  async findById(id: string): Promise<Setting | null> {
    return SettingModel.findById(id).lean<Setting>({ virtuals: true }).exec();
  }

  async findAll(): Promise<Setting[]> {
    return SettingModel.find().lean<Setting[]>({ virtuals: true }).exec();
  }

  async findByUserId(userId: string): Promise<Setting | null> {
    return SettingModel.findOne({ userId }).lean<Setting>({ virtuals: true }).exec();
  }

  async create(setting: Setting): Promise<Setting> {
    const newSetting = new SettingModel(setting);
    return newSetting.save();
  }

  async update(id: string, setting: Partial<Setting>): Promise<Setting | null> {
    return SettingModel.findByIdAndUpdate(id, setting, { new: true }).lean<Setting>({ virtuals: true }).exec();
  }

  async delete(id: string): Promise<boolean> {
    const result = await SettingModel.findByIdAndDelete(id).exec();
    return result !== null;
  }
}
