import { Router } from "express";
import { PaymentMethodController } from "./PaymentMethodController.js";
import { JwtAuthService } from "../../infrastructure/auth/JwtAuthService.js";

const routes = Router();
const controller = new PaymentMethodController();
routes.use(JwtAuthService.authenticateToken);

/**
 * @swagger
 * components:
 *   schemas:
 *     PaymentMethod:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         userId:
 *           type: string
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         active:
 *           type: boolean
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         createdAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /payment-methods:
 *   get:
 *     summary: Listar todas as formas de pagamento
 *     tags: [Payment Methods]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de formas de pagamento
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PaymentMethod'
 *   post:
 *     summary: Criar nova forma de pagamento
 *     tags: [Payment Methods]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PaymentMethod'
 *     responses:
 *       201:
 *         description: Forma de pagamento criada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaymentMethod'
 */

/**
 * @swagger
 * /payment-methods/{id}:
 *   get:
 *     summary: Buscar forma de pagamento por ID
 *     tags: [Payment Methods]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Forma de pagamento encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaymentMethod'
 *       404:
 *         description: Forma de pagamento não encontrada
 *   put:
 *     summary: Atualizar forma de pagamento por ID
 *     tags: [Payment Methods]
 *     security:
 *       - bearerAuth: []
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
 *             $ref: '#/components/schemas/PaymentMethod'
 *     responses:
 *       200:
 *         description: Forma de pagamento atualizada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaymentMethod'
 *       404:
 *         description: Forma de pagamento não encontrada
 *   delete:
 *     summary: Deletar forma de pagamento por ID
 *     tags: [Payment Methods]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Forma de pagamento deletada
 *       404:
 *         description: Forma de pagamento não encontrada
 */

/**
 * @swagger
 * /payment-methods/user/{userId}:
 *   get:
 *     summary: Buscar formas de pagamento por ID de usuário
 *     tags: [Payment Methods]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Formas de pagamento encontradas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PaymentMethod'
 */

routes.get("/", (req, res) => {
  console.log("[DEBUG] Route: GET /");
  return controller.getAllPaymentMethods(req, res);
});
routes.get("/user/:userId", (req, res) => {
  console.log(`[DEBUG] Route: GET /user/${req.params.userId}`);
  return controller.getPaymentMethodsByUser(req, res);
});
routes.get("/:id", (req, res) => {
  console.log(`[DEBUG] Route: GET /${req.params.id}`);
  return controller.getPaymentMethodById(req, res);
});
routes.post("/", (req, res) => controller.createPaymentMethod(req, res));
routes.put("/:id", (req, res) => controller.updatePaymentMethod(req, res));
routes.delete("/:id", (req, res) => controller.deletePaymentMethod(req, res));

export default routes;
