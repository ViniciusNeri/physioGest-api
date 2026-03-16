import { injectable } from "tsyringe";
import type { IPatientAgendaRepository } from "../../../domain/interfaces/IPatientSubdomainRepositories.js";
import type { PatientAgenda } from "../../../domain/entities/PatientSubdomains.js";
import PatientAgendaModel from "../models/PatientAgendaModel.js";

@injectable()
export class PatientAgendaRepository implements IPatientAgendaRepository {
  async findByPatientId(patientId: string): Promise<PatientAgenda[]> {
    return PatientAgendaModel.find({ patientId })
      .sort({ date: 1, time: 1 })
      .lean<PatientAgenda[]>({ virtuals: true })
      .exec();
  }

  async findById(id: string): Promise<PatientAgenda | null> {
    return PatientAgendaModel.findById(id)
      .lean<PatientAgenda>({ virtuals: true })
      .exec();
  }

  async create(agenda: Omit<PatientAgenda, 'id'>): Promise<PatientAgenda> {
    const newAgenda = new PatientAgendaModel(agenda);
    return newAgenda.save();
  }

  async update(id: string, agenda: Partial<PatientAgenda>): Promise<PatientAgenda | null> {
    const updatedAgenda = await PatientAgendaModel.findByIdAndUpdate(id, agenda, { new: true })
      .lean<PatientAgenda>({ virtuals: true })
      .exec();
    return updatedAgenda;
  }

  async delete(id: string): Promise<boolean> {
    const result = await PatientAgendaModel.findByIdAndDelete(id).exec();
    return result !== null;
  }

  async findUpcomingByPatientId(patientId: string, limit: number = 10): Promise<PatientAgenda[]> {
    const now = new Date();
    return PatientAgendaModel.find({
      patientId,
      date: { $gte: now },
      status: { $in: ['scheduled'] }
    })
      .sort({ date: 1, time: 1 })
      .limit(limit)
      .lean<PatientAgenda[]>({ virtuals: true })
      .exec();
  }

  async findByDateRange(patientId: string, startDate: Date, endDate: Date): Promise<PatientAgenda[]> {
    return PatientAgendaModel.find({
      patientId,
      date: {
        $gte: startDate,
        $lte: endDate
      }
    })
      .sort({ date: 1, time: 1 })
      .lean<PatientAgenda[]>({ virtuals: true })
      .exec();
  }
}