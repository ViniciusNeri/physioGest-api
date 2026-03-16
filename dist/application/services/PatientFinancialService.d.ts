import type { IPatientFinancialRepository } from "../../domain/interfaces/IPatientSubdomainRepositories.js";
import type { IPatientFinancialService } from "../../domain/services/IPatientSubdomainServices.js";
import type { PatientFinancial } from "../../domain/entities/PatientSubdomains.js";
export declare class PatientFinancialService implements IPatientFinancialService {
    private repository;
    constructor(repository: IPatientFinancialRepository);
    getPatientFinancial(patientId: string): Promise<PatientFinancial[]>;
    getFinancialById(id: string): Promise<PatientFinancial | null>;
    createFinancial(financial: Omit<PatientFinancial, 'id'>): Promise<PatientFinancial>;
    updateFinancial(id: string, financial: Partial<PatientFinancial>): Promise<PatientFinancial | null>;
    deleteFinancial(id: string): Promise<boolean>;
    getPatientBalance(patientId: string): Promise<number>;
    getPendingPayments(patientId: string): Promise<PatientFinancial[]>;
    getFinancialByDateRange(patientId: string, startDate: Date, endDate: Date): Promise<PatientFinancial[]>;
}
//# sourceMappingURL=PatientFinancialService.d.ts.map