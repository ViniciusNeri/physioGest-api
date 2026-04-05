import type { Request, Response } from "express";
export declare class FinancialController {
    private service;
    private logger;
    constructor();
    /**
     * @swagger
     * /financials/consolidated:
     *   get:
     *     summary: Retorna um resumo financeiro consolidado por mês e ano
     *     tags: [Financials]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: query
     *         name: userId
     *         required: true
     *         schema:
     *           type: string
     *         description: ID do usuário
     *       - in: query
     *         name: month
     *         required: true
     *         schema:
     *           type: integer
     *           minimum: 1
     *           maximum: 12
     *         description: Mês (1-12)
     *       - in: query
     *         name: year
     *         required: true
     *         schema:
     *           type: integer
     *         description: Ano (ex. 2023)
     *     responses:
     *       200:
     *         description: Resumo financeiro consolidado
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 monthlyTotal:
     *                   type: number
     *                 pendingTotal:
     *                   type: number
     *                 expenses:
     *                   type: number
     *                 variableExpenses:
     *                   type: number
     *                 netProfit:
     *                   type: number
     *                 totalIncome:
     *                   type: number
     *                 totalExpenses:
     *                   type: number
     *                 incomeByMethod:
     *                   type: object
     *                   additionalProperties:
     *                     type: number
     *                 expenseByMethod:
     *                   type: object
     *                   additionalProperties:
     *                     type: number
     *                 expensesByCategory:
     *                   type: object
     *                   additionalProperties:
     *                     type: number
     *                 cashFlow:
     *                   type: array
     *                   items:
     *                     type: object
     *                     properties:
     *                       id:
     *                         type: string
     *                       source:
     *                         type: string
     *                         enum: [clinic, patient]
     *                       date:
     *                         type: string
     *                         format: date-time
     *                       amount:
     *                         type: number
     *                       type:
     *                         type: string
     *                       description:
     *                         type: string
     *                       category:
     *                         type: string
     *                       patientName:
     *                         type: string
     *                       status:
     *                         type: string
     *       400:
     *         description: Dados inválidos
     *       500:
     *         description: Erro interno do servidor
     */
    getConsolidated: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    /**
     * @swagger
     * /financials:
     *   get:
     *     summary: Lista todos os registros financeiros
     *     tags: [Financials]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Lista de registros financeiros
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Financial'
     *       500:
     *         description: Erro interno do servidor
     */
    getAll: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    /**
     * @swagger
     * /financials/user/{userId}:
     *   get:
     *     summary: Lista registros financeiros por usuário
     *     tags: [Financials]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: userId
     *         required: true
     *         schema:
     *           type: string
     *         description: ID do usuário
     *     responses:
     *       200:
     *         description: Lista de registros financeiros do usuário
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Financial'
     *       500:
     *         description: Erro interno do servidor
     */
    getByUserId: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    /**
     * @swagger
     * /financials/patient/{patientId}:
     *   get:
     *     summary: Lista registros financeiros por paciente
     *     tags: [Financials]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: patientId
     *         required: true
     *         schema:
     *           type: string
     *         description: ID do paciente
     *     responses:
     *       200:
     *         description: Lista de registros financeiros do paciente
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Financial'
     *       500:
     *         description: Erro interno do servidor
     */
    getByPatientId: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    /**
     * @swagger
     * /financials/{id}:
     *   get:
     *     summary: Busca um registro financeiro por ID
     *     tags: [Financials]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: ID do registro financeiro
     *     responses:
     *       200:
     *         description: Registro financeiro encontrado
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Financial'
     *       404:
     *         description: Registro financeiro não encontrado
     *       500:
     *         description: Erro interno do servidor
     */
    getById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    /**
     * @swagger
     * /financials:
     *   post:
     *     summary: Cria um novo registro financeiro
     *     tags: [Financials]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - type
     *               - amount
     *               - date
     *               - description
     *               - userId
     *             properties:
     *               type:
     *                 type: string
     *                 enum: [income, expense]
     *               status:
     *                 type: string
     *                 enum: [pending, paid, cancelled, refunded]
     *               amount:
     *                 type: number
     *               date:
     *                 type: string
     *                 format: date
     *               description:
     *                 type: string
     *               category:
     *                 type: string
     *               expenseType:
     *                 type: string
     *                 enum: [fixed, variable]
     *               paymentMethod:
     *                 type: string
     *                 enum: [cash, credit_card, debit_card, pix, bank_transfer, check, other]
     *               userId:
     *                 type: string
     *               patientId:
     *                 type: string
     *     responses:
     *       201:
     *         description: Registro financeiro criado
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Financial'
     *       400:
     *         description: Dados inválidos
     *       500:
     *         description: Erro interno do servidor
     */
    create: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    /**
     * @swagger
     * /financials/{id}:
     *   put:
     *     summary: Atualiza um registro financeiro
     *     tags: [Financials]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: ID do registro financeiro
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               type:
     *                 type: string
     *                 enum: [income, expense]
     *               status:
     *                 type: string
     *                 enum: [pending, paid, cancelled, refunded]
     *               amount:
     *                 type: number
     *               date:
     *                 type: string
     *                 format: date
     *               description:
     *                 type: string
     *               category:
     *                 type: string
     *               expenseType:
     *                 type: string
     *                 enum: [fixed, variable]
     *               paymentMethod:
     *                 type: string
     *                 enum: [cash, credit_card, debit_card, pix, bank_transfer, check, other]
     *               userId:
     *                 type: string
     *               patientId:
     *                 type: string
     *     responses:
     *       200:
     *         description: Registro financeiro atualizado
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Financial'
     *       404:
     *         description: Registro financeiro não encontrado
     *       500:
     *         description: Erro interno do servidor
     */
    update: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    /**
     * @swagger
     * /financials/{id}:
     *   delete:
     *     summary: Deleta um registro financeiro
     *     tags: [Financials]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: ID do registro financeiro
     *       - in: query
     *         name: source
     *         schema:
     *           type: string
     *           enum: [clinic, patient]
     *         description: Origem do registro (clinic ou patient). Caso não informado, assume clinic.
     *     responses:
     *       200:
     *         description: Registro financeiro deletado
     *       404:
     *         description: Registro financeiro não encontrado
     *       500:
     *         description: Erro interno do servidor
     */
    delete: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
}
export declare const financialController: FinancialController;
//# sourceMappingURL=FinancialController.d.ts.map