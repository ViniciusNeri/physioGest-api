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
let PatientAttachmentService = class PatientAttachmentService {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async getPatientAttachments(patientId) {
        logger.debug("Buscando anexos do paciente", { patientId });
        try {
            const attachments = await this.repository.findByPatientId(patientId);
            logger.debug("Anexos do paciente encontrados", { patientId, count: attachments.length });
            return attachments;
        }
        catch (error) {
            logger.error("Erro ao buscar anexos do paciente", error, { patientId });
            throw error;
        }
    }
    async getAttachmentById(id) {
        logger.debug("Buscando anexo por ID", { attachmentId: id });
        try {
            const attachment = await this.repository.findById(id);
            if (attachment) {
                logger.debug("Anexo encontrado", { attachmentId: id, patientId: attachment.patientId });
            }
            else {
                logger.warn("Anexo não encontrado", { attachmentId: id });
            }
            return attachment;
        }
        catch (error) {
            logger.error("Erro ao buscar anexo por ID", error, { attachmentId: id });
            throw error;
        }
    }
    async createAttachment(attachment) {
        logger.debug("Criando novo anexo", { patientId: attachment.patientId, fileName: attachment.fileName });
        try {
            const newAttachment = await this.repository.create(attachment);
            logger.info("Anexo criado com sucesso", {
                attachmentId: newAttachment.id,
                patientId: attachment.patientId,
                fileName: attachment.fileName
            });
            return newAttachment;
        }
        catch (error) {
            logger.error("Erro ao criar anexo", error, { patientId: attachment.patientId });
            throw error;
        }
    }
    async updateAttachment(id, attachment) {
        logger.debug("Atualizando anexo", { attachmentId: id });
        try {
            const updatedAttachment = await this.repository.update(id, attachment);
            if (updatedAttachment) {
                logger.info("Anexo atualizado com sucesso", { attachmentId: id });
            }
            else {
                logger.warn("Anexo não encontrado para atualização", { attachmentId: id });
            }
            return updatedAttachment;
        }
        catch (error) {
            logger.error("Erro ao atualizar anexo", error, { attachmentId: id });
            throw error;
        }
    }
    async deleteAttachment(id) {
        logger.debug("Deletando anexo", { attachmentId: id });
        try {
            const deleted = await this.repository.delete(id);
            if (deleted) {
                logger.info("Anexo deletado com sucesso", { attachmentId: id });
            }
            else {
                logger.warn("Anexo não encontrado para deleção", { attachmentId: id });
            }
            return deleted;
        }
        catch (error) {
            logger.error("Erro ao deletar anexo", error, { attachmentId: id });
            throw error;
        }
    }
    async getAttachmentsByCategory(patientId, category) {
        logger.debug("Buscando anexos por categoria", { patientId, category });
        try {
            const attachments = await this.repository.findByCategory(patientId, category);
            logger.debug("Anexos da categoria encontrados", { patientId, category, count: attachments.length });
            return attachments;
        }
        catch (error) {
            logger.error("Erro ao buscar anexos por categoria", error, { patientId, category });
            throw error;
        }
    }
};
PatientAttachmentService = __decorate([
    injectable(),
    __param(0, inject("IPatientAttachmentRepository")),
    __metadata("design:paramtypes", [Object])
], PatientAttachmentService);
export { PatientAttachmentService };
//# sourceMappingURL=PatientAttachmentService.js.map