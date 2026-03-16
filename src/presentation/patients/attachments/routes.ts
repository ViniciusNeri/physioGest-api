import { Router } from "express";
import { PatientAttachmentController } from "./PatientAttachmentController.js";

const patientAttachmentRoutes = Router();
const controller = new PatientAttachmentController();

/**
 * @swagger
 * components:
 *   schemas:
 *     PatientAttachment:
 *       type: object
 *       required:
 *         - patientId
 *         - userId
 *         - fileName
 *         - fileType
 *         - fileSize
 *       properties:
 *         id:
 *           type: string
 *           description: ID único do anexo
 *         patientId:
 *           type: string
 *           description: ID do paciente
 *         userId:
 *           type: string
 *           description: ID do usuário
 *         fileName:
 *           type: string
 *           description: Nome do arquivo
 *         originalName:
 *           type: string
 *           description: Nome original do arquivo
 *         fileType:
 *           type: string
 *           description: Tipo MIME do arquivo
 *         fileSize:
 *           type: number
 *           description: Tamanho do arquivo em bytes
 *         filePath:
 *           type: string
 *           description: Caminho do arquivo no servidor
 *         category:
 *           type: string
 *           enum: [medical_records, exams, prescriptions, photos, documents, other]
 *           description: Categoria do anexo
 *         description:
 *           type: string
 *           description: Descrição do anexo
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: Tags para organização
 *         uploadedAt:
 *           type: string
 *           format: date-time
 *           description: Data de upload
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Data de criação
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Data de atualização
 *       example:
 *         id: 60d5ecb74b24c72b8c8b4567
 *         patientId: 60d5ecb74b24c72b8c8b4568
 *         userId: 60d5ecb74b24c72b8c8b4569
 *         fileName: exame-sangue-2024-01-15.pdf
 *         originalName: resultado_exame_sangue.pdf
 *         fileType: application/pdf
 *         fileSize: 245760
 *         filePath: /uploads/patients/60d5ecb74b24c72b8c8b4568/exame-sangue-2024-01-15.pdf
 *         category: exams
 *         description: Resultado de exames de sangue
 *         tags: ["exame", "sangue", "2024"]
 *         uploadedAt: 2024-01-15T10:00:00.000Z
 *         createdAt: 2024-01-15T10:00:00.000Z
 *         updatedAt: 2024-01-15T10:00:00.000Z
 *     CreatePatientAttachment:
 *       type: object
 *       required:
 *         - fileName
 *         - fileType
 *         - fileSize
 *       properties:
 *         fileName:
 *           type: string
 *           description: Nome do arquivo
 *         originalName:
 *           type: string
 *           description: Nome original do arquivo
 *         fileType:
 *           type: string
 *           description: Tipo MIME do arquivo
 *         fileSize:
 *           type: number
 *           description: Tamanho do arquivo em bytes
 *         filePath:
 *           type: string
 *           description: Caminho do arquivo no servidor
 *         category:
 *           type: string
 *           enum: [medical_records, exams, prescriptions, photos, documents, other]
 *           description: Categoria do anexo
 *         description:
 *           type: string
 *           description: Descrição do anexo
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: Tags para organização
 *       example:
 *         fileName: exame-sangue-2024-01-15.pdf
 *         originalName: resultado_exame_sangue.pdf
 *         fileType: application/pdf
 *         fileSize: 245760
 *         filePath: /uploads/patients/60d5ecb74b24c72b8c8b4568/exame-sangue-2024-01-15.pdf
 *         category: exams
 *         description: Resultado de exames de sangue
 *         tags: ["exame", "sangue", "2024"]
 *     UpdatePatientAttachment:
 *       type: object
 *       properties:
 *         fileName:
 *           type: string
 *           description: Nome do arquivo
 *         originalName:
 *           type: string
 *           description: Nome original do arquivo
 *         category:
 *           type: string
 *           enum: [medical_records, exams, prescriptions, photos, documents, other]
 *           description: Categoria do anexo
 *         description:
 *           type: string
 *           description: Descrição do anexo
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: Tags para organização
 *       example:
 *         description: Resultado de exames de sangue - Atualizado
 *         tags: ["exame", "sangue", "2024", "atualizado"]
 */

patientAttachmentRoutes.get("/:patientId/attachments", controller.getPatientAttachments.bind(controller));
patientAttachmentRoutes.get("/:patientId/attachments/category/:category", controller.getAttachmentsByCategory.bind(controller));
patientAttachmentRoutes.get("/:patientId/attachments/:id", controller.getAttachmentById.bind(controller));
patientAttachmentRoutes.post("/:patientId/attachments", controller.createAttachment.bind(controller));
patientAttachmentRoutes.put("/:patientId/attachments/:id", controller.updateAttachment.bind(controller));
patientAttachmentRoutes.delete("/:patientId/attachments/:id", controller.deleteAttachment.bind(controller));

export default patientAttachmentRoutes;