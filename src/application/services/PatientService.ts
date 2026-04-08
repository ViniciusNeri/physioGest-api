import { injectable, inject } from "tsyringe";
import type { IPatientRepository } from "../../domain/interfaces/IPatientRepository.js";
import type { IPatientService } from "../../domain/services/IPatientService.js";
import type { Patient } from "../../domain/entities/Patient.js";
import logger from "../../infrastructure/logging/Logger.js";

@injectable()
export class PatientService implements IPatientService {
  constructor(
    @inject("IPatientRepository")
    private repository: IPatientRepository
  ) {}

  async getPatientById(id: string): Promise<Patient | null> {
    logger.debug("Buscando paciente por ID", { patientId: id });

    try {
      const patient = await this.repository.findById(id);
      if (patient) {
        logger.debug("Paciente encontrado", { patientId: id, name: patient.name });
      } else {
        logger.warn("Paciente não encontrado", { patientId: id });
      }
      return patient;
    } catch (error) {
      logger.error("Erro ao buscar paciente por ID", error, { patientId: id });
      throw error;
    }
  }

  async getPatientsByUserId(userId: string): Promise<Patient[]> {
    logger.debug("Buscando pacientes por userId", { userId });

    try {
      const patients = await this.repository.findByUserId(userId);
      logger.info("Pacientes encontrados", { userId, count: patients.length });
      return patients;
    } catch (error) {
      logger.error("Erro ao buscar pacientes por userId", error, { userId });
      throw error;
    }
  }

  async getAllPatients(): Promise<Patient[]> {
    logger.debug("Buscando todos os pacientes");

    try {
      const patients = await this.repository.findAll();
      logger.info("Pacientes encontrados", { count: patients.length });
      return patients;
    } catch (error) {
      logger.error("Erro ao buscar todos os pacientes", error);
      throw error;
    }
  }

  async createPatient(patient: Omit<Patient, 'id'>): Promise<Patient> {
    logger.debug("Criando paciente", { name: patient.name, userId: patient.userId });

    try {
      // Gerar PIN de 4 dígitos único por usuário
      let pin = "";
      let pinUnique = false;
      let attempts = 0;

      while (!pinUnique && attempts < 10) {
        pin = Math.floor(1000 + Math.random() * 9000).toString();
        const existingWithPin = await this.repository.findByPin(patient.userId, pin);
        if (!existingWithPin) {
          pinUnique = true;
        }
        attempts++;
      }

      const patientWithPin = { ...patient, pin, status: patient.status ?? true };
      const createdPatient = await this.repository.create(patientWithPin);

      logger.info("Paciente criado com sucesso", {
        patientId: createdPatient.id,
        name: createdPatient.name,
        userId: createdPatient.userId
      });

      return createdPatient;
    } catch (error) {
      logger.error("Erro ao criar paciente", error, { name: patient.name, userId: patient.userId });
      throw error;
    }
  }

  async updatePatient(id: string, patient: Partial<Patient>): Promise<Patient | null> {
    logger.debug("Atualizando paciente", { patientId: id, updates: Object.keys(patient) });

    try {
      const updatedPatient = await this.repository.update(id, patient);

      if (updatedPatient) {
        logger.info("Paciente atualizado com sucesso", {
          patientId: id,
          name: updatedPatient.name,
          updates: Object.keys(patient)
        });
      } else {
        logger.warn("Paciente não encontrado para atualização", { patientId: id });
      }

      return updatedPatient;
    } catch (error) {
      logger.error("Erro ao atualizar paciente", error, { patientId: id });
      throw error;
    }
  }

  async deletePatient(id: string): Promise<boolean> {
    logger.debug("Deletando paciente", { patientId: id });

    try {
      const deleted = await this.repository.delete(id);

      if (deleted) {
        logger.info("Paciente deletado com sucesso", { patientId: id });
      } else {
        logger.warn("Paciente não encontrado para deleção", { patientId: id });
      }

      return deleted;
    } catch (error) {
      logger.error("Erro ao deletar paciente", error, { patientId: id });
      throw error;
    }
  }
}