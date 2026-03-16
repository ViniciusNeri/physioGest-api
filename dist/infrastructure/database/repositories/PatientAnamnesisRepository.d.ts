import type { IPatientAnamnesisRepository } from "../../../domain/interfaces/IPatientSubdomainRepositories.js";
import type { PatientAnamnesis } from "../../../domain/entities/PatientSubdomains.js";
export declare class PatientAnamnesisRepository implements IPatientAnamnesisRepository {
    findByPatientId(patientId: string): Promise<PatientAnamnesis[]>;
    findById(id: string): Promise<PatientAnamnesis | null>;
    create(anamnesis: Omit<PatientAnamnesis, 'id'>): Promise<PatientAnamnesis>;
    update(id: string, anamnesis: Partial<PatientAnamnesis>): Promise<PatientAnamnesis | null>;
    delete(id: string): Promise<boolean>;
    findLatestByPatientId(patientId: string): Promise<PatientAnamnesis | null>;
}
//# sourceMappingURL=PatientAnamnesisRepository.d.ts.map