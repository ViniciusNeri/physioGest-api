import { container } from "tsyringe";
export class AgendaController {
    service;
    logger;
    constructor() {
        this.service = container.resolve("IAgendaService");
        this.logger = container.resolve("Logger");
    }
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
    getAll = async (req, res) => {
        try {
            this.logger.info("Listando todas as agendas");
            const agendas = await this.service.getAllAgendas();
            return res.status(200).json(agendas);
        }
        catch (error) {
            this.logger.error("Erro ao listar agendas", error);
            return res.status(500).json({ message: error.message });
        }
    };
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
    getByUserId = async (req, res) => {
        try {
            const { userId } = req.params;
            if (!userId) {
                return res.status(400).json({ message: "userId é obrigatório" });
            }
            this.logger.info(`Listando agendas do usuário: ${userId}`);
            const agendas = await this.service.getAgendasByUserId(userId);
            return res.status(200).json(agendas);
        }
        catch (error) {
            this.logger.error("Erro ao listar agendas do usuário", error);
            return res.status(500).json({ message: error.message });
        }
    };
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
    getById = async (req, res) => {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ message: "ID é obrigatório" });
            }
            this.logger.info(`Buscando agenda por ID: ${id}`);
            const agenda = await this.service.getAgendaById(id);
            if (!agenda) {
                return res.status(404).json({ message: "Agenda não encontrada" });
            }
            return res.status(200).json(agenda);
        }
        catch (error) {
            this.logger.error("Erro ao buscar agenda", error);
            return res.status(500).json({ message: error.message });
        }
    };
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
    create = async (req, res) => {
        try {
            const agendaData = req.body;
            this.logger.info(`Criando agenda para usuário: ${agendaData.userId}`);
            const agenda = await this.service.createAgenda(agendaData);
            return res.status(201).json(agenda);
        }
        catch (error) {
            this.logger.error("Erro ao criar agenda", error);
            return res.status(400).json({ message: error.message });
        }
    };
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
    update = async (req, res) => {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ message: "ID é obrigatório" });
            }
            const updates = req.body;
            this.logger.info(`Atualizando agenda: ${id}`);
            const agenda = await this.service.updateAgenda(id, updates);
            if (!agenda) {
                return res.status(404).json({ message: "Agenda não encontrada" });
            }
            return res.status(200).json(agenda);
        }
        catch (error) {
            this.logger.error("Erro ao atualizar agenda", error);
            return res.status(500).json({ message: error.message });
        }
    };
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
    delete = async (req, res) => {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ message: "ID é obrigatório" });
            }
            this.logger.info(`Deletando agenda: ${id}`);
            const deleted = await this.service.deleteAgenda(id);
            if (!deleted) {
                return res.status(404).json({ message: "Agenda não encontrada" });
            }
            return res.status(200).json({ message: "Agenda deletada com sucesso" });
        }
        catch (error) {
            this.logger.error("Erro ao deletar agenda", error);
            return res.status(500).json({ message: error.message });
        }
    };
}
export const agendaController = new AgendaController();
//# sourceMappingURL=AgendaController.js.map