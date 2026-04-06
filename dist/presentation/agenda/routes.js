import { Router } from "express";
import { agendaController } from "./controllers/AgendaController.js";
import { JwtAuthService } from "../../infrastructure/auth/JwtAuthService.js";
const agendaRoutes = Router();
/**
 * Rota pública para agendamento online (paciente)
 * Não requer token JWT, pois usa validação de PIN
 */
agendaRoutes.post("/online", (req, res) => agendaController.createOnline(req, res));
// Middleware de autenticação para as demais rotas (uso profissional)
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
 *         patientId:
 *           type: string
 *         patientName:
 *           type: string
 *         userId:
 *           type: string
 *         startDate:
 *           type: string
 *           format: date-time
 *         endDate:
 *           type: string
 *           format: date-time
 *         status:
 *           type: string
 *           enum: ['scheduled', 'completed', 'cancelled', 'no_show']
 *         description:
 *           type: string
 */
agendaRoutes.get("/", (req, res) => agendaController.getAll(req, res));
agendaRoutes.get("/user/:userId", (req, res) => agendaController.getByUserId(req, res));
agendaRoutes.get("/patient/:patientId", (req, res) => agendaController.getByPatientId(req, res));
agendaRoutes.get("/:id", (req, res) => agendaController.getById(req, res));
agendaRoutes.post("/", (req, res) => agendaController.create(req, res));
agendaRoutes.put("/:id", (req, res) => agendaController.update(req, res));
agendaRoutes.delete("/:id", (req, res) => agendaController.delete(req, res));
// Novas rotas de bloqueio
agendaRoutes.post("/lock", (req, res) => agendaController.createLock(req, res));
agendaRoutes.delete("/lock/:id", (req, res) => agendaController.deleteLock(req, res));
export default agendaRoutes;
//# sourceMappingURL=routes.js.map