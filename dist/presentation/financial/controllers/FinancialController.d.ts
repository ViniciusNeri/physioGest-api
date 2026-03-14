import type { Request, Response } from "express";
export declare class FinancialController {
    private service;
    private logger;
    constructor();
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
    getAll(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
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
    getByUserId(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
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
    getById(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
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
     *               amount:
     *                 type: number
     *               date:
     *                 type: string
     *                 format: date
     *               description:
     *                 type: string
     *               userId:
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
    create(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
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
     *               amount:
     *                 type: number
     *               date:
     *                 type: string
     *                 format: date
     *               description:
     *                 type: string
     *               userId:
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
    update(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
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
     *     responses:
     *       200:
     *         description: Registro financeiro deletado
     *       404:
     *         description: Registro financeiro não encontrado
     *       500:
     *         description: Erro interno do servidor
     */
    delete(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
export declare const financialController: FinancialController;
//# sourceMappingURL=FinancialController.d.ts.map