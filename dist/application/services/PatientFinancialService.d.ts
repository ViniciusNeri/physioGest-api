import type { IPatientFinancialRepository } from "../../domain/interfaces/IPatientSubdomainRepositories.js";
import type { IAgendaRepository } from "../../domain/interfaces/IAgendaRepository.js";
import type { IPatientFinancialService } from "../../domain/services/IPatientSubdomainServices.js";
import type { PatientFinancial, PatientFinancialSummary } from "../../domain/entities/PatientSubdomains.js";
export declare class PatientFinancialService implements IPatientFinancialService {
    private repository;
    private agendaRepository;
    constructor(repository: IPatientFinancialRepository, agendaRepository: IAgendaRepository);
    getPatientFinancial(patientId: string): Promise<PatientFinancial[]>;
    getFinancialById(id: string): Promise<PatientFinancial | null>;
    createFinancial(financial: Omit<PatientFinancial, 'id'>): Promise<PatientFinancial>;
    updateFinancial(id: string, financial: Partial<PatientFinancial>): Promise<PatientFinancial | null>;
    deleteFinancial(id: string): Promise<boolean>;
    getPatientBalance(patientId: string): Promise<number>;
    getPendingPayments(patientId: string): Promise<PatientFinancial[]>;
    getFinancialByDateRange(patientId: string, startDate: Date, endDate: Date): Promise<PatientFinancial[]>;
    getFinancialSummary(patientId: string): Promise<PatientFinancialSummary>;
    payFinancial(id: string, paymentMethod?: string): Promise<PatientFinancial | null>;
}
//# sourceMappingURL=PatientFinancialService.d.ts.map