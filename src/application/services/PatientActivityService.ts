import { injectable, inject } from "tsyringe";
import type { IPatientActivityRepository } from "../../domain/interfaces/IPatientActivityRepository.js";
import type { IPatientActivityService } from "../../domain/services/IPatientActivityService.js";
import type { PatientActivity } from "../../domain/entities/PatientActivity.js";
import logger from "../../infrastructure/logging/Logger.js";

@injectable()
export class PatientActivityService implements IPatientActivityService {
  constructor(
    @inject("IPatientActivityRepository")
    private repository: IPatientActivityRepository
  ) {}

  async logActivity(activity: Omit<PatientActivity, 'id' | 'date'>): Promise<PatientActivity> {
    logger.debug("Registrando atividade do paciente", { patientId: activity.patientId, type: activity.type });
    return this.repository.create({
      ...activity,
      date: new Date()
    });
  }

  async getPatientHistory(patientId: string): Promise<PatientActivity[]> {
    return this.repository.findByPatientId(patientId);
  }

  async getUserHistory(userId: string): Promise<PatientActivity[]> {
    return this.repository.findByUserId(userId);
  }
}
