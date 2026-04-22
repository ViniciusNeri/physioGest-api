import { injectable } from "tsyringe";
import type { IPatientRepository } from "../../../domain/interfaces/IPatientRepository.js";
import type { Patient } from "../../../domain/entities/Patient.js";
import PatientModel from "../models/PatientModel.js";
import AgendaModel from "../models/AgendaModel.js";
import mongoose from "mongoose";


@injectable()
export class PatientRepository implements IPatientRepository {
  async findById(id: string): Promise<Patient | null> {
    const isObjectId = mongoose.Types.ObjectId.isValid(id);
    const query = isObjectId ? { _id: id } : { id: id };
    return PatientModel.findOne(query).lean<Patient>({ virtuals: true }).exec();
  }

  async findByUserId(userId: string): Promise<Patient[]> {
    const patients = await PatientModel.find({ userId }).lean<Patient[]>({ virtuals: true }).exec();
    return this.enrichWithAgendaStats(patients);
  }

  async findAll(): Promise<Patient[]> {
    const patients = await PatientModel.find({}).lean<Patient[]>({ virtuals: true }).exec();
    return this.enrichWithAgendaStats(patients);
  }

  async create(patient: Omit<Patient, 'id'>): Promise<Patient> {
    const newPatient = new PatientModel(patient);
    return newPatient.save();
  }

  async update(id: string, patient: Partial<Patient>): Promise<Patient | null> {
    const isObjectId = mongoose.Types.ObjectId.isValid(id);
    const query = isObjectId ? { _id: id } : { id: id };
    const updatedPatient = await PatientModel.findOneAndUpdate(query, patient, { new: true }).lean<Patient>({ virtuals: true }).exec();
    return updatedPatient;
  }

  async delete(id: string): Promise<boolean> {
    const isObjectId = mongoose.Types.ObjectId.isValid(id);
    const query = isObjectId ? { _id: id } : { id: id };
    const result = await PatientModel.findOneAndDelete(query).exec();
    return result !== null;
  }

  async findByPin(userId: string, pin: string): Promise<Patient | null> {
    return PatientModel.findOne({ userId, pin }).lean<Patient>({ virtuals: true }).exec();
  }

  async findByPhone(phone: string): Promise<Patient | null> {
    const patient = await PatientModel.findOne({ phone }).lean().exec();
    if (!patient) return null;
    return { ...patient, id: patient._id.toString() } as Patient;
  }

  private async enrichWithAgendaStats(patients: Patient[]): Promise<Patient[]> {
    if (!patients.length) return [];

    const patientIds = patients.map(p => p.id).filter(Boolean) as string[];
    const agendas = await AgendaModel.find({ patientId: { $in: patientIds } }).lean().exec();

    const agendaByPatient = new Map<string, any[]>();
    agendas.forEach(a => {
      if (!agendaByPatient.has(a.patientId)) {
        agendaByPatient.set(a.patientId, []);
      }
      agendaByPatient.get(a.patientId)!.push(a);
    });

    const now = new Date();

    return patients.map(patient => {
      const pAgendas = agendaByPatient.get(patient.id!) || [];
      let completedCount = 0;
      let cancelledCount = 0;
      let nextAppt: Date | null = null;

      pAgendas.forEach(a => {
        if (a.status === 'completed') completedCount++;
        if (a.status === 'cancelled') cancelledCount++;

        if (a.status === 'scheduled') {
          const startDate = a.startDate ? new Date(a.startDate) : null;
          
          if (startDate && startDate >= now) {
            if (!nextAppt || startDate < nextAppt) {
              nextAppt = startDate;
            }
          }
        }
      });

      return {
        ...patient,
        completedAppointments: completedCount,
        cancelledAppointments: cancelledCount,
        nextAppointmentDate: nextAppt
      };
    });
  }
}