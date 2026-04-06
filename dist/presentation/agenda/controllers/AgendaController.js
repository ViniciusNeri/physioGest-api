import { container } from "tsyringe";
import { convertAgendaDates, convertAgendaArrayDates } from "../../../utils/dateUtils.js";
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
     */
    getAll = async (req, res) => {
        try {
            const agendas = await this.service.getAllAgendas();
            return res.status(200).json(convertAgendaArrayDates(agendas));
        }
        catch (error) {
            return res.status(500).json({ message: error.message });
        }
    };
    /**
     * @swagger
     * /agendas/user/{userId}:
     *   get:
     *     summary: Lista agendas e bloqueios por usuário
     *     tags: [Agendas]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: userId
     *         required: true
     *         schema:
     *           type: string
     */
    getByUserId = async (req, res) => {
        try {
            const { userId } = req.params;
            const agendas = await this.service.getAgendasByUserId(userId);
            return res.status(200).json(convertAgendaArrayDates(agendas));
        }
        catch (error) {
            return res.status(500).json({ message: error.message });
        }
    };
    /**
     * @swagger
     * /agendas/patient/{patientId}:
     *   get:
     *     summary: Lista agendas por paciente
     *     tags: [Agendas]
     *     security:
     *       - bearerAuth: []
     */
    getByPatientId = async (req, res) => {
        try {
            const { patientId } = req.params;
            const agendas = await this.service.getAgendasByPatientId(patientId);
            return res.status(200).json(convertAgendaArrayDates(agendas));
        }
        catch (error) {
            return res.status(500).json({ message: error.message });
        }
    };
    /**
     * @swagger
     * /agendas/{id}:
     *   get:
     *     summary: Busca uma agenda por ID
     *     tags: [Agendas]
     */
    getById = async (req, res) => {
        try {
            const { id } = req.params;
            const agenda = await this.service.getAgendaById(id);
            if (!agenda)
                return res.status(404).json({ message: "Agenda não encontrada" });
            return res.status(200).json(convertAgendaDates(agenda));
        }
        catch (error) {
            return res.status(500).json({ message: error.message });
        }
    };
    /**
     * @swagger
     * /agendas:
     *   post:
     *     summary: Cria uma nova agenda
     *     tags: [Agendas]
     */
    create = async (req, res) => {
        try {
            const agenda = await this.service.createAgenda(req.body);
            return res.status(201).json(convertAgendaDates(agenda));
        }
        catch (error) {
            return res.status(400).json({ message: error.message });
        }
    };
    /**
     * @swagger
     * /agendas/{id}:
     *   put:
     *     summary: Atualiza uma agenda
     *     tags: [Agendas]
     */
    update = async (req, res) => {
        try {
            const { id } = req.params;
            const agenda = await this.service.updateAgenda(id, req.body);
            if (!agenda)
                return res.status(404).json({ message: "Agenda não encontrada" });
            return res.status(200).json(convertAgendaDates(agenda));
        }
        catch (error) {
            return res.status(500).json({ message: error.message });
        }
    };
    /**
     * @swagger
     * /agendas/{id}:
     *   delete:
     *     summary: Deleta uma agenda
     *     tags: [Agendas]
     */
    delete = async (req, res) => {
        try {
            const { id } = req.params;
            const deleted = await this.service.deleteAgenda(id);
            if (!deleted)
                return res.status(404).json({ message: "Agenda não encontrada" });
            return res.status(200).json({ message: "Agenda deletada com sucesso" });
        }
        catch (error) {
            return res.status(500).json({ message: error.message });
        }
    };
    /**
     * @swagger
     * /agendas/lock:
     *   post:
     *     summary: Cria um bloqueio de agenda (total ou parcial)
     *     tags: [Agendas]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required: [userId, type, date]
     *             properties:
     *               userId: { type: string }
     *               type: { type: string, enum: ['total', 'partial'] }
     *               date: { type: string, format: date-time }
     *               startTime: { type: string, example: "08:00" }
     *               endTime: { type: string, example: "12:00" }
     *               description: { type: string }
     */
    createLock = async (req, res) => {
        try {
            const lock = await this.service.createLock(req.body);
            return res.status(201).json(convertAgendaDates(lock));
        }
        catch (error) {
            return res.status(400).json({ message: error.message });
        }
    };
    /**
     * @swagger
     * /agendas/lock/{id}:
     *   delete:
     *     summary: Remove um bloqueio de agenda
     *     tags: [Agendas]
     *     security:
     *       - bearerAuth: []
     */
    deleteLock = async (req, res) => {
        try {
            const { id } = req.params;
            const deleted = await this.service.deleteLock(id);
            if (!deleted)
                return res.status(404).json({ message: "Bloqueio não encontrado" });
            return res.status(200).json({ message: "Bloqueio removido com sucesso" });
        }
        catch (error) {
            return res.status(500).json({ message: error.message });
        }
    };
    /**
     * @swagger
     * /agendas/online:
     *   post:
     *     summary: Realiza agendamento online pelo paciente (via PIN)
     *     tags: [Agendas]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required: [userId, pin, date, time, categoryId]
     *             properties:
     *               userId: { type: string }
     *               pin: { type: string, example: "1234" }
     *               date: { type: string, format: date-time }
     *               time: { type: string, example: "15:30" }
     *               categoryId: { type: string }
     */
    createOnline = async (req, res) => {
        try {
            const agenda = await this.service.createOnlineAppointment(req.body);
            return res.status(201).json(convertAgendaDates(agenda));
        }
        catch (error) {
            return res.status(400).json({ message: error.message });
        }
    };
}
export const agendaController = new AgendaController();
//# sourceMappingURL=AgendaController.js.map