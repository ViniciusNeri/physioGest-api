var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { injectable } from "tsyringe";
import PatientAnamnesisModel from "../models/PatientAnamnesisModel.js";
let PatientAnamnesisRepository = class PatientAnamnesisRepository {
    async findByPatientId(patientId) {
        return PatientAnamnesisModel.find({ patientId })
            .sort({ date: -1 })
            .lean({ virtuals: true })
            .exec();
    }
    async findById(id) {
        return PatientAnamnesisModel.findById(id)
            .lean({ virtuals: true })
            .exec();
    }
    async create(anamnesis) {
        const newAnamnesis = new PatientAnamnesisModel(anamnesis);
        return newAnamnesis.save();
    }
    async update(id, anamnesis) {
        const updatedAnamnesis = await PatientAnamnesisModel.findByIdAndUpdate(id, anamnesis, { new: true })
            .lean({ virtuals: true })
            .exec();
        return updatedAnamnesis;
    }
    async delete(id) {
        const result = await PatientAnamnesisModel.findByIdAndDelete(id).exec();
        return result !== null;
    }
    async findLatestByPatientId(patientId) {
        const anamnesis = await PatientAnamnesisModel.findOne({ patientId })
            .sort({ date: -1 })
            .lean({ virtuals: true })
            .exec();
        return anamnesis;
    }
};
PatientAnamnesisRepository = __decorate([
    injectable()
], PatientAnamnesisRepository);
export { PatientAnamnesisRepository };
//# sourceMappingURL=PatientAnamnesisRepository.js.map