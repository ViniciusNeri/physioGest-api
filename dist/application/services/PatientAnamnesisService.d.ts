import type { IPatientAnamnesisRepository } from "../../domain/interfaces/IPatientSubdomainRepositories.js";
import type { IPatientAnamnesisService } from "../../domain/services/IPatientSubdomainServices.js";
import type { PatientAnamnesis } from "../../domain/entities/PatientSubdomains.js";
import type { IPatientActivityService } from "../../domain/services/IPatientActivityService.js";
export declare class PatientAnamnesisService implements IPatientAnamnesisService {
    private repository;
    private activityService;
    constructor(repository: IPatientAnamnesisRepository, activityService: IPatientActivityService);
    getPatientAnamnesis(patientId: string): Promise<PatientAnamnesis[]>;
    getAnamnesisById(id: string): Promise<PatientAnamnesis | null>;
    createAnamnesis(anamnesis: Omit<PatientAnamnesis, 'id'>): Promise<PatientAnamnesis>;
    updateAnamnesis(id: string, anamnesis: Partial<PatientAnamnesis>): Promise<PatientAnamnesis | null>;
    deleteAnamnesis(id: string): Promise<boolean>;
    getLatestAnamnesis(patientId: string): Promise<PatientAnamnesis | null>;
}
//# sourceMappingURL=PatientAnamnesisService.d.ts.map