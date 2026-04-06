import { injectable } from "tsyringe";
import type { IAgendaLockRepository } from "../../../domain/interfaces/IAgendaLockRepository.js";
import type { AgendaLock } from "../../../domain/entities/AgendaLock.js";
import AgendaLockModel from "../models/AgendaLockModel.js";

@injectable()
export class AgendaLockRepository implements IAgendaLockRepository {
  async findById(id: string): Promise<AgendaLock | null> {
    return AgendaLockModel.findById(id).lean<AgendaLock>({ virtuals: true }).exec();
  }

  async findByUserId(userId: string): Promise<AgendaLock[]> {
    return AgendaLockModel.find({ userId }).lean<AgendaLock[]>({ virtuals: true }).exec();
  }

  async findByDateRange(userId: string, startDate: Date, endDate: Date): Promise<AgendaLock[]> {
    return AgendaLockModel.find({
      userId,
      date: { $gte: startDate, $lte: endDate }
    }).lean<AgendaLock[]>({ virtuals: true }).exec();
  }

  async create(lock: AgendaLock): Promise<AgendaLock> {
    const newLock = new AgendaLockModel(lock);
    return newLock.save();
  }

  async delete(id: string): Promise<boolean> {
    const result = await AgendaLockModel.findByIdAndDelete(id).exec();
    return result !== null;
  }
}
