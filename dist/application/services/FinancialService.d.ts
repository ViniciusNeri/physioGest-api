import type { IFinancialRepository } from "../../domain/interfaces/IFinancialRepository.js";
import type { IFinancialService } from "../../domain/services/IFinancialService.js";
import type { Financial } from "../../domain/entities/Financial.js";
import type { ILogger } from "../../infrastructure/logging/Logger.js";
export declare class FinancialService implements IFinancialService {
    private repository;
    private logger;
    constructor(repository: IFinancialRepository, logger: ILogger);
    getFinancialById(id: string): Promise<Financial | null>;
    getAllFinancials(): Promise<Financial[]>;
    getFinancialsByUserId(userId: string): Promise<Financial[]>;
    createFinancial(financial: Omit<Financial, 'id'>): Promise<Financial>;
    updateFinancial(id: string, financial: Partial<Financial>): Promise<Financial | null>;
    deleteFinancial(id: string): Promise<boolean>;
}
//# sourceMappingURL=FinancialService.d.ts.map