import type { IFinancialRepository } from "../../../domain/interfaces/IFinancialRepository.js";
import type { Financial } from "../../../domain/entities/Financial.js";
export declare class FinancialRepository implements IFinancialRepository {
    findById(id: string): Promise<Financial | null>;
    findAll(): Promise<Financial[]>;
    findByUserId(userId: string): Promise<Financial[]>;
    findByPatientId(patientId: string): Promise<Financial[]>;
    create(financial: Financial): Promise<Financial>;
    update(id: string, financial: Partial<Financial>): Promise<Financial | null>;
    delete(id: string): Promise<boolean>;
}
//# sourceMappingURL=FinancialRepository.d.ts.map