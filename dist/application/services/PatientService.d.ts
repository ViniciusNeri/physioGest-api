import type { IPatientRepository } from "../../domain/interfaces/IPatientRepository.js";
import type { IPatientService } from "../../domain/services/IPatientService.js";
import type { Patient } from "../../domain/entities/Patient.js";
export declare class PatientService implements IPatientService {
    private repository;
    constructor(repository: IPatientRepository);
    getPatientById(id: string): Promise<Patient | null>;
    getPatientsByUserId(userId: string): Promise<Patient[]>;
    getAllPatients(): Promise<Patient[]>;
    createPatient(patient: Omit<Patient, 'id'>): Promise<Patient>;
    updatePatient(id: string, patient: Partial<Patient>): Promise<Patient | null>;
    deletePatient(id: string): Promise<boolean>;
}
//# sourceMappingURL=PatientService.d.ts.map