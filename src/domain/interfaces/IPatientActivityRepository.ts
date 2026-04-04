import type { PatientActivity } from "../entities/PatientActivity.js";

export interface IPatientActivityRepository {
  create(activity: Omit<PatientActivity, 'id'>): Promise<PatientActivity>;
  findByPatientId(patientId: string): Promise<PatientActivity[]>;
  findByUserId(userId: string): Promise<PatientActivity[]>;
}
