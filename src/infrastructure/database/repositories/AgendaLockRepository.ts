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
    return AgendaLockModel.find({ userId })
      .sort({ date: 1, startTime: 1 })
      .lean<AgendaLock[]>({ virtuals: true })
      .exec();
  }

  async findByDateRange(userId: string, startDate: string, endDate: string): Promise<AgendaLock[]> {
    // Extrai o dia (YYYY-MM-DD) da string de startDate para cobrir o dia inteiro
    const datePart = startDate.substring(0, 10);
    const dayStart = `${datePart}T00:00:00`;
    const dayEnd = `${datePart}T23:59:59`;

    return AgendaLockModel.find({
      userId,
      date: { $gte: dayStart, $lte: dayEnd }
    })
      .sort({ date: 1, startTime: 1 })
      .lean<AgendaLock[]>({ virtuals: true })
      .exec();
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
