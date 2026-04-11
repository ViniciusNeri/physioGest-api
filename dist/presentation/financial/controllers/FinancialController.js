import { container } from "tsyringe";
export class FinancialController {
    service;
    logger;
    constructor() {
        this.service = container.resolve("IFinancialService");
        this.logger = container.resolve("Logger");
    }
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
     *                 monthlyHistory:
     *                   type: object
     *                   additionalProperties:
     *                     type: object
     *                     properties:
     *                       income:
     *                         type: number
     *                       expenses:
     *                         type: number
     *       400:
     *         description: Dados inválidos
     *       500:
     *         description: Erro interno do servidor
     */
    getConsolidated = async (req, res) => {
        try {
            const { userId, month, year } = req.query;
            if (!userId || !month || !year) {
                return res.status(400).json({ message: "userId, month e year são obrigatórios" });
            }
            this.logger.info(`Buscando consolidado financeiro: User ${userId}, ${month}/${year}`);
            const consolidated = await this.service.getMonthlyConsolidated(userId, Number(month), Number(year));
            return res.status(200).json(consolidated);
        }
        catch (error) {
            this.logger.error("Erro ao buscar consolidado financeiro", error);
            return res.status(500).json({ message: error.message });
        }
    };
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
    getAll = async (req, res) => {
        try {
            this.logger.info("Listando todos os registros financeiros");
            const financials = await this.service.getAllFinancials();
            return res.status(200).json(financials);
        }
        catch (error) {
            this.logger.error("Erro ao listar registros financeiros", error);
            return res.status(500).json({ message: error.message });
        }
    };
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
    getByUserId = async (req, res) => {
        try {
            const { userId } = req.params;
            if (!userId) {
                return res.status(400).json({ message: "userId é obrigatório" });
            }
            this.logger.info(`Listando registros financeiros do usuário: ${userId}`);
            const financials = await this.service.getFinancialsByUserId(userId);
            return res.status(200).json(financials);
        }
        catch (error) {
            this.logger.error("Erro ao listar registros financeiros do usuário", error);
            return res.status(500).json({ message: error.message });
        }
    };
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
    getByPatientId = async (req, res) => {
        try {
            const { patientId } = req.params;
            if (!patientId) {
                return res.status(400).json({ message: "patientId é obrigatório" });
            }
            this.logger.info(`Listando registros financeiros do paciente: ${patientId}`);
            const financials = await this.service.getFinancialsByPatientId(patientId);
            return res.status(200).json(financials);
        }
        catch (error) {
            this.logger.error("Erro ao listar registros financeiros do paciente", error);
            return res.status(500).json({ message: error.message });
        }
    };
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
    getById = async (req, res) => {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ message: "ID é obrigatório" });
            }
            this.logger.info(`Buscando registro financeiro por ID: ${id}`);
            const financial = await this.service.getFinancialById(id);
            if (!financial) {
                return res.status(404).json({ message: "Registro financeiro não encontrado" });
            }
            return res.status(200).json(financial);
        }
        catch (error) {
            this.logger.error("Erro ao buscar registro financeiro", error);
            return res.status(500).json({ message: error.message });
        }
    };
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
    create = async (req, res) => {
        try {
            const financialData = req.body;
            this.logger.info(`Criando registro financeiro para usuário: ${financialData.userId}`);
            const financial = await this.service.createFinancial(financialData);
            return res.status(201).json(financial);
        }
        catch (error) {
            this.logger.error("Erro ao criar registro financeiro", error);
            return res.status(400).json({ message: error.message });
        }
    };
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
    update = async (req, res) => {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ message: "ID é obrigatório" });
            }
            const updates = req.body;
            this.logger.info(`Atualizando registro financeiro: ${id}`);
            const financial = await this.service.updateFinancial(id, updates);
            if (!financial) {
                return res.status(404).json({ message: "Registro financeiro não encontrado" });
            }
            return res.status(200).json(financial);
        }
        catch (error) {
            this.logger.error("Erro ao atualizar registro financeiro", error);
            return res.status(500).json({ message: error.message });
        }
    };
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
    delete = async (req, res) => {
        try {
            const { id } = req.params;
            const { source } = req.query;
            if (!id) {
                return res.status(400).json({ message: "ID é obrigatório" });
            }
            this.logger.info(`Deletando registro financeiro: ${id} (fonte: ${source || 'clinic'})`);
            const deleted = await this.service.deleteFinancial(id, source);
            if (!deleted) {
                return res.status(404).json({ message: "Registro financeiro não encontrado" });
            }
            return res.status(200).json({ message: "Registro financeiro deletado com sucesso" });
        }
        catch (error) {
            this.logger.error("Erro ao deletar registro financeiro", error);
            return res.status(500).json({ message: error.message });
        }
    };
}
export const financialController = new FinancialController();
//# sourceMappingURL=FinancialController.js.map