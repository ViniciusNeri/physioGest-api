import { injectable } from "tsyringe";
import type { IPatientAnamnesisRepository } from "../../../domain/interfaces/IPatientSubdomainRepositories.js";
import type { PatientAnamnesis } from "../../../domain/entities/PatientSubdomains.js";
import PatientAnamnesisModel from "../models/PatientAnamnesisModel.js";

@injectable()
export class PatientAnamnesisRepository implements IPatientAnamnesisRepository {
  async findByPatientId(patientId: string): Promise<PatientAnamnesis[]> {
    return PatientAnamnesisModel.find({ patientId })
      .sort({ date: -1 })
      .lean<PatientAnamnesis[]>({ virtuals: true })
      .exec();
  }

  async findById(id: string): Promise<PatientAnamnesis | null> {
    return PatientAnamnesisModel.findById(id)
      .lean<PatientAnamnesis>({ virtuals: true })
      .exec();
  }

  async create(anamnesis: Omit<PatientAnamnesis, 'id'>): Promise<PatientAnamnesis> {
    const newAnamnesis = new PatientAnamnesisModel(anamnesis);
    return newAnamnesis.save();
  }

  async update(id: string, anamnesis: Partial<PatientAnamnesis>): Promise<PatientAnamnesis | null> {
    const updatedAnamnesis = await PatientAnamnesisModel.findByIdAndUpdate(id, anamnesis, { new: true })
      .lean<PatientAnamnesis>({ virtuals: true })
      .exec();
    return updatedAnamnesis;
  }

  async delete(id: string): Promise<boolean> {
    const result = await PatientAnamnesisModel.findByIdAndDelete(id).exec();
    return result !== null;
  }

  async findLatestByPatientId(patientId: string): Promise<PatientAnamnesis | null> {
    const anamnesis = await PatientAnamnesisModel.findOne({ patientId })
      .sort({ date: -1 })
      .lean<PatientAnamnesis>({ virtuals: true })
      .exec();
    return anamnesis;
  }
}