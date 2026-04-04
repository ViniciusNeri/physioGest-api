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
  return agenda;
};

@injectable()
export class AgendaRepository implements IAgendaRepository {
  async findById(id: string): Promise<Agenda | null> {
    const isObjectId = mongoose.Types.ObjectId.isValid(id);
    const query = isObjectId ? { _id: id } : { id: id };
    const a = await AgendaModel.findOne(query).populate('patient', 'name').lean({ virtuals: true }).exec();
    return a ? mapAgenda(a) : null;
  }

  async findAll(): Promise<Agenda[]> {
    const agendas = await AgendaModel.find().populate('patient', 'name').lean({ virtuals: true }).exec();
    return agendas.map(mapAgenda);
  }

  async findByUserId(userId: string): Promise<Agenda[]> {
    const agendas = await AgendaModel.find({ userId }).populate('patient', 'name').lean({ virtuals: true }).exec();
    return agendas.map(mapAgenda);
  }

  async findByPatientId(patientId: string): Promise<Agenda[]> {
    const agendas = await AgendaModel.find({ patientId }).populate('patient', 'name').lean({ virtuals: true }).exec();
    return agendas.map(mapAgenda);
  }

  async hasOverlap(userId: string, startDate: Date, endDate: Date, excludeId?: string): Promise<boolean> {
    const query: any = {
      userId,
      status: { $nin: ['cancelled', 'no_show'] },
      startDate: { $lt: endDate },
      endDate: { $gt: startDate }
    };

    if (excludeId) {
      if (mongoose.Types.ObjectId.isValid(excludeId)) {
        query._id = { $ne: excludeId };
      } else {
        query.id = { $ne: excludeId };
      }
    }

    console.log("[hasOverlap] Verificando conflito com query:", JSON.stringify(query, null, 2));
    const overlap = await AgendaModel.findOne(query).exec();
    if (overlap) {
      console.log("[hasOverlap] Conflito encontrado com o ID:", overlap.id);
    } else {
      console.log("[hasOverlap] Nenhum conflito encontrado.");
    }
    return overlap !== null;
  }

  async create(agenda: Agenda): Promise<Agenda> {
    const newAgenda = new AgendaModel(agenda);
    const saved = await newAgenda.save();
    return AgendaModel.findById(saved._id).populate('patient', 'name').lean({ virtuals: true }).exec().then(a => mapAgenda(a));
  }

  async update(id: string, agenda: Partial<Agenda>): Promise<Agenda | null> {
    const isObjectId = mongoose.Types.ObjectId.isValid(id);
    const query = isObjectId ? { _id: id } : { id: id };
    const updated = await AgendaModel.findOneAndUpdate(query, agenda, { new: true }).populate('patient', 'name').lean({ virtuals: true }).exec();
    return updated ? mapAgenda(updated) : null;
  }

  async delete(id: string): Promise<boolean> {
    const isObjectId = mongoose.Types.ObjectId.isValid(id);
    const query = isObjectId ? { _id: id } : { id: id };
    const result = await AgendaModel.findOneAndDelete(query).exec();
    return result !== null;
  }
}