import { injectable, inject } from "tsyringe";
import type { IPatientAttachmentRepository } from "../../domain/interfaces/IPatientSubdomainRepositories.js";
import type { IPatientAttachmentService } from "../../domain/services/IPatientSubdomainServices.js";
import type { PatientAttachment } from "../../domain/entities/PatientSubdomains.js";
import logger from "../../infrastructure/logging/Logger.js";
import { SupabaseStorageProvider } from "../../infrastructure/external/SupabaseStorageProvider.js";

@injectable()
export class PatientAttachmentService implements IPatientAttachmentService {
  constructor(
    @inject("IPatientAttachmentRepository")
    private repository: IPatientAttachmentRepository,
    @inject(SupabaseStorageProvider)
    private storageProvider: SupabaseStorageProvider
  ) {}

  async getPatientAttachments(patientId: string): Promise<PatientAttachment[]> {
    logger.debug("Buscando anexos do paciente", { patientId });

    try {
      const attachments = await this.repository.findByPatientId(patientId);
      logger.debug("Anexos do paciente encontrados", { patientId, count: attachments.length });
      return attachments;
    } catch (error) {
      logger.error("Erro ao buscar anexos do paciente", error, { patientId });
      throw error;
    }
  }

  async getAttachmentById(id: string): Promise<PatientAttachment | null> {
    logger.debug("Buscando anexo por ID", { attachmentId: id });

    try {
      const attachment = await this.repository.findById(id);
      if (attachment) {
        logger.debug("Anexo encontrado", { attachmentId: id, patientId: attachment.patientId });
      } else {
        logger.warn("Anexo não encontrado", { attachmentId: id });
      }
      return attachment;
    } catch (error) {
      logger.error("Erro ao buscar anexo por ID", error, { attachmentId: id });
      throw error;
    }
  }

  async createAttachment(attachment: any): Promise<PatientAttachment> {
    logger.debug("Criando novo anexo", { patientId: attachment.patientId, fileName: attachment.fileName });

    try {
      // Normalização: De-para dos campos que podem vir do Flutter/Legacy
      const normalized: any = {
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

      const newAttachment = await this.repository.create(normalized as PatientAttachment);
      logger.info("Anexo criado com sucesso", {
        attachmentId: newAttachment.id,
        patientId: attachment.patientId,
        fileName: attachment.fileName
      });
      return newAttachment;
    } catch (error) {
      logger.error("Erro ao criar anexo", error, { patientId: attachment.patientId });
      throw error;
    }
  }

  /**
   * Realiza o upload completo: Cria record pendente -> Upload -> Atualiza record
   */
  async uploadAndCreateAttachment(
    patientId: string, 
    userId: string, 
    file: { buffer: Buffer, originalname: string, mimetype: string, size: number },
    category?: string,
    description?: string
  ): Promise<PatientAttachment> {
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
      const publicUrl = await this.storageProvider.uploadFile(
        patientId,
        fileName,
        file.buffer,
        file.mimetype
      );

      // 3. Atualiza registro com URL final
      const updated = await this.repository.update(pendingAttachment.id!, {
        path: publicUrl,
        status: 'uploaded'
      });

      return updated!;
    } catch (error: any) {
      logger.error("Falha no processo de upload de anexo", error, { attachmentId: pendingAttachment.id });
      await this.repository.update(pendingAttachment.id!, { status: 'failed' });
      throw error;
    }
  }

  async updateAttachment(id: string, attachment: Partial<PatientAttachment>): Promise<PatientAttachment | null> {
    logger.debug("Atualizando anexo", { attachmentId: id });

    try {
      const updatedAttachment = await this.repository.update(id, attachment);
      if (updatedAttachment) {
        logger.info("Anexo atualizado com sucesso", { attachmentId: id });
      } else {
        logger.warn("Anexo não encontrado para atualização", { attachmentId: id });
      }
      return updatedAttachment;
    } catch (error) {
      logger.error("Erro ao atualizar anexo", error, { attachmentId: id });
      throw error;
    }
  }

  async deleteAttachment(id: string): Promise<boolean> {
    logger.debug("Deletando anexo", { attachmentId: id });

    try {
      const deleted = await this.repository.delete(id);
      if (deleted) {
        logger.info("Anexo deletado com sucesso", { attachmentId: id });
      } else {
        logger.warn("Anexo não encontrado para deleção", { attachmentId: id });
      }
      return deleted;
    } catch (error) {
      logger.error("Erro ao deletar anexo", error, { attachmentId: id });
      throw error;
    }
  }

  async getAttachmentsByCategory(patientId: string, category: string): Promise<PatientAttachment[]> {
    logger.debug("Buscando anexos por categoria", { patientId, category });

    try {
      const attachments = await this.repository.findByCategory(patientId, category);
      logger.debug("Anexos da categoria encontrados", { patientId, category, count: attachments.length });
      return attachments;
    } catch (error) {
      logger.error("Erro ao buscar anexos por categoria", error, { patientId, category });
      throw error;
    }
  }
}