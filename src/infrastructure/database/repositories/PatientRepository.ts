import { injectable } from "tsyringe";
import type { IPatientRepository } from "../../../domain/interfaces/IPatientRepository.js";
import type { Patient } from "../../../domain/entities/Patient.js";
import PatientModel from "../models/PatientModel.js";

@injectable()
export class PatientRepository implements IPatientRepository {
  async findById(id: string): Promise<Patient | null> {
    return PatientModel.findById(id).lean<Patient>({ virtuals: true }).exec();
  }

  async findByUserId(userId: string): Promise<Patient[]> {
    return PatientModel.find({ userId }).lean<Patient[]>({ virtuals: true }).exec();
  }

  async findAll(): Promise<Patient[]> {
    return PatientModel.find().lean<Patient[]>({ virtuals: true }).exec();
  }

  async create(patient: Omit<Patient, 'id'>): Promise<Patient> {
    const newPatient = new PatientModel(patient);
    return newPatient.save();
  }

  async update(id: string, patient: Partial<Patient>): Promise<Patient | null> {
    const updatedPatient = await PatientModel.findByIdAndUpdate(id, patient, { new: true }).lean<Patient>({ virtuals: true }).exec();
    return updatedPatient;
  }

  async delete(id: string): Promise<boolean> {
    const result = await PatientModel.findByIdAndDelete(id).exec();
    return result !== null;
  }
}