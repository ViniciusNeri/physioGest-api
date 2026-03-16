import type { IPatientAgendaRepository } from "../../domain/interfaces/IPatientSubdomainRepositories.js";
import type { IPatientAgendaService } from "../../domain/services/IPatientSubdomainServices.js";
import type { PatientAgenda } from "../../domain/entities/PatientSubdomains.js";
export declare class PatientAgendaService implements IPatientAgendaService {
    private repository;
    constructor(repository: IPatientAgendaRepository);
    getPatientAgenda(patientId: string): Promise<PatientAgenda[]>;
    getAgendaById(id: string): Promise<PatientAgenda | null>;
    createAgenda(agenda: Omit<PatientAgenda, 'id'>): Promise<PatientAgenda>;
    updateAgenda(id: string, agenda: Partial<PatientAgenda>): Promise<PatientAgenda | null>;
    deleteAgenda(id: string): Promise<boolean>;
    getUpcomingAgenda(patientId: string, limit?: number): Promise<PatientAgenda[]>;
    getAgendaByDateRange(patientId: string, startDate: Date, endDate: Date): Promise<PatientAgenda[]>;
}
//# sourceMappingURL=PatientAgendaService.d.ts.map