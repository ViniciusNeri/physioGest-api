import { Router } from "express";
import { agendaController } from "./controllers/AgendaController.js";
import { JwtAuthService } from "../../infrastructure/auth/JwtAuthService.js";
const agendaRoutes = Router();
// Aplica middleware de autenticação em todas as rotas
agendaRoutes.use(JwtAuthService.authenticateToken);
/**
 * @swagger
 * components:
 *   schemas:
 *     Agenda:
 *       type: object
 *       required:
 *         - patientId
 *         - userId
 *         - startDate
 *         - endDate
 *       properties:
 *         id:
 *           type: string
 *           description: ID único da agenda
 *         patientId:
 *           type: string
 *           description: ID do paciente
 *         patientName:
 *           type: string
 *           description: Nome completo do paciente
 *         userId:
 *           type: string
 *           description: ID do usuário que criou o agendamento
 *         startDate:
 *           type: string
 *           format: date-time
 *           description: Data e hora de início
 *         endDate:
 *           type: string
 *           format: date-time
 *           description: Data e hora de fim
 *         categoryId:
 *           type: string
 *           description: Categoria da sessão (opcional)
 *         status:
 *           type: string
 *           enum: ['scheduled', 'completed', 'cancelled', 'no_show']
 *           description: Status do agendamento
 *         description:
 *           type: string
 *           description: Descrição do atendimento (opcional)
 *         notes:
 *           type: string
 *           description: Observações após o atendimento (opcional)
 *       example:
 *         id: 60d5ecb74b24c72b8c8b4567
 *         patientId: 60d5ecb74b24c72b8c8b4568
 *         userId: 60d5ecb74b24c72b8c8b4569
 *         startDate: "2026-04-04T10:00:00-03:00"
 *         endDate: "2026-04-04T11:00:00-03:00"
 *         status: "scheduled"
 *         description: Consulta fisioterapêutica
 */
agendaRoutes.get("/", (req, res) => agendaController.getAll(req, res));
agendaRoutes.get("/user/:userId", (req, res) => agendaController.getByUserId(req, res));
agendaRoutes.get("/patient/:patientId", (req, res) => agendaController.getByPatientId(req, res));
agendaRoutes.get("/:id", (req, res) => agendaController.getById(req, res));
agendaRoutes.post("/", (req, res) => agendaController.create(req, res));
agendaRoutes.put("/:id", (req, res) => agendaController.update(req, res));
agendaRoutes.delete("/:id", (req, res) => agendaController.delete(req, res));
export default agendaRoutes;
//# sourceMappingURL=routes.js.map