var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { injectable } from "tsyringe";
import SettingModel from "../models/SettingModel.js";
let SettingRepository = class SettingRepository {
    mapSetting(doc) {
        if (!doc)
            return null;
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
        };
    }
    async findById(id) {
        const doc = await SettingModel.findById(id).lean().exec();
        return this.mapSetting(doc);
    }
    async findAll() {
        const docs = await SettingModel.find().lean().exec();
        return docs.map(doc => this.mapSetting(doc));
    }
    async findByUserId(userId) {
        const doc = await SettingModel.findOne({ userId }).lean().exec();
        return this.mapSetting(doc);
    }
    async create(setting) {
        const newSetting = new SettingModel(setting);
        const saved = await newSetting.save();
        return this.mapSetting(saved.toObject());
    }
    async update(id, setting) {
        const updated = await SettingModel.findByIdAndUpdate(id, setting, { new: true }).lean().exec();
        return this.mapSetting(updated);
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