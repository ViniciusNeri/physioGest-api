import { injectable } from "tsyringe";
import type { IPatientRepository } from "../../../domain/interfaces/IPatientRepository.js";
import type { Patient } from "../../../domain/entities/Patient.js";
import PatientModel from "../models/PatientModel.js";
import AgendaModel from "../models/AgendaModel.js";


@injectable()
export class PatientRepository implements IPatientRepository {
  async findById(id: string): Promise<Patient | null> {
    return PatientModel.findById(id).lean<Patient>({ virtuals: true }).exec();
  }

  async findByUserId(userId: string): Promise<Patient[]> {
    const patients = await PatientModel.find({ userId }).lean<Patient[]>({ virtuals: true }).exec();
    return this.enrichWithAgendaStats(patients);
  }

  async findAll(): Promise<Patient[]> {
    const patients = await PatientModel.find().lean<Patient[]>({ virtuals: true }).exec();
    return this.enrichWithAgendaStats(patients);
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
      let noShowCount = 0;
      let nextAppt: Date | null = null;

      pAgendas.forEach(a => {
        if (a.status === 'completed') completedCount++;
        if (a.status === 'no_show') noShowCount++;

        if (a.status === 'scheduled') {
          const agDate = new Date(a.date);
          if (a.time) {
            const [hours, minutes] = a.time.split(':');
            agDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
          }

          if (agDate >= now) {
            if (!nextAppt || agDate < nextAppt) {
              nextAppt = agDate;
            }
          }
        }
      });

      return {
        ...patient,
        completedAppointments: completedCount,
        noShowAppointments: noShowCount,
        nextAppointmentDate: nextAppt
      };
    });
  }
}