import { injectable, inject } from "tsyringe";
import type { IPatientAnamnesisRepository } from "../../domain/interfaces/IPatientSubdomainRepositories.js";
import type { IPatientAnamnesisService } from "../../domain/services/IPatientSubdomainServices.js";
import type { PatientAnamnesis } from "../../domain/entities/PatientSubdomains.js";
import logger from "../../infrastructure/logging/Logger.js";
import type { IPatientActivityService } from "../../domain/services/IPatientActivityService.js";
import { toLocalISOString } from "../../utils/dateUtils.js";

@injectable()
export class PatientAnamnesisService implements IPatientAnamnesisService {
  constructor(
    @inject("IPatientAnamnesisRepository")
    private repository: IPatientAnamnesisRepository,
    @inject("IPatientActivityService")
    private activityService: IPatientActivityService
  ) {}

  async getPatientAnamnesis(patientId: string): Promise<PatientAnamnesis[]> {
    logger.debug("Buscando anamneses do paciente", { patientId });

    try {
      const anamnesis = await this.repository.findByPatientId(patientId);
      logger.debug("Anamneses do paciente encontradas", { patientId, count: anamnesis.length });
      return anamnesis;
    } catch (error) {
      logger.error("Erro ao buscar anamneses do paciente", error, { patientId });
      throw error;
    }
  }

  async getAnamnesisById(id: string): Promise<PatientAnamnesis | null> {
    logger.debug("Buscando anamnese por ID", { anamnesisId: id });

    try {
      const anamnesis = await this.repository.findById(id);
      if (anamnesis) {
        logger.debug("Anamnese encontrada", { anamnesisId: id, patientId: anamnesis.patientId });
      } else {
        logger.warn("Anamnese não encontrada", { anamnesisId: id });
      }
      return anamnesis;
    } catch (error) {
      logger.error("Erro ao buscar anamnese por ID", error, { anamnesisId: id });
      throw error;
    }
  }

  async createAnamnesis(anamnesis: Omit<PatientAnamnesis, 'id'>): Promise<PatientAnamnesis> {
    logger.debug("Criando nova anamnese", { patientId: anamnesis.patientId });

    try {
      if (anamnesis.date) {
        anamnesis.date = toLocalISOString(anamnesis.date);
      }
      const newAnamnesis = await this.repository.create(anamnesis);
      
      // Registra atividade
      await this.activityService.logActivity({
        patientId: newAnamnesis.patientId,
        userId: newAnamnesis.userId || "",
        type: 'anamnesis_updated',
        description: `Anamnese criada`,
        metadata: { anamnesisId: newAnamnesis.id }
      }).catch(err => logger.error("Erro ao logar atividade (create anamnesis)", err));

      logger.info("Anamnese criada com sucesso", { anamnesisId: newAnamnesis.id, patientId: anamnesis.patientId });
      return newAnamnesis;
    } catch (error) {
      logger.error("Erro ao criar anamnese", error, { patientId: anamnesis.patientId });
      throw error;
    }
  }

  async updateAnamnesis(id: string, anamnesis: Partial<PatientAnamnesis>): Promise<PatientAnamnesis | null> {
    logger.debug("Atualizando anamnese", { anamnesisId: id });

    try {
      if (anamnesis.date) {
        anamnesis.date = toLocalISOString(anamnesis.date);
      }
      const updatedAnamnesis = await this.repository.update(id, anamnesis);
      if (updatedAnamnesis) {
        // Registra atividade
        await this.activityService.logActivity({
          patientId: updatedAnamnesis.patientId,
          userId: updatedAnamnesis.userId || "",
          type: 'anamnesis_updated',
          description: `Anamnese atualizada`,
          metadata: { anamnesisId: id }
        }).catch(err => logger.error("Erro ao logar atividade (update anamnesis)", err));

        logger.info("Anamnese atualizada com sucesso", { anamnesisId: id });
      } else {
        logger.warn("Anamnese não encontrada para atualização", { anamnesisId: id });
      }
      return updatedAnamnesis;
    } catch (error) {
      logger.error("Erro ao atualizar anamnese", error, { anamnesisId: id });
      throw error;
    }
  }

  async deleteAnamnesis(id: string): Promise<boolean> {
    logger.debug("Deletando anamnese", { anamnesisId: id });

    try {
      const deleted = await this.repository.delete(id);
      if (deleted) {
        logger.info("Anamnese deletada com sucesso", { anamnesisId: id });
      } else {
        logger.warn("Anamnese não encontrada para deleção", { anamnesisId: id });
      }
      return deleted;
    } catch (error) {
      logger.error("Erro ao deletar anamnese", error, { anamnesisId: id });
      throw error;
    }
  }

  async getLatestAnamnesis(patientId: string): Promise<PatientAnamnesis | null> {
    logger.debug("Buscando última anamnese do paciente", { patientId });

    try {
      const anamnesis = await this.repository.findLatestByPatientId(patientId);
      if (anamnesis) {
        logger.debug("Última anamnese encontrada", { patientId, anamnesisId: anamnesis.id });
      } else {
        logger.debug("Nenhuma anamnese encontrada para o paciente", { patientId });
      }
      return anamnesis;
    } catch (error) {
      logger.error("Erro ao buscar última anamnese", error, { patientId });
      throw error;
    }
  }
}