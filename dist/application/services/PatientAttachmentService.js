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
import { SupabaseStorageProvider } from "../../infrastructure/external/SupabaseStorageProvider.js";
let PatientAttachmentService = class PatientAttachmentService {
    repository;
    storageProvider;
    constructor(repository, storageProvider) {
        this.repository = repository;
        this.storageProvider = storageProvider;
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
            // Normalização: De-para dos campos que podem vir do Flutter/Legacy
            const normalized = {
                ...attachment,
                mimeType: attachment.mimeType || attachment.fileType,
                size: attachment.size || attachment.fileSize,
                path: attachment.path || attachment.filePath,
                status: attachment.status || 'uploaded'
            };
            // Remove os campos antigos para não poluir o objeto/banco
            delete normalized.fileType;
            delete normalized.fileSize;
            delete normalized.filePath;
            const newAttachment = await this.repository.create(normalized);
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
    /**
     * Realiza o upload completo: Cria record pendente -> Upload -> Atualiza record
     */
    async uploadAndCreateAttachment(patientId, userId, file, category, description) {
        const fileName = `${Date.now()}-${file.originalname}`;
        // 1. Cria registro pendente
        const pendingAttachment = await this.repository.create({
            patientId,
            userId,
            fileName,
            originalName: file.originalname,
            mimeType: file.mimetype,
            size: file.size,
            path: 'uploading...',
            category,
            description,
            status: 'pending_upload',
            uploadedAt: new Date().toISOString().substring(0, 19)
        });
        try {
            // 2. Upload para Supabase
            const publicUrl = await this.storageProvider.uploadFile(patientId, fileName, file.buffer, file.mimetype);
            // 3. Atualiza registro com URL final
            const updated = await this.repository.update(pendingAttachment.id, {
                path: publicUrl,
                status: 'uploaded'
            });
            return updated;
        }
        catch (error) {
            logger.error("Falha no processo de upload de anexo", error, { attachmentId: pendingAttachment.id });
            await this.repository.update(pendingAttachment.id, { status: 'failed' });
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
    __param(1, inject(SupabaseStorageProvider)),
    __metadata("design:paramtypes", [Object, SupabaseStorageProvider])
], PatientAttachmentService);
export { PatientAttachmentService };
//# sourceMappingURL=PatientAttachmentService.js.map