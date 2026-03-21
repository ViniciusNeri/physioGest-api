import type { ISettingRepository } from "../../../domain/interfaces/ISettingRepository.js";
import type { Setting } from "../../../domain/entities/Setting.js";
export declare class SettingRepository implements ISettingRepository {
    findById(id: string): Promise<Setting | null>;
    findAll(): Promise<Setting[]>;
    findByUserId(userId: string): Promise<Setting | null>;
    create(setting: Setting): Promise<Setting>;
    update(id: string, setting: Partial<Setting>): Promise<Setting | null>;
    delete(id: string): Promise<boolean>;
}
//# sourceMappingURL=SettingRepository.d.ts.map