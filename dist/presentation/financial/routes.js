import { Router } from "express";
import { financialController } from "./controllers/FinancialController.js";
import { JwtAuthService } from "../../infrastructure/auth/JwtAuthService.js";
const financialRoutes = Router();
// Aplica middleware de autenticação em todas as rotas
financialRoutes.use(JwtAuthService.authenticateToken);
/**
 * @swagger
 * components:
 *   schemas:
 *     Financial:
 *       type: object
 *       required:
 *         - type
 *         - amount
 *         - date
 *         - description
 *         - userId
 *       properties:
 *         id:
 *           type: string
 *           description: ID único do registro financeiro
 *         type:
 *           type: string
 *           enum: [income, expense]
 *           description: Tipo do registro (receita ou despesa)
 *         amount:
 *           type: number
 *           description: Valor do registro
 *         date:
 *           type: string
 *           format: date
 *           description: Data do registro
 *         description:
 *           type: string
 *           description: Descrição do registro
 *         userId:
 *           type: string
 *           description: ID do usuário que criou
 *         patientId:
 *           type: string
 *           description: ID do paciente (opcional)
 *       example:
 *         id: 60d5ecb74b24c72b8c8b4567
 *         type: income
 *         amount: 150.00
 *         date: 2023-12-25
 *         description: Pagamento de consulta
 *         userId: 60d5ecb74b24c72b8c8b4569
 *         patientId: 60d5ecb74b24c72b8c8b4570
 */
financialRoutes.get("/", (req, res) => financialController.getAll(req, res));
financialRoutes.get("/consolidated", (req, res) => financialController.getConsolidated(req, res));
financialRoutes.get("/user/:userId", (req, res) => financialController.getByUserId(req, res));
financialRoutes.get("/patient/:patientId", (req, res) => financialController.getByPatientId(req, res));
financialRoutes.get("/:id", (req, res) => financialController.getById(req, res));
financialRoutes.post("/", (req, res) => financialController.create(req, res));
financialRoutes.put("/:id", (req, res) => financialController.update(req, res));
financialRoutes.delete("/:id", (req, res) => financialController.delete(req, res));
export default financialRoutes;
//# sourceMappingURL=routes.js.map