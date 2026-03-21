import type { Setting } from "../entities/Setting.js";
export interface ISettingService {
    getSettingById(id: string): Promise<Setting | null>;
    getAllSettings(): Promise<Setting[]>;
    getSettingByUserId(userId: string): Promise<Setting | null>;
    createSetting(setting: Omit<Setting, 'id'>): Promise<Setting>;
    updateSetting(id: string, setting: Partial<Setting>): Promise<Setting | null>;
    deleteSetting(id: string): Promise<boolean>;
}
//# sourceMappingURL=ISettingService.d.ts.map