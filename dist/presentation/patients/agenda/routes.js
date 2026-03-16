import { Router } from "express";
import { PatientAgendaController } from "./PatientAgendaController.js";
const patientAgendaRoutes = Router();
const controller = new PatientAgendaController();
/**
 * @swagger
 * components:
 *   schemas:
 *     PatientAgenda:
 *       type: object
 *       required:
 *         - patientId
 *         - userId
 *         - title
 *         - date
 *       properties:
 *         id:
 *           type: string
 *           description: ID único da agenda
 *         patientId:
 *           type: string
 *           description: ID do paciente
 *         userId:
 *           type: string
 *           description: ID do usuário
 *         title:
 *           type: string
 *           description: Título do compromisso
 *         description:
 *           type: string
 *           description: Descrição do compromisso
 *         date:
 *           type: string
 *           format: date-time
 *           description: Data e hora do compromisso
 *         status:
 *           type: string
 *           enum: [scheduled, completed, cancelled]
 *           description: Status do compromisso
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
 *         title: Consulta fisioterapêutica
 *         description: Avaliação inicial
 *         date: 2024-01-15T10:00:00.000Z
 *         status: scheduled
 *         createdAt: 2024-01-10T09:00:00.000Z
 *         updatedAt: 2024-01-10T09:00:00.000Z
 *     CreatePatientAgenda:
 *       type: object
 *       required:
 *         - title
 *         - date
 *       properties:
 *         title:
 *           type: string
 *           description: Título do compromisso
 *         description:
 *           type: string
 *           description: Descrição do compromisso
 *         date:
 *           type: string
 *           format: date-time
 *           description: Data e hora do compromisso
 *         status:
 *           type: string
 *           enum: [scheduled, completed, cancelled]
 *           description: Status do compromisso
 *       example:
 *         title: Consulta fisioterapêutica
 *         description: Avaliação inicial
 *         date: 2024-01-15T10:00:00.000Z
 *         status: scheduled
 *     UpdatePatientAgenda:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           description: Título do compromisso
 *         description:
 *           type: string
 *           description: Descrição do compromisso
 *         date:
 *           type: string
 *           format: date-time
 *           description: Data e hora do compromisso
 *         status:
 *           type: string
 *           enum: [scheduled, completed, cancelled]
 *           description: Status do compromisso
 *       example:
 *         title: Consulta fisioterapêutica - Reavaliação
 *         status: completed
 */
patientAgendaRoutes.get("/:patientId/agenda", controller.getPatientAgenda.bind(controller));
patientAgendaRoutes.get("/:patientId/agenda/:id", controller.getAgendaById.bind(controller));
patientAgendaRoutes.post("/:patientId/agenda", controller.createAgenda.bind(controller));
patientAgendaRoutes.put("/:patientId/agenda/:id", controller.updateAgenda.bind(controller));
patientAgendaRoutes.delete("/:patientId/agenda/:id", controller.deleteAgenda.bind(controller));
export default patientAgendaRoutes;
//# sourceMappingURL=routes.js.map