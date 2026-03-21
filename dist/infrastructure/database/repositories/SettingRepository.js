var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { injectable } from "tsyringe";
import SettingModel from "../models/SettingModel.js";
let SettingRepository = class SettingRepository {
    async findById(id) {
        return SettingModel.findById(id).lean({ virtuals: true }).exec();
    }
    async findAll() {
        return SettingModel.find().lean({ virtuals: true }).exec();
    }
    async findByUserId(userId) {
        return SettingModel.findOne({ userId }).lean({ virtuals: true }).exec();
    }
    async create(setting) {
        const newSetting = new SettingModel(setting);
        return newSetting.save();
    }
    async update(id, setting) {
        return SettingModel.findByIdAndUpdate(id, setting, { new: true }).lean({ virtuals: true }).exec();
    }
    async delete(id) {
        const result = await SettingModel.findByIdAndDelete(id).exec();
        return result !== null;
    }
};
SettingRepository = __decorate([
    injectable()
], SettingRepository);
export { SettingRepository };
//# sourceMappingURL=SettingRepository.js.map