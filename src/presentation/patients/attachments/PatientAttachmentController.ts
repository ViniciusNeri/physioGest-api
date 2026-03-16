import type { Request, Response } from "express";
import { container } from "tsyringe";
import type { IPatientAttachmentService } from "../../../domain/services/IPatientSubdomainServices.js";
import type { ILogger } from "../../../infrastructure/logging/Logger.js";

export class PatientAttachmentController {
  private service: IPatientAttachmentService;
  private logger: ILogger;

  constructor() {
    this.service = container.resolve<IPatientAttachmentService>("IPatientAttachmentService");
    this.logger = container.resolve<ILogger>("Logger");
  }

  /**
   * @swagger
   * /patients/{patientId}/attachments:
   *   get:
   *     summary: Lista anexos do paciente
   *     tags: [Patient Attachments]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: patientId
   *         required: true
   *         schema:
   *           type: string
   *         description: ID do paciente
   *     responses:
   *       200:
   *         description: Lista de anexos do paciente
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/PatientAttachment'
   *       500:
   *         description: Erro interno do servidor
   */
  getPatientAttachments = async (req: Request, res: Response) => {
    try {
      const { patientId } = req.params;
      if (!patientId) {
        return res.status(400).json({ message: "ID do paciente é obrigatório" });
      }
      this.logger.info("Listando anexos do paciente", { patientId });
      const attachments = await this.service.getPatientAttachments(patientId as string);
      return res.status(200).json(attachments);
    } catch (error: any) {
      this.logger.error("Erro ao listar anexos do paciente", error, { patientId: req.params.patientId });
      return res.status(500).json({ message: error.message });
    }
  }

  /**
   * @swagger
   * /patients/{patientId}/attachments/category/{category}:
   *   get:
   *     summary: Lista anexos por categoria
   *     tags: [Patient Attachments]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: patientId
   *         required: true
   *         schema:
   *           type: string
   *         description: ID do paciente
   *       - in: path
   *         name: category
   *         required: true
   *         schema:
   *           type: string
   *         description: Categoria do anexo
   *     responses:
   *       200:
   *         description: Lista de anexos da categoria
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/PatientAttachment'
   *       500:
   *         description: Erro interno do servidor
   */
  getAttachmentsByCategory = async (req: Request, res: Response) => {
    try {
      const { patientId, category } = req.params;
      if (!patientId || !category) {
        return res.status(400).json({ message: "ID do paciente e categoria são obrigatórios" });
      }
      this.logger.info("Listando anexos por categoria", { patientId, category });
      const attachments = await this.service.getAttachmentsByCategory(patientId as string, category as string);
      return res.status(200).json(attachments);
    } catch (error: any) {
      this.logger.error("Erro ao listar anexos por categoria", error, { patientId: req.params.patientId, category: req.params.category });
      return res.status(500).json({ message: error.message });
    }
  }

  /**
   * @swagger
   * /patients/{patientId}/attachments/{id}:
   *   get:
   *     summary: Busca anexo específico
   *     tags: [Patient Attachments]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: patientId
   *         required: true
   *         schema:
   *           type: string
   *         description: ID do paciente
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: ID do anexo
   *     responses:
   *       200:
   *         description: Anexo encontrado
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/PatientAttachment'
   *       404:
   *         description: Anexo não encontrado
   *       500:
   *         description: Erro interno do servidor
   */
  getAttachmentById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: "ID do anexo é obrigatório" });
      }
      this.logger.info("Buscando anexo por ID", { attachmentId: id });
      const attachment = await this.service.getAttachmentById(id as string);
      if (!attachment) {
        return res.status(404).json({ message: "Anexo não encontrado" });
      }
      return res.status(200).json(attachment);
    } catch (error: any) {
      this.logger.error("Erro ao buscar anexo", error, { attachmentId: req.params.id });
      return res.status(500).json({ message: error.message });
    }
  }

  /**
   * @swagger
   * /patients/{patientId}/attachments:
   *   post:
   *     summary: Cria novo anexo
   *     tags: [Patient Attachments]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: patientId
   *         required: true
   *         schema:
   *           type: string
   *         description: ID do paciente
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreatePatientAttachment'
   *     responses:
   *       201:
   *         description: Anexo criado com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/PatientAttachment'
   *       400:
   *         description: Dados inválidos
   *       500:
   *         description: Erro interno do servidor
   */
  createAttachment = async (req: Request, res: Response) => {
    try {
      const { patientId } = req.params;
      if (!patientId) {
        return res.status(400).json({ message: "ID do paciente é obrigatório" });
      }
      const attachmentData = { ...req.body, patientId: patientId as string, userId: (req as any).user?.id };
      this.logger.info("Criando anexo", { patientId, fileName: attachmentData.fileName });
      const attachment = await this.service.createAttachment(attachmentData);
      return res.status(201).json(attachment);
    } catch (error: any) {
      this.logger.error("Erro ao criar anexo", error, { patientId: req.params.patientId });
      return res.status(500).json({ message: error.message });
    }
  }

  /**
   * @swagger
   * /patients/{patientId}/attachments/{id}:
   *   put:
   *     summary: Atualiza anexo
   *     tags: [Patient Attachments]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: patientId
   *         required: true
   *         schema:
   *           type: string
   *         description: ID do paciente
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: ID do anexo
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UpdatePatientAttachment'
   *     responses:
   *       200:
   *         description: Anexo atualizado com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/PatientAttachment'
   *       404:
   *         description: Anexo não encontrado
   *       500:
   *         description: Erro interno do servidor
   */
  updateAttachment = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: "ID do anexo é obrigatório" });
      }
      this.logger.info("Atualizando anexo", { attachmentId: id });
      const attachment = await this.service.updateAttachment(id as string, req.body);
      if (!attachment) {
        return res.status(404).json({ message: "Anexo não encontrado" });
      }
      return res.status(200).json(attachment);
    } catch (error: any) {
      this.logger.error("Erro ao atualizar anexo", error, { attachmentId: req.params.id });
      return res.status(500).json({ message: error.message });
    }
  }

  /**
   * @swagger
   * /patients/{patientId}/attachments/{id}:
   *   delete:
   *     summary: Deleta anexo
   *     tags: [Patient Attachments]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: patientId
   *         required: true
   *         schema:
   *           type: string
   *         description: ID do paciente
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: ID do anexo
   *     responses:
   *       204:
   *         description: Anexo deletado com sucesso
   *       404:
   *         description: Anexo não encontrado
   *       500:
   *         description: Erro interno do servidor
   */
  deleteAttachment = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: "ID do anexo é obrigatório" });
      }
      this.logger.info("Deletando anexo", { attachmentId: id });
      const deleted = await this.service.deleteAttachment(id as string);
      if (!deleted) {
        return res.status(404).json({ message: "Anexo não encontrado" });
      }
      return res.status(204).send();
    } catch (error: any) {
      this.logger.error("Erro ao deletar anexo", error, { attachmentId: req.params.id });
      return res.status(500).json({ message: error.message });
    }
  }
}