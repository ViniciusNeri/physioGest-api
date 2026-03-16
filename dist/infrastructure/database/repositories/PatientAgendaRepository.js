var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { injectable } from "tsyringe";
import PatientAgendaModel from "../models/PatientAgendaModel.js";
let PatientAgendaRepository = class PatientAgendaRepository {
    async findByPatientId(patientId) {
        return PatientAgendaModel.find({ patientId })
            .sort({ date: 1, time: 1 })
            .lean({ virtuals: true })
            .exec();
    }
    async findById(id) {
        return PatientAgendaModel.findById(id)
            .lean({ virtuals: true })
            .exec();
    }
    async create(agenda) {
        const newAgenda = new PatientAgendaModel(agenda);
        return newAgenda.save();
    }
    async update(id, agenda) {
        const updatedAgenda = await PatientAgendaModel.findByIdAndUpdate(id, agenda, { new: true })
            .lean({ virtuals: true })
            .exec();
        return updatedAgenda;
    }
    async delete(id) {
        const result = await PatientAgendaModel.findByIdAndDelete(id).exec();
        return result !== null;
    }
    async findUpcomingByPatientId(patientId, limit = 10) {
        const now = new Date();
        return PatientAgendaModel.find({
            patientId,
            date: { $gte: now },
            status: { $in: ['scheduled'] }
        })
            .sort({ date: 1, time: 1 })
            .limit(limit)
            .lean({ virtuals: true })
            .exec();
    }
    async findByDateRange(patientId, startDate, endDate) {
        return PatientAgendaModel.find({
            patientId,
            date: {
                $gte: startDate,
                $lte: endDate
            }
        })
            .sort({ date: 1, time: 1 })
            .lean({ virtuals: true })
            .exec();
    }
};
PatientAgendaRepository = __decorate([
    injectable()
], PatientAgendaRepository);
export { PatientAgendaRepository };
//# sourceMappingURL=PatientAgendaRepository.js.map