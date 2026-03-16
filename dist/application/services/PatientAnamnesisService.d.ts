import type { IPatientAnamnesisRepository } from "../../domain/interfaces/IPatientSubdomainRepositories.js";
import type { IPatientAnamnesisService } from "../../domain/services/IPatientSubdomainServices.js";
import type { PatientAnamnesis } from "../../domain/entities/PatientSubdomains.js";
export declare class PatientAnamnesisService implements IPatientAnamnesisService {
    private repository;
    constructor(repository: IPatientAnamnesisRepository);
    getPatientAnamnesis(patientId: string): Promise<PatientAnamnesis[]>;
    getAnamnesisById(id: string): Promise<PatientAnamnesis | null>;
    createAnamnesis(anamnesis: Omit<PatientAnamnesis, 'id'>): Promise<PatientAnamnesis>;
    updateAnamnesis(id: string, anamnesis: Partial<PatientAnamnesis>): Promise<PatientAnamnesis | null>;
    deleteAnamnesis(id: string): Promise<boolean>;
    getLatestAnamnesis(patientId: string): Promise<PatientAnamnesis | null>;
}
//# sourceMappingURL=PatientAnamnesisService.d.ts.map