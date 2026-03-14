import { injectable } from "tsyringe";
import type { IAgendaRepository } from "../../../domain/interfaces/IAgendaRepository.js";
import type { Agenda } from "../../../domain/entities/Agenda.js";
import AgendaModel from "../models/AgendaModel.js";

@injectable()
export class AgendaRepository implements IAgendaRepository {
  async findById(id: string): Promise<Agenda | null> {
    return AgendaModel.findById(id).lean<Agenda>().exec();
  }

  async findAll(): Promise<Agenda[]> {
    return AgendaModel.find().lean<Agenda[]>().exec();
  }

  async findByUserId(userId: string): Promise<Agenda[]> {
    return AgendaModel.find({ userId }).lean<Agenda[]>().exec();
  }

  async create(agenda: Agenda): Promise<Agenda> {
    const newAgenda = new AgendaModel(agenda);
    return newAgenda.save();
  }

  async update(id: string, agenda: Partial<Agenda>): Promise<Agenda | null> {
    return AgendaModel.findByIdAndUpdate(id, agenda, { new: true }).lean<Agenda>().exec();
  }

  async delete(id: string): Promise<boolean> {
    const result = await AgendaModel.findByIdAndDelete(id).exec();
    return result !== null;
  }
}