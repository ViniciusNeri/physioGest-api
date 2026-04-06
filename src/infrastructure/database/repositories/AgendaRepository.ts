import { injectable } from "tsyringe";
import type { IAgendaRepository } from "../../../domain/interfaces/IAgendaRepository.js";
import type { Agenda } from "../../../domain/entities/Agenda.js";
import AgendaModel from "../models/AgendaModel.js";
import mongoose from "mongoose";

const mapAgenda = (agenda: any): Agenda => {
  if (!agenda) return agenda;
  if (agenda.patient) {
    agenda.patientName = agenda.patient.name;
  }
  if (agenda.category) {
    agenda.categoryName = agenda.category.name;
  }
  return agenda;
};

@injectable()
export class AgendaRepository implements IAgendaRepository {
  async findById(id: string): Promise<Agenda | null> {
    const isObjectId = mongoose.Types.ObjectId.isValid(id);
    const query = isObjectId ? { _id: id } : { id: id };
    const a = await AgendaModel.findOne(query).populate('patient', 'name').populate('category', 'name').lean({ virtuals: true }).exec();
    return a ? mapAgenda(a) : null;
  }

  async findAll(): Promise<Agenda[]> {
    const agendas = await AgendaModel.find().populate('patient', 'name').populate('category', 'name').lean({ virtuals: true }).exec();
    return agendas.map(mapAgenda);
  }

  async findByUserId(userId: string): Promise<Agenda[]> {
    const agendas = await AgendaModel.find({ userId }).populate('patient', 'name').populate('category', 'name').lean({ virtuals: true }).exec();
    return agendas.map(mapAgenda);
  }

  async findByPatientId(patientId: string): Promise<Agenda[]> {
    const agendas = await AgendaModel.find({ patientId })
      .populate('patient', 'name')
      .populate('category', 'name')
      .lean({ virtuals: true })
      .sort({ startDate: -1 })
      .exec();
    return agendas.map(mapAgenda);
  }

  async hasOverlap(userId: string, patientId: string, startDate: Date, endDate: Date, excludeId?: string): Promise<boolean> {
    const query: any = {
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
      } else {
        query.id = { $ne: excludeId };
      }
    }

    console.log(`[hasOverlap] Buscando conflitos para Usuário: ${userId} OU Paciente: ${patientId}`);
    console.log(`[hasOverlap] Intervalo solicitado: ${startDate.toISOString()} até ${endDate.toISOString()}`);
    
    const overlap = await AgendaModel.findOne(query).lean().exec();
    
    if (overlap) {
      console.log(`[hasOverlap] CONFLITO DETECTADO!`);
      const o = overlap as any;
      console.log(`[hasOverlap] Descrição do conflito: ID=${o.id || o._id}, User=${o.userId}, Patient=${o.patientId}, De=${o.startDate instanceof Date ? o.startDate.toISOString() : o.startDate} até=${o.endDate instanceof Date ? o.endDate.toISOString() : o.endDate}`);
    } else {
      console.log("[hasOverlap] Nenhum conflito encontrado para este período.");
    }
    return overlap !== null;
  }

  async findByDateRange(userId: string, startDate: Date, endDate: Date): Promise<Agenda[]> {
    const appointments = await AgendaModel.find({
      userId,
      status: { $nin: ['cancelled', 'no_show'] },
      $and: [
        { startDate: { $lt: endDate } },
        { endDate: { $gt: startDate } }
      ]
    }).lean({ virtuals: true }).exec();
    return appointments.map(mapAgenda);
  }

  async create(agenda: Agenda): Promise<Agenda> {
    const newAgenda = new AgendaModel(agenda);
    const saved = await newAgenda.save();
    return AgendaModel.findById(saved._id).populate('patient', 'name').populate('category', 'name').lean({ virtuals: true }).exec().then(a => mapAgenda(a));
  }

  async update(id: string, agenda: Partial<Agenda>): Promise<Agenda | null> {
    const isObjectId = mongoose.Types.ObjectId.isValid(id);
    const query = isObjectId ? { _id: id } : { id: id };
    const updated = await AgendaModel.findOneAndUpdate(query, agenda, { new: true }).populate('patient', 'name').populate('category', 'name').lean({ virtuals: true }).exec();
    return updated ? mapAgenda(updated) : null;
  }

  async delete(id: string): Promise<boolean> {
    const isObjectId = mongoose.Types.ObjectId.isValid(id);
    const query = isObjectId ? { _id: id } : { id: id };
    const result = await AgendaModel.findOneAndDelete(query).exec();
    return result !== null;
  }
}