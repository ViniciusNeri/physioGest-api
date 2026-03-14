import type { Request, Response } from "express";
export declare class AgendaController {
    private service;
    private logger;
    constructor();
    /**
     * @swagger
     * /agendas:
     *   get:
     *     summary: Lista todas as agendas
     *     tags: [Agendas]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Lista de agendas
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Agenda'
     *       500:
     *         description: Erro interno do servidor
     */
    getAll(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * @swagger
     * /agendas/user/{userId}:
     *   get:
     *     summary: Lista agendas por usuário
     *     tags: [Agendas]
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
     *         description: Lista de agendas do usuário
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Agenda'
     *       500:
     *         description: Erro interno do servidor
     */
    getByUserId(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * @swagger
     * /agendas/{id}:
     *   get:
     *     summary: Busca uma agenda por ID
     *     tags: [Agendas]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: ID da agenda
     *     responses:
     *       200:
     *         description: Agenda encontrada
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Agenda'
     *       404:
     *         description: Agenda não encontrada
     *       500:
     *         description: Erro interno do servidor
     */
    getById(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * @swagger
     * /agendas:
     *   post:
     *     summary: Cria uma nova agenda
     *     tags: [Agendas]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - date
     *               - time
     *               - patientId
     *               - description
     *               - userId
     *             properties:
     *               date:
     *                 type: string
     *                 format: date
     *               time:
     *                 type: string
     *               patientId:
     *                 type: string
     *               description:
     *                 type: string
     *               userId:
     *                 type: string
     *     responses:
     *       201:
     *         description: Agenda criada
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Agenda'
     *       400:
     *         description: Dados inválidos
     *       500:
     *         description: Erro interno do servidor
     */
    create(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * @swagger
     * /agendas/{id}:
     *   put:
     *     summary: Atualiza uma agenda
     *     tags: [Agendas]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: ID da agenda
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               date:
     *                 type: string
     *                 format: date
     *               time:
     *                 type: string
     *               patientId:
     *                 type: string
     *               description:
     *                 type: string
     *               userId:
     *                 type: string
     *     responses:
     *       200:
     *         description: Agenda atualizada
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Agenda'
     *       404:
     *         description: Agenda não encontrada
     *       500:
     *         description: Erro interno do servidor
     */
    update(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * @swagger
     * /agendas/{id}:
     *   delete:
     *     summary: Deleta uma agenda
     *     tags: [Agendas]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: ID da agenda
     *     responses:
     *       200:
     *         description: Agenda deletada
     *       404:
     *         description: Agenda não encontrada
     *       500:
     *         description: Erro interno do servidor
     */
    delete(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
export declare const agendaController: AgendaController;
//# sourceMappingURL=AgendaController.d.ts.map