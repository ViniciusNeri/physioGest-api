var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { injectable, inject } from "tsyringe";
import logger from "../../infrastructure/logging/Logger.js";
import { toLocalISOString } from "../../utils/dateUtils.js";
let PatientAnamnesisService = class PatientAnamnesisService {
    repository;
    activityService;
    constructor(repository, activityService) {
        this.repository = repository;
        this.activityService = activityService;
    }
    async getPatientAnamnesis(patientId) {
        logger.debug("Buscando anamneses do paciente", { patientId });
        try {
            const anamnesis = await this.repository.findByPatientId(patientId);
            logger.debug("Anamneses do paciente encontradas", { patientId, count: anamnesis.length });
            return anamnesis;
        }
        catch (error) {
            logger.error("Erro ao buscar anamneses do paciente", error, { patientId });
            throw error;
        }
    }
    async getAnamnesisById(id) {
        logger.debug("Buscando anamnese por ID", { anamnesisId: id });
        try {
            const anamnesis = await this.repository.findById(id);
            if (anamnesis) {
                logger.debug("Anamnese encontrada", { anamnesisId: id, patientId: anamnesis.patientId });
            }
            else {
                logger.warn("Anamnese não encontrada", { anamnesisId: id });
            }
            return anamnesis;
        }
        catch (error) {
            logger.error("Erro ao buscar anamnese por ID", error, { anamnesisId: id });
            throw error;
        }
    }
    async createAnamnesis(anamnesis) {
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
        }
        catch (error) {
            logger.error("Erro ao criar anamnese", error, { patientId: anamnesis.patientId });
            throw error;
        }
    }
    async updateAnamnesis(id, anamnesis) {
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
            }
            else {
                logger.warn("Anamnese não encontrada para atualização", { anamnesisId: id });
            }
            return updatedAnamnesis;
        }
        catch (error) {
            logger.error("Erro ao atualizar anamnese", error, { anamnesisId: id });
            throw error;
        }
    }
    async deleteAnamnesis(id) {
        logger.debug("Deletando anamnese", { anamnesisId: id });
        try {
            const deleted = await this.repository.delete(id);
            if (deleted) {
                logger.info("Anamnese deletada com sucesso", { anamnesisId: id });
            }
            else {
                logger.warn("Anamnese não encontrada para deleção", { anamnesisId: id });
            }
            return deleted;
        }
        catch (error) {
            logger.error("Erro ao deletar anamnese", error, { anamnesisId: id });
            throw error;
        }
    }
    async getLatestAnamnesis(patientId) {
        logger.debug("Buscando última anamnese do paciente", { patientId });
        try {
            const anamnesis = await this.repository.findLatestByPatientId(patientId);
            if (anamnesis) {
                logger.debug("Última anamnese encontrada", { patientId, anamnesisId: anamnesis.id });
            }
            else {
                logger.debug("Nenhuma anamnese encontrada para o paciente", { patientId });
            }
            return anamnesis;
        }
        catch (error) {
            logger.error("Erro ao buscar última anamnese", error, { patientId });
            throw error;
        }
    }
};
PatientAnamnesisService = __decorate([
    injectable(),
    __param(0, inject("IPatientAnamnesisRepository")),
    __param(1, inject("IPatientActivityService")),
    __metadata("design:paramtypes", [Object, Object])
], PatientAnamnesisService);
export { PatientAnamnesisService };
//# sourceMappingURL=PatientAnamnesisService.js.map