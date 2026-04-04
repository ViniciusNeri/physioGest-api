import type { PatientActivity } from "../entities/PatientActivity.js";

export interface IPatientActivityService {
  logActivity(activity: Omit<PatientActivity, 'id' | 'date'>): Promise<PatientActivity>;
  getPatientHistory(patientId: string): Promise<PatientActivity[]>;
  getUserHistory(userId: string): Promise<PatientActivity[]>;
}
