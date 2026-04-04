var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { injectable } from "tsyringe";
import AgendaModel from "../models/AgendaModel.js";
import mongoose from "mongoose";
const mapAgenda = (agenda) => {
    if (!agenda)
        return agenda;
    if (agenda.patient) {
        agenda.patientName = agenda.patient.name;
    }
    if (agenda.category) {
        agenda.categoryName = agenda.category.name;
    }
    return agenda;
};
let AgendaRepository = class AgendaRepository {
    async findById(id) {
        const isObjectId = mongoose.Types.ObjectId.isValid(id);
        const query = isObjectId ? { _id: id } : { id: id };
        const a = await AgendaModel.findOne(query).populate('patient', 'name').populate('category', 'name').lean({ virtuals: true }).exec();
        return a ? mapAgenda(a) : null;
    }
    async findAll() {
        const agendas = await AgendaModel.find().populate('patient', 'name').populate('category', 'name').lean({ virtuals: true }).exec();
        return agendas.map(mapAgenda);
    }
    async findByUserId(userId) {
        const agendas = await AgendaModel.find({ userId }).populate('patient', 'name').populate('category', 'name').lean({ virtuals: true }).exec();
        return agendas.map(mapAgenda);
    }
    async findByPatientId(patientId) {
        const agendas = await AgendaModel.find({ patientId })
            .populate('patient', 'name')
            .populate('category', 'name')
            .lean({ virtuals: true })
            .sort({ startDate: -1 })
            .exec();
        return agendas.map(mapAgenda);
    }
    async hasOverlap(userId, patientId, startDate, endDate, excludeId) {
        const query = {
            status: { $nin: ['cancelled', 'no_show'] },
            $or: [
                { userId: userId },
                { patientId: patientId }
            ],
            $and: [
                { startDate: { $lt: endDate } },
                { endDate: { $gt: startDate } }
            ]
        };
        if (excludeId) {
            if (mongoose.Types.ObjectId.isValid(excludeId)) {
                query._id = { $ne: new mongoose.Types.ObjectId(excludeId) };
            }
            else {
                query.id = { $ne: excludeId };
            }
        }
        console.log(`[hasOverlap] Buscando conflitos para Usuário: ${userId} OU Paciente: ${patientId}`);
        console.log(`[hasOverlap] Intervalo solicitado: ${startDate.toISOString()} até ${endDate.toISOString()}`);
        const overlap = await AgendaModel.findOne(query).lean().exec();
        if (overlap) {
            console.log(`[hasOverlap] CONFLITO DETECTADO!`);
            const o = overlap;
            console.log(`[hasOverlap] Descrição do conflito: ID=${o.id || o._id}, User=${o.userId}, Patient=${o.patientId}, De=${o.startDate instanceof Date ? o.startDate.toISOString() : o.startDate} até=${o.endDate instanceof Date ? o.endDate.toISOString() : o.endDate}`);
        }
        else {
            console.log("[hasOverlap] Nenhum conflito encontrado para este período.");
        }
        return overlap !== null;
    }
    async create(agenda) {
        const newAgenda = new AgendaModel(agenda);
        const saved = await newAgenda.save();
        return AgendaModel.findById(saved._id).populate('patient', 'name').populate('category', 'name').lean({ virtuals: true }).exec().then(a => mapAgenda(a));
    }
    async update(id, agenda) {
        const isObjectId = mongoose.Types.ObjectId.isValid(id);
        const query = isObjectId ? { _id: id } : { id: id };
        const updated = await AgendaModel.findOneAndUpdate(query, agenda, { new: true }).populate('patient', 'name').populate('category', 'name').lean({ virtuals: true }).exec();
        return updated ? mapAgenda(updated) : null;
    }
    async delete(id) {
        const isObjectId = mongoose.Types.ObjectId.isValid(id);
        const query = isObjectId ? { _id: id } : { id: id };
        const result = await AgendaModel.findOneAndDelete(query).exec();
        return result !== null;
    }
};
AgendaRepository = __decorate([
    injectable()
], AgendaRepository);
export { AgendaRepository };
//# sourceMappingURL=AgendaRepository.js.map