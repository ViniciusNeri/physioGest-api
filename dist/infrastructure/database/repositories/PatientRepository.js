var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { injectable } from "tsyringe";
import PatientModel from "../models/PatientModel.js";
let PatientRepository = class PatientRepository {
    async findById(id) {
        return PatientModel.findById(id).lean({ virtuals: true }).exec();
    }
    async findByUserId(userId) {
        return PatientModel.find({ userId }).lean({ virtuals: true }).exec();
    }
    async findAll() {
        return PatientModel.find().lean({ virtuals: true }).exec();
    }
    async create(patient) {
        const newPatient = new PatientModel(patient);
        return newPatient.save();
    }
    async update(id, patient) {
        const updatedPatient = await PatientModel.findByIdAndUpdate(id, patient, { new: true }).lean({ virtuals: true }).exec();
        return updatedPatient;
    }
    async delete(id) {
        const result = await PatientModel.findByIdAndDelete(id).exec();
        return result !== null;
    }
};
PatientRepository = __decorate([
    injectable()
], PatientRepository);
export { PatientRepository };
//# sourceMappingURL=PatientRepository.js.map