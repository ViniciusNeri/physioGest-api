import type { Setting } from "../entities/Setting.js";

export interface ISettingRepository {
  findById(id: string): Promise<Setting | null>;
  findAll(): Promise<Setting[]>;
  findByUserId(userId: string): Promise<Setting | null>;
  create(setting: Setting): Promise<Setting>;
  update(id: string, setting: Partial<Setting>): Promise<Setting | null>;
  delete(id: string): Promise<boolean>;
}
