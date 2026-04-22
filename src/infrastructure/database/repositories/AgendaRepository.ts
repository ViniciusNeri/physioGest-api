import { injectable } from "tsyringe";
import type { IAgendaRepository } from "../../../domain/interfaces/IAgendaRepository.js";
import type { Agenda } from "../../../domain/entities/Agenda.js";
import AgendaModel from "../models/AgendaModel.js";
import mongoose from "mongoose";
import { getNaiveNowString } from "../../../utils/dateUtils.js";

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
    const a = await AgendaModel.findOne(query).populate('patient', 'name').populate('category', 'name duration').lean({ virtuals: true }).exec();
    return a ? mapAgenda(a) : null;
  }

  async findAll(): Promise<Agenda[]> {
    const agendas = await AgendaModel.find().populate('patient', 'name').populate('category', 'name duration').lean({ virtuals: true }).exec();
    return agendas.map(mapAgenda);
  }

  async findByUserId(userId: string): Promise<Agenda[]> {
    const agendas = await AgendaModel.find({ userId }).populate('patient', 'name').populate('category', 'name duration').lean({ virtuals: true }).exec();
    return agendas.map(mapAgenda);
  }

  async findByPatientId(patientId: string): Promise<Agenda[]> {
    const agendas = await AgendaModel.find({ patientId })
      .populate('patient', 'name')
      .populate('category', 'name duration')
      .lean({ virtuals: true })
      .sort({ startDate: -1 })
      .exec();
    return agendas.map(mapAgenda);
  }

  async hasOverlap(userId: string, patientId: string, startDate: string, endDate: string, excludeId?: string): Promise<boolean> {
    const query: any = {
      status: { $nin: ['cancelled', 'no_show'] },
      $or: [
        { userId: userId },
        { patientId: patientId }
      ],
      // String ISO comparison: startDate < endDate && endDate > startDate
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

    const overlap = await AgendaModel.findOne(query).lean().exec();
    if (overlap) {
      const o = overlap as any;
      console.log(`[hasOverlap] Conflito: ID=${o.id || o._id} De=${o.startDate} até=${o.endDate}`);
    }
    return overlap !== null;
  }

  async findByDateRange(userId: string, startDate: string, endDate: string): Promise<Agenda[]> {
    const appointments = await AgendaModel.find({
      userId,
      status: { $nin: ['cancelled', 'no_show'] },
      $and: [
        { startDate: { $lt: endDate } },
        { endDate: { $gt: startDate } }
      ]
    })
    .populate('patient', 'name')
    .populate('category', 'name duration')
    .lean({ virtuals: true }).exec();
    return appointments.map(mapAgenda);
  }

  async findGlobalByDateRange(startDate: string, endDate: string): Promise<Agenda[]> {
    const appointments = await AgendaModel.find({
      status: { $nin: ['cancelled', 'no_show'] },
      $and: [
        { startDate: { $lt: endDate } },
        { endDate: { $gt: startDate } }
      ]
    })
    .populate('patient', 'name')
    .populate('category', 'name duration')
    .lean({ virtuals: true }).exec();
    return appointments.map(mapAgenda);
  }

  async create(agenda: Agenda): Promise<Agenda> {
    const newAgenda = new AgendaModel(agenda);
    const saved = await newAgenda.save();
    return AgendaModel.findById(saved._id).populate('patient', 'name').populate('category', 'name duration').lean({ virtuals: true }).exec().then(a => mapAgenda(a));
  }

  async update(id: string, agenda: Partial<Agenda>): Promise<Agenda | null> {
    const isObjectId = mongoose.Types.ObjectId.isValid(id);
    const query = isObjectId ? { _id: id } : { id: id };
    const updated = await AgendaModel.findOneAndUpdate(query, agenda, { new: true }).populate('patient', 'name').populate('category', 'name duration').lean({ virtuals: true }).exec();
    return updated ? mapAgenda(updated) : null;
  }

  async delete(id: string): Promise<boolean> {
    const isObjectId = mongoose.Types.ObjectId.isValid(id);
    const query = isObjectId ? { _id: id } : { id: id };
    const result = await AgendaModel.findOneAndDelete(query).exec();
    return result !== null;
  }

  async countFutureAppointmentsOnWeekday(userId: string, weekday: number, timezone: string): Promise<number> {
    const nowStr = getNaiveNowString(timezone);
    const weekdayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Busca todos os agendamentos futuros e filtra por dia da semana via JS
    const appointments = await AgendaModel.find({
      userId,
      status: 'scheduled',
      startDate: { $gte: nowStr }
    }).lean().exec();

    return appointments.filter((a: any) => {
      const datePart = a.startDate?.substring(0, 10);
      if (!datePart) return false;
      return new Date(datePart + 'T12:00:00Z').getUTCDay() === weekday;
    }).length;
  }
}