import type { IPatientAgendaRepository } from "../../../domain/interfaces/IPatientSubdomainRepositories.js";
import type { PatientAgenda } from "../../../domain/entities/PatientSubdomains.js";
export declare class PatientAgendaRepository implements IPatientAgendaRepository {
    findByPatientId(patientId: string): Promise<PatientAgenda[]>;
    findById(id: string): Promise<PatientAgenda | null>;
    create(agenda: Omit<PatientAgenda, 'id'>): Promise<PatientAgenda>;
    update(id: string, agenda: Partial<PatientAgenda>): Promise<PatientAgenda | null>;
    delete(id: string): Promise<boolean>;
    findUpcomingByPatientId(patientId: string, limit?: number): Promise<PatientAgenda[]>;
    findByDateRange(patientId: string, startDate: Date, endDate: Date): Promise<PatientAgenda[]>;
}
//# sourceMappingURL=PatientAgendaRepository.d.ts.map