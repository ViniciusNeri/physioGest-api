import type { IDashboardRepository } from "../../domain/interfaces/IDashboardRepository.js";
import type { IDashboardService } from "../../domain/services/IDashboardService.js";
import type { DashboardData } from "../../domain/entities/Dashboard.js";
export declare class DashboardService implements IDashboardService {
    private repository;
    constructor(repository: IDashboardRepository);
    getDashboardData(userId: string): Promise<DashboardData>;
}
//# sourceMappingURL=DashboardService.d.ts.map