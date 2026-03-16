import { Router } from "express";
import { dashboardController } from "./controllers/DashboardController.js";
import { JwtAuthService } from "../../infrastructure/auth/JwtAuthService.js";
const dashboardRoutes = Router();
// Aplica middleware de autenticação em todas as rotas
dashboardRoutes.use(JwtAuthService.authenticateToken);
/**
 * @swagger
 * components:
 *   schemas:
 *     DashboardData:
 *       type: object
 *       properties:
 *         weeklyAppointments:
 *           type: integer
 *           description: Número de atendimentos da semana
 *         monthlyIncome:
 *           type: number
 *           description: Consolidado de entradas de pagamentos no mês atual
 *         activePayments:
 *           type: integer
 *           description: Quantidade de pagamentos ativos
 *         todaysAppointments:
 *           type: array
 *           description: Agendamentos de hoje
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *               time:
 *                 type: string
 *               patientId:
 *                 type: string
 *               description:
 *                 type: string
 *         nextAppointment:
 *           type: object
 *           nullable: true
 *           description: Próximo atendimento
 *           properties:
 *             id:
 *               type: string
 *             date:
 *               type: string
 *               format: date-time
 *             time:
 *               type: string
 *             patientId:
 *               type: string
 *             description:
 *               type: string
 *       example:
 *         weeklyAppointments: 5
 *         monthlyIncome: 2500.50
 *         activePayments: 12
 *         todaysAppointments:
 *           - id: "60d5ecb74b24c72b8c8b4567"
 *             date: "2024-03-15T00:00:00.000Z"
 *             time: "14:30"
 *             patientId: "60d5ecb74b24c72b8c8b4568"
 *             description: "Sessão de fisioterapia"
 *         nextAppointment:
 *           id: "60d5ecb74b24c72b8c8b4569"
 *           date: "2024-03-16T00:00:00.000Z"
 *           time: "09:00"
 *           patientId: "60d5ecb74b24c72b8c8b4570"
 *           description: "Avaliação inicial"
 */
dashboardRoutes.get("/", (req, res) => dashboardController.getDashboard(req, res));
export default dashboardRoutes;
//# sourceMappingURL=routes.js.map