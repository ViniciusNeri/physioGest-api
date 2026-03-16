import { container } from "tsyringe";
export class PatientFinancialController {
    service;
    logger;
    constructor() {
        this.service = container.resolve("IPatientFinancialService");
        this.logger = container.resolve("Logger");
    }
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
    getPatientFinancial = async (req, res) => {
        try {
            const { patientId } = req.params;
            if (!patientId) {
                return res.status(400).json({ message: "ID do paciente é obrigatório" });
            }
            this.logger.info("Listando registros financeiros do paciente", { patientId });
            const financial = await this.service.getPatientFinancial(patientId);
            return res.status(200).json(financial);
        }
        catch (error) {
            this.logger.error("Erro ao listar registros financeiros", error, { patientId: req.params.patientId });
            return res.status(500).json({ message: error.message });
        }
    };
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
    getPatientBalance = async (req, res) => {
        try {
            const { patientId } = req.params;
            if (!patientId) {
                return res.status(400).json({ message: "ID do paciente é obrigatório" });
            }
            this.logger.info("Calculando saldo do paciente", { patientId });
            const balance = await this.service.getPatientBalance(patientId);
            return res.status(200).json({ balance });
        }
        catch (error) {
            this.logger.error("Erro ao calcular saldo", error, { patientId: req.params.patientId });
            return res.status(500).json({ message: error.message });
        }
    };
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
    getPendingPayments = async (req, res) => {
        try {
            const { patientId } = req.params;
            if (!patientId) {
                return res.status(400).json({ message: "ID do paciente é obrigatório" });
            }
            this.logger.info("Listando pagamentos pendentes", { patientId });
            const payments = await this.service.getPendingPayments(patientId);
            return res.status(200).json(payments);
        }
        catch (error) {
            this.logger.error("Erro ao listar pagamentos pendentes", error, { patientId: req.params.patientId });
            return res.status(500).json({ message: error.message });
        }
    };
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
    getFinancialById = async (req, res) => {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ message: "ID do registro financeiro é obrigatório" });
            }
            this.logger.info("Buscando registro financeiro por ID", { financialId: id });
            const financial = await this.service.getFinancialById(id);
            if (!financial) {
                return res.status(404).json({ message: "Registro financeiro não encontrado" });
            }
            return res.status(200).json(financial);
        }
        catch (error) {
            this.logger.error("Erro ao buscar registro financeiro", error, { financialId: req.params.id });
            return res.status(500).json({ message: error.message });
        }
    };
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
    createFinancial = async (req, res) => {
        try {
            const { patientId } = req.params;
            const financialData = { ...req.body, patientId, userId: req.user?.id };
            this.logger.info("Criando registro financeiro", { patientId, type: financialData.type, amount: financialData.amount });
            const financial = await this.service.createFinancial(financialData);
            return res.status(201).json(financial);
        }
        catch (error) {
            this.logger.error("Erro ao criar registro financeiro", error, { patientId: req.params.patientId });
            return res.status(500).json({ message: error.message });
        }
    };
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
    updateFinancial = async (req, res) => {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ message: "ID do registro financeiro é obrigatório" });
            }
            this.logger.info("Atualizando registro financeiro", { financialId: id });
            const financial = await this.service.updateFinancial(id, req.body);
            if (!financial) {
                return res.status(404).json({ message: "Registro financeiro não encontrado" });
            }
            return res.status(200).json(financial);
        }
        catch (error) {
            this.logger.error("Erro ao atualizar registro financeiro", error, { financialId: req.params.id });
            return res.status(500).json({ message: error.message });
        }
    };
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
    deleteFinancial = async (req, res) => {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ message: "ID do registro financeiro é obrigatório" });
            }
            this.logger.info("Deletando registro financeiro", { financialId: id });
            const deleted = await this.service.deleteFinancial(id);
            if (!deleted) {
                return res.status(404).json({ message: "Registro financeiro não encontrado" });
            }
            return res.status(204).send();
        }
        catch (error) {
            this.logger.error("Erro ao deletar registro financeiro", error, { financialId: req.params.id });
            return res.status(500).json({ message: error.message });
        }
    };
}
//# sourceMappingURL=PatientFinancialController.js.map