import { Router } from "express";
import { SettingController } from "./SettingController.js";
import { JwtAuthService } from "../../infrastructure/auth/JwtAuthService.js";
const routesSettings = Router();
routesSettings.use(JwtAuthService.authenticateToken);
const controller = new SettingController();
/**
 * @swagger
 * components:
 *   schemas:
 *     Setting:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         userId:
 *           type: string
 *         dashboardTheme:
 *           type: string
 *           enum: [light, dark]
 *         showWeeklyAppointments:
 *           type: boolean
 *         showMonthlyIncome:
 *           type: boolean
 *         showActivePayments:
 *           type: boolean
 *         showNextAppointment:
 *           type: boolean
 *         categoryControlMode:
 *           type: string
 *           enum: [none, manual, auto]
 *         defaultCategoryId:
 *           type: string
 *         defaultPaymentMethodId:
 *           type: string
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         createdAt:
 *           type: string
 *           format: date-time
 */
/**
 * @swagger
 * /settings:
 *   get:
 *     summary: Listar todas as configurações
 *     tags: [Settings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de configurações
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Setting'
 *   post:
 *     summary: Criar nova configuração
 *     tags: [Settings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Setting'
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Configuração criada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Setting'
 */
/**
 * @swagger
 * /settings/{id}:
 *   get:
 *     summary: Buscar configuração por ID
 *     tags: [Settings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Configuração encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Setting'
 *       404:
 *         description: Configuração não encontrada
 *   put:
 *     summary: Atualizar configuração por ID
 *     tags: [Settings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Setting'
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Configuração atualizada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Setting'
 *       404:
 *         description: Configuração não encontrada
 *   delete:
 *     summary: Deletar configuração por ID
 *     tags: [Settings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: Configuração deletada
 *       404:
 *         description: Configuração não encontrada
 */
/**
 * @swagger
 * /settings/user/{userId}:
 *   get:
 *     summary: Buscar configuração por ID de usuário
 *     tags: [Settings]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Configuração encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Setting'
 *       404:
 *         description: Configuração não encontrada
 */
routesSettings.get("/", (req, res) => controller.getAllSettings(req, res));
routesSettings.get("/user/:userId", (req, res) => controller.getSettingByUserId(req, res));
routesSettings.get("/:id", (req, res) => controller.getSettingById(req, res));
routesSettings.post("/", (req, res) => controller.createSetting(req, res));
routesSettings.put("/:id", (req, res) => controller.updateSetting(req, res));
routesSettings.delete("/:id", (req, res) => controller.deleteSetting(req, res));
export default routesSettings;
//# sourceMappingURL=routes.js.map