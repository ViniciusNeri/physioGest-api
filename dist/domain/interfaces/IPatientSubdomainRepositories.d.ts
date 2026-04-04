import type { PatientAnamnesis, PatientFinancial, PatientAttachment } from "../entities/PatientSubdomains.js";
export interface IPatientAnamnesisRepository {
    findByPatientId(patientId: string): Promise<PatientAnamnesis[]>;
    findById(id: string): Promise<PatientAnamnesis | null>;
    create(anamnesis: Omit<PatientAnamnesis, 'id'>): Promise<PatientAnamnesis>;
    update(id: string, anamnesis: Partial<PatientAnamnesis>): Promise<PatientAnamnesis | null>;
    delete(id: string): Promise<boolean>;
    findLatestByPatientId(patientId: string): Promise<PatientAnamnesis | null>;
}
export interface IPatientFinancialRepository {
    findByPatientId(patientId: string): Promise<PatientFinancial[]>;
    findById(id: string): Promise<PatientFinancial | null>;
    create(financial: Omit<PatientFinancial, 'id'>): Promise<PatientFinancial>;
    update(id: string, financial: Partial<PatientFinancial>): Promise<PatientFinancial | null>;
    delete(id: string): Promise<boolean>;
    getBalanceByPatientId(patientId: string): Promise<number>;
    findPendingPaymentsByPatientId(patientId: string): Promise<PatientFinancial[]>;
    findByDateRange(patientId: string, startDate: Date, endDate: Date): Promise<PatientFinancial[]>;
}
export interface IPatientAttachmentRepository {
    findByPatientId(patientId: string): Promise<PatientAttachment[]>;
    findById(id: string): Promise<PatientAttachment | null>;
    create(attachment: Omit<PatientAttachment, 'id'>): Promise<PatientAttachment>;
    update(id: string, attachment: Partial<PatientAttachment>): Promise<PatientAttachment | null>;
    delete(id: string): Promise<boolean>;
    findByCategory(patientId: string, category: string): Promise<PatientAttachment[]>;
}
//# sourceMappingURL=IPatientSubdomainRepositories.d.ts.map