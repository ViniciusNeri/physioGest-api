import { injectable, inject } from "tsyringe";
import type { IPatientActivityRepository } from "../../domain/interfaces/IPatientActivityRepository.js";
import type { IPatientActivityService } from "../../domain/services/IPatientActivityService.js";
import type { PatientActivity } from "../../domain/entities/PatientActivity.js";
import type { ILogger } from "../../infrastructure/logging/Logger.js";
import type { ISettingRepository } from "../../domain/interfaces/ISettingRepository.js";
import { getNaiveNow } from "../../utils/dateUtils.js";

@injectable()
export class PatientActivityService implements IPatientActivityService {
  constructor(
    @inject("IPatientActivityRepository")
    private repository: IPatientActivityRepository,
    @inject("Logger")
    private logger: ILogger,
    @inject("ISettingRepository")
    private settingRepository: ISettingRepository
  ) {}

  async logActivity(activity: Omit<PatientActivity, 'id' | 'date'>): Promise<PatientActivity> {
    this.logger.debug("Registrando atividade do paciente", { patientId: activity.patientId, type: activity.type });
    
    let timezone = 'America/Sao_Paulo';
    try {
      const settings = await this.settingRepository.findByUserId(activity.userId);
      if (settings?.timezone) {
        timezone = settings.timezone;
      }
    } catch (e) {
      this.logger.warn("Erro ao buscar timezone para log, usando padrão.");
    }

    return this.repository.create({
      ...activity,
      date: getNaiveNow(timezone)
    });
  }

  async getPatientHistory(patientId: string): Promise<PatientActivity[]> {
    return this.repository.findByPatientId(patientId);
  }

  async getUserHistory(userId: string): Promise<PatientActivity[]> {
    return this.repository.findByUserId(userId);
  }
}
