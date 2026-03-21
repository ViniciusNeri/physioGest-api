import type { ISettingRepository } from "../../domain/interfaces/ISettingRepository.js";
import type { ISettingService } from "../../domain/services/ISettingService.js";
import type { Setting } from "../../domain/entities/Setting.js";
import type { ILogger } from "../../infrastructure/logging/Logger.js";
export declare class SettingService implements ISettingService {
    private repository;
    private logger;
    constructor(repository: ISettingRepository, logger: ILogger);
    getSettingById(id: string): Promise<Setting | null>;
    getAllSettings(): Promise<Setting[]>;
    getSettingByUserId(userId: string): Promise<Setting | null>;
    createSetting(setting: Omit<Setting, 'id'>): Promise<Setting>;
    updateSetting(id: string, setting: Partial<Setting>): Promise<Setting | null>;
    deleteSetting(id: string): Promise<boolean>;
}
//# sourceMappingURL=SettingService.d.ts.map