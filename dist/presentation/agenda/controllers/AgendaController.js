import { container } from "tsyringe";
import { convertAgendaDates, convertAgendaArrayDates } from "../../../utils/dateUtils.js";
export class AgendaController {
    service;
    logger;
    constructor() {
        this.service = container.resolve("IAgendaService");
        this.logger = container.resolve("Logger");
    }
    getAll = async (req, res) => {
        try {
            const agendas = await this.service.getAllAgendas();
            return res.status(200).json(convertAgendaArrayDates(agendas));
        }
        catch (error) {
            return res.status(500).json({ message: error.message });
        }
    };
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
    getAppointmentsByUserId = async (req, res) => {
        try {
            const { userId } = req.params;
            const appointments = await this.service.getAppointmentsByUserId(userId);
            return res.status(200).json(convertAgendaArrayDates(appointments));
        }
        catch (error) {
            return res.status(500).json({ message: error.message });
        }
    };
    getLocksByUserId = async (req, res) => {
        try {
            const { userId } = req.params;
            const locks = await this.service.getLocksByUserId(userId);
            return res.status(200).json(convertAgendaArrayDates(locks));
        }
        catch (error) {
            return res.status(500).json({ message: error.message });
        }
    };
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
    create = async (req, res) => {
        try {
            const agenda = await this.service.createAgenda(req.body);
            return res.status(201).json(convertAgendaDates(agenda));
        }
        catch (error) {
            return res.status(400).json({ message: error.message });
        }
    };
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
    createLock = async (req, res) => {
        try {
            const locks = await this.service.createLock(req.body);
            return res.status(201).json(convertAgendaArrayDates(locks));
        }
        catch (error) {
            return res.status(400).json({ message: error.message });
        }
    };
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
    createOnline = async (req, res) => {
        try {
            const agenda = await this.service.createOnlineAppointment(req.body);
            return res.status(201).json(convertAgendaDates(agenda));
        }
        catch (error) {
            return res.status(400).json({ message: error.message });
        }
    };
    getAvailableSlots = async (req, res) => {
        try {
            const { userId, date, categoryId } = req.query;
            if (!userId || !date) {
                return res.status(400).json({ message: "userId e date são obrigatórios." });
            }
            const slots = await this.service.getAvailableSlots(userId, date, categoryId);
            return res.status(200).json(slots);
        }
        catch (error) {
            return res.status(500).json({ message: error.message });
        }
    };
}
export const agendaController = new AgendaController();
//# sourceMappingURL=AgendaController.js.map