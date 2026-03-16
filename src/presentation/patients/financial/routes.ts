import { Router } from "express";
import { PatientFinancialController } from "./PatientFinancialController.js";

const patientFinancialRoutes = Router();
const controller = new PatientFinancialController();

/**
 * @swagger
 * components:
 *   schemas:
 *     PatientFinancial:
 *       type: object
 *       required:
 *         - patientId
 *         - userId
 *         - type
 *         - amount
 *         - date
 *       properties:
 *         id:
 *           type: string
 *           description: ID único do registro financeiro
 *         patientId:
 *           type: string
 *           description: ID do paciente
 *         userId:
 *           type: string
 *           description: ID do usuário
 *         type:
 *           type: string
 *           enum: [income, expense]
 *           description: Tipo do registro (receita ou despesa)
 *         category:
 *           type: string
 *           description: Categoria do registro
 *         description:
 *           type: string
 *           description: Descrição do registro
 *         amount:
 *           type: number
 *           description: Valor do registro
 *         date:
 *           type: string
 *           format: date-time
 *           description: Data do registro
 *         paymentMethod:
 *           type: string
 *           enum: [cash, credit_card, debit_card, bank_transfer, check, pix, other]
 *           description: Método de pagamento
 *         status:
 *           type: string
 *           enum: [pending, paid, cancelled]
 *           description: Status do pagamento
 *         dueDate:
 *           type: string
 *           format: date-time
 *           description: Data de vencimento
 *         paymentDate:
 *           type: string
 *           format: date-time
 *           description: Data do pagamento
 *         notes:
 *           type: string
 *           description: Observações adicionais
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
 *         type: income
 *         category: Consulta
 *         description: Consulta fisioterapêutica - 50 minutos
 *         amount: 120.00
 *         date: 2024-01-15T10:00:00.000Z
 *         paymentMethod: pix
 *         status: paid
 *         dueDate: 2024-01-15T10:00:00.000Z
 *         paymentDate: 2024-01-15T10:30:00.000Z
 *         notes: Pagamento realizado via PIX
 *         createdAt: 2024-01-10T09:00:00.000Z
 *         updatedAt: 2024-01-15T10:30:00.000Z
 *     CreatePatientFinancial:
 *       type: object
 *       required:
 *         - type
 *         - amount
 *         - date
 *       properties:
 *         type:
 *           type: string
 *           enum: [income, expense]
 *           description: Tipo do registro (receita ou despesa)
 *         category:
 *           type: string
 *           description: Categoria do registro
 *         description:
 *           type: string
 *           description: Descrição do registro
 *         amount:
 *           type: number
 *           description: Valor do registro
 *         date:
 *           type: string
 *           format: date-time
 *           description: Data do registro
 *         paymentMethod:
 *           type: string
 *           enum: [cash, credit_card, debit_card, bank_transfer, check, pix, other]
 *           description: Método de pagamento
 *         status:
 *           type: string
 *           enum: [pending, paid, cancelled]
 *           description: Status do pagamento
 *         dueDate:
 *           type: string
 *           format: date-time
 *           description: Data de vencimento
 *         paymentDate:
 *           type: string
 *           format: date-time
 *           description: Data do pagamento
 *         notes:
 *           type: string
 *           description: Observações adicionais
 *       example:
 *         type: income
 *         category: Consulta
 *         description: Consulta fisioterapêutica - 50 minutos
 *         amount: 120.00
 *         date: 2024-01-15T10:00:00.000Z
 *         paymentMethod: pix
 *         status: paid
 *         dueDate: 2024-01-15T10:00:00.000Z
 *         paymentDate: 2024-01-15T10:30:00.000Z
 *         notes: Pagamento realizado via PIX
 *     UpdatePatientFinancial:
 *       type: object
 *       properties:
 *         type:
 *           type: string
 *           enum: [income, expense]
 *           description: Tipo do registro (receita ou despesa)
 *         category:
 *           type: string
 *           description: Categoria do registro
 *         description:
 *           type: string
 *           description: Descrição do registro
 *         amount:
 *           type: number
 *           description: Valor do registro
 *         date:
 *           type: string
 *           format: date-time
 *           description: Data do registro
 *         paymentMethod:
 *           type: string
 *           enum: [cash, credit_card, debit_card, bank_transfer, check, pix, other]
 *           description: Método de pagamento
 *         status:
 *           type: string
 *           enum: [pending, paid, cancelled]
 *           description: Status do pagamento
 *         dueDate:
 *           type: string
 *           format: date-time
 *           description: Data de vencimento
 *         paymentDate:
 *           type: string
 *           format: date-time
 *           description: Data do pagamento
 *         notes:
 *           type: string
 *           description: Observações adicionais
 *       example:
 *         status: paid
 *         paymentDate: 2024-01-15T10:30:00.000Z
 *         notes: Pagamento confirmado
 */

patientFinancialRoutes.get("/:patientId/financial", controller.getPatientFinancial.bind(controller));
patientFinancialRoutes.get("/:patientId/financial/:id", controller.getFinancialById.bind(controller));
patientFinancialRoutes.get("/:patientId/financial/balance", controller.getPatientBalance.bind(controller));
patientFinancialRoutes.post("/:patientId/financial", controller.createFinancial.bind(controller));
patientFinancialRoutes.put("/:patientId/financial/:id", controller.updateFinancial.bind(controller));
patientFinancialRoutes.delete("/:patientId/financial/:id", controller.deleteFinancial.bind(controller));

export default patientFinancialRoutes;