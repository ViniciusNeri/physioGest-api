import type { AgendaLock } from "../entities/AgendaLock.js";

export interface IAgendaLockRepository {
  findById(id: string): Promise<AgendaLock | null>;
  findByUserId(userId: string): Promise<AgendaLock[]>;
  findByDateRange(userId: string, startDate: string, endDate: string): Promise<AgendaLock[]>;
  create(lock: AgendaLock): Promise<AgendaLock>;
  delete(id: string): Promise<boolean>;
}
