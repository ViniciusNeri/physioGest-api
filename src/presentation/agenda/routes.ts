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
 *         - date
 *         - time
 *         - patientId
 *         - description
 *         - userId
 *       properties:
 *         id:
 *           type: string
 *           description: ID único da agenda
 *         date:
 *           type: string
 *           format: date
 *           description: Data da agenda
 *         time:
 *           type: string
 *           description: Horário da agenda
 *         patientId:
 *           type: string
 *           description: ID do paciente
 *         description:
 *           type: string
 *           description: Descrição da agenda
 *         userId:
 *           type: string
 *           description: ID do usuário que criou
 *       example:
 *         id: 60d5ecb74b24c72b8c8b4567
 *         date: 2023-12-25
 *         time: "14:30"
 *         patientId: 60d5ecb74b24c72b8c8b4568
 *         description: Consulta fisioterapêutica
 *         userId: 60d5ecb74b24c72b8c8b4569
 */

agendaRoutes.get("/", (req, res) => agendaController.getAll(req, res));
agendaRoutes.get("/user/:userId", (req, res) => agendaController.getByUserId(req, res));
agendaRoutes.get("/:id", (req, res) => agendaController.getById(req, res));
agendaRoutes.post("/", (req, res) => agendaController.create(req, res));
agendaRoutes.put("/:id", (req, res) => agendaController.update(req, res));
agendaRoutes.delete("/:id", (req, res) => agendaController.delete(req, res));

export default agendaRoutes;