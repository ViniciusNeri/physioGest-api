import type { IPatientFinancialRepository } from "../../../domain/interfaces/IPatientSubdomainRepositories.js";
import type { PatientFinancial } from "../../../domain/entities/PatientSubdomains.js";
export declare class PatientFinancialRepository implements IPatientFinancialRepository {
    findByPatientId(patientId: string): Promise<PatientFinancial[]>;
    findById(id: string): Promise<PatientFinancial | null>;
    create(financial: Omit<PatientFinancial, 'id'>): Promise<PatientFinancial>;
    update(id: string, financial: Partial<PatientFinancial>): Promise<PatientFinancial | null>;
    delete(id: string): Promise<boolean>;
    getBalanceByPatientId(patientId: string): Promise<number>;
    findPendingPaymentsByPatientId(patientId: string): Promise<PatientFinancial[]>;
    findByUserAndDate(userId: string, month: number, year: number): Promise<PatientFinancial[]>;
    findByDateRange(patientId: string, startDate: Date, endDate: Date): Promise<PatientFinancial[]>;
}
//# sourceMappingURL=PatientFinancialRepository.d.ts.map