import type { Request, Response } from "express";
export declare class PatientFinancialController {
    private service;
    private logger;
    constructor();
    /**
     * @swagger
     * /patients/{patientId}/financial:
     *   get:
     *     summary: Lista registros financeiros do paciente
     *     tags: [Patient Financial]
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
     *                 $ref: '#/components/schemas/PatientFinancial'
     *       500:
     *         description: Erro interno do servidor
     */
    getPatientFinancial: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    /**
     * @swagger
     * /patients/{patientId}/financial/balance:
     *   get:
     *     summary: Busca saldo do paciente
     *     tags: [Patient Financial]
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
     *         description: Saldo do paciente
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 balance:
     *                   type: number
     *                   description: Saldo atual (receitas - despesas)
     *       500:
     *         description: Erro interno do servidor
     */
    getPatientBalance: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    /**
     * @swagger
     * /patients/{patientId}/financial/pending:
     *   get:
     *     summary: Lista pagamentos pendentes do paciente
     *     tags: [Patient Financial]
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
     *         description: Lista de pagamentos pendentes
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/PatientFinancial'
     *       500:
     *         description: Erro interno do servidor
     */
    getPendingPayments: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    /**
     * @swagger
     * /patients/{patientId}/financial/summary:
     *   get:
     *     summary: Busca o resumo financeiro do paciente
     *     tags: [Patient Financial]
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
     *         description: Resumo financeiro gerado com sucesso
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 outstandingBalance:
     *                   type: number
     *                   description: Saldo devedor (pendente)
     *                 totalSessions:
     *                   type: number
     *                   description: Total de sessões restantes (contratadas - realizadas)
     *                 totalPaidAmount:
     *                   type: number
     *                   description: Total de valor pago
     *                 payments:
     *                   type: array
     *                   items:
     *                     $ref: '#/components/schemas/PatientFinancial'
     *       500:
     *         description: Erro interno do servidor
     */
    getFinancialSummary: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    /**
     * @swagger
     * /patients/{patientId}/financial/{id}:
     *   get:
     *     summary: Busca registro financeiro específico
     *     tags: [Patient Financial]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: patientId
     *         required: true
     *         schema:
     *           type: string
     *         description: ID do paciente
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
     *               $ref: '#/components/schemas/PatientFinancial'
     *       404:
     *         description: Registro não encontrado
     *       500:
     *         description: Erro interno do servidor
     */
    getFinancialById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    /**
     * @swagger
     * /patients/{patientId}/financial:
     *   post:
     *     summary: Cria novo registro financeiro
     *     tags: [Patient Financial]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: patientId
     *         required: true
     *         schema:
     *           type: string
     *         description: ID do paciente
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/CreatePatientFinancial'
     *     responses:
     *       201:
     *         description: Registro financeiro criado com sucesso
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/PatientFinancial'
     *       400:
     *         description: Dados inválidos
     *       500:
     *         description: Erro interno do servidor
     */
    createFinancial: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    /**
     * @swagger
     * /patients/{patientId}/financial/{id}/pay:
     *   patch:
     *     summary: Marca um registro financeiro como pago
     *     tags: [Patient Financial]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: patientId
     *         required: true
     *         schema:
     *           type: string
     *         description: ID do paciente
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: ID do registro financeiro
     *     requestBody:
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               paymentMethod:
     *                 type: string
     *                 enum: [cash, credit_card, debit_card, bank_transfer, check, pix, other]
     *                 description: Método de pagamento opcional
     *     responses:
     *       200:
     *         description: Registro marcado como pago com sucesso
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/PatientFinancial'
     *       404:
     *         description: Registro não encontrado
     *       500:
     *         description: Erro interno do servidor
     */
    payFinancial: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    /**
     * @swagger
     * /patients/{patientId}/financial/{id}:
     *   put:
     *     summary: Atualiza registro financeiro
     *     tags: [Patient Financial]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: patientId
     *         required: true
     *         schema:
     *           type: string
     *         description: ID do paciente
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
     *             $ref: '#/components/schemas/UpdatePatientFinancial'
     *     responses:
     *       200:
     *         description: Registro financeiro atualizado com sucesso
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/PatientFinancial'
     *       404:
     *         description: Registro não encontrado
     *       500:
     *         description: Erro interno do servidor
     */
    updateFinancial: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    /**
     * @swagger
     * /patients/{patientId}/financial/{id}:
     *   delete:
     *     summary: Deleta registro financeiro
     *     tags: [Patient Financial]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: patientId
     *         required: true
     *         schema:
     *           type: string
     *         description: ID do paciente
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: ID do registro financeiro
     *     responses:
     *       204:
     *         description: Registro financeiro deletado com sucesso
     *       404:
     *         description: Registro não encontrado
     *       500:
     *         description: Erro interno do servidor
     */
    deleteFinancial: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=PatientFinancialController.d.ts.map