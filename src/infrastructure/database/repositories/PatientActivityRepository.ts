import { injectable } from "tsyringe";
import type { IPatientActivityRepository } from "../../../domain/interfaces/IPatientActivityRepository.js";
import type { PatientActivity } from "../../../domain/entities/PatientActivity.js";
import PatientActivityModel from "../models/PatientActivityModel.js";

@injectable()
export class PatientActivityRepository implements IPatientActivityRepository {
  async create(activity: Omit<PatientActivity, 'id'>): Promise<PatientActivity> {
    const newActivity = new PatientActivityModel(activity);
    return newActivity.save();
  }

  async findByPatientId(patientId: string): Promise<PatientActivity[]> {
    return PatientActivityModel.find({ patientId }).sort({ date: -1 }).lean<PatientActivity[]>({ virtuals: true }).exec();
  }

  async findByUserId(userId: string): Promise<PatientActivity[]> {
    return PatientActivityModel.find({ userId }).sort({ date: -1 }).lean<PatientActivity[]>({ virtuals: true }).exec();
  }
}
