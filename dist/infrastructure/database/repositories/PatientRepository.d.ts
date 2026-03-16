import type { IPatientRepository } from "../../../domain/interfaces/IPatientRepository.js";
import type { Patient } from "../../../domain/entities/Patient.js";
export declare class PatientRepository implements IPatientRepository {
    findById(id: string): Promise<Patient | null>;
    findByUserId(userId: string): Promise<Patient[]>;
    findAll(): Promise<Patient[]>;
    create(patient: Omit<Patient, 'id'>): Promise<Patient>;
    update(id: string, patient: Partial<Patient>): Promise<Patient | null>;
    delete(id: string): Promise<boolean>;
}
//# sourceMappingURL=PatientRepository.d.ts.map