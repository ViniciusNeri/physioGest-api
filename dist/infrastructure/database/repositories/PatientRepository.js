var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { injectable } from "tsyringe";
import PatientModel from "../models/PatientModel.js";
import AgendaModel from "../models/AgendaModel.js";
let PatientRepository = class PatientRepository {
    async findById(id) {
        return PatientModel.findById(id).lean({ virtuals: true }).exec();
    }
    async findByUserId(userId) {
        const patients = await PatientModel.find({ userId }).lean({ virtuals: true }).exec();
        return this.enrichWithAgendaStats(patients);
    }
    async findAll() {
        const patients = await PatientModel.find().lean({ virtuals: true }).exec();
        return this.enrichWithAgendaStats(patients);
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
    async findByPin(userId, pin) {
        return PatientModel.findOne({ userId, pin }).lean({ virtuals: true }).exec();
    }
    async enrichWithAgendaStats(patients) {
        if (!patients.length)
            return [];
        const patientIds = patients.map(p => p.id).filter(Boolean);
        const agendas = await AgendaModel.find({ patientId: { $in: patientIds } }).lean().exec();
        const agendaByPatient = new Map();
        agendas.forEach(a => {
            if (!agendaByPatient.has(a.patientId)) {
                agendaByPatient.set(a.patientId, []);
            }
            agendaByPatient.get(a.patientId).push(a);
        });
        const now = new Date();
        return patients.map(patient => {
            const pAgendas = agendaByPatient.get(patient.id) || [];
            let completedCount = 0;
            let cancelledCount = 0;
            let nextAppt = null;
            pAgendas.forEach(a => {
                if (a.status === 'completed')
                    completedCount++;
                if (a.status === 'cancelled')
                    cancelledCount++;
                if (a.status === 'scheduled') {
                    const startDate = a.startDate ? new Date(a.startDate) : null;
                    if (startDate && startDate >= now) {
                        if (!nextAppt || startDate < nextAppt) {
                            nextAppt = startDate;
                        }
                    }
                }
            });
            return {
                ...patient,
                completedAppointments: completedCount,
                cancelledAppointments: cancelledCount,
                nextAppointmentDate: nextAppt
            };
        });
    }
};
PatientRepository = __decorate([
    injectable()
], PatientRepository);
export { PatientRepository };
//# sourceMappingURL=PatientRepository.js.map