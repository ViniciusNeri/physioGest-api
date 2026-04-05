import type { IFinancialRepository } from "../../domain/interfaces/IFinancialRepository.js";
import type { IFinancialService, FinancialConsolidated } from "../../domain/services/IFinancialService.js";
import type { Financial } from "../../domain/entities/Financial.js";
import type { ILogger } from "../../infrastructure/logging/Logger.js";
import type { IPatientRepository } from "../../domain/interfaces/IPatientRepository.js";
export declare class FinancialService implements IFinancialService {
    private repository;
    private patientFinancialRepository;
    private patientRepository;
    private logger;
    constructor(repository: IFinancialRepository, patientFinancialRepository: any, patientRepository: IPatientRepository, logger: ILogger);
    getMonthlyConsolidated(userId: string, month: number, year: number): Promise<FinancialConsolidated>;
    getFinancialById(id: string): Promise<Financial | null>;
    getAllFinancials(): Promise<Financial[]>;
    getFinancialsByUserId(userId: string): Promise<Financial[]>;
    getFinancialsByPatientId(patientId: string): Promise<Financial[]>;
    createFinancial(financial: Omit<Financial, 'id'>): Promise<Financial>;
    updateFinancial(id: string, financial: Partial<Financial>): Promise<Financial | null>;
    deleteFinancial(id: string, source?: string): Promise<boolean>;
}
//# sourceMappingURL=FinancialService.d.ts.map