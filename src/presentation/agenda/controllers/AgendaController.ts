import type { Request, Response } from "express";
import { container } from "tsyringe";
import type { IAgendaService } from "../../../domain/services/IAgendaService.js";
import type { ILogger } from "../../../infrastructure/logging/Logger.js";
import { convertAgendaDates, convertAgendaArrayDates } from "../../../utils/dateUtils.js";

export class AgendaController {
  private service: IAgendaService;
  private logger: ILogger;

  constructor() {
    this.service = container.resolve<IAgendaService>("IAgendaService");
    this.logger = container.resolve<ILogger>("Logger");
  }

  getAll = async (req: Request, res: Response) => {
    try {
      const agendas = await this.service.getAllAgendas();
      return res.status(200).json(convertAgendaArrayDates(agendas));
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  getByUserId = async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const agendas = await this.service.getAgendasByUserId(userId as string);
      return res.status(200).json(convertAgendaArrayDates(agendas));
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  getAppointmentsByUserId = async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const appointments = await this.service.getAppointmentsByUserId(userId as string);
      return res.status(200).json(convertAgendaArrayDates(appointments));
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  getLocksByUserId = async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const locks = await this.service.getLocksByUserId(userId as string);
      return res.status(200).json(convertAgendaArrayDates(locks));
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  getByPatientId = async (req: Request, res: Response) => {
    try {
      const { patientId } = req.params;
      const agendas = await this.service.getAgendasByPatientId(patientId as string);
      return res.status(200).json(convertAgendaArrayDates(agendas));
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  getById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const agenda = await this.service.getAgendaById(id as string);
      if (!agenda) return res.status(404).json({ message: "Agenda não encontrada" });
      return res.status(200).json(convertAgendaDates(agenda));
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  create = async (req: Request, res: Response) => {
    try {
      const agenda = await this.service.createAgenda(req.body);
      return res.status(201).json(convertAgendaDates(agenda));
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  update = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const agenda = await this.service.updateAgenda(id as string, req.body);
      if (!agenda) return res.status(404).json({ message: "Agenda não encontrada" });
      return res.status(200).json(convertAgendaDates(agenda));
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  delete = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const deleted = await this.service.deleteAgenda(id as string);
      if (!deleted) return res.status(404).json({ message: "Agenda não encontrada" });
      return res.status(200).json({ message: "Agenda deletada com sucesso" });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  createLock = async (req: Request, res: Response) => {
    try {
      const locks = await this.service.createLock(req.body);
      return res.status(201).json(convertAgendaArrayDates(locks));
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  deleteLock = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const deleted = await this.service.deleteLock(id as string);
      if (!deleted) return res.status(404).json({ message: "Bloqueio não encontrado" });
      return res.status(200).json({ message: "Bloqueio removido com sucesso" });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  createOnline = async (req: Request, res: Response) => {
    try {
      const agenda = await this.service.createOnlineAppointment(req.body);
      return res.status(201).json(convertAgendaDates(agenda));
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  getAvailableSlots = async (req: Request, res: Response) => {
    try {
      const { userId, date, categoryId } = req.query;
      
      if (!userId || !date) {
        return res.status(400).json({ message: "userId e date são obrigatórios." });
      }

      const slots = await this.service.getAvailableSlots(
        userId as string, 
        date as string, 
        categoryId as string | undefined
      );
      return res.status(200).json(slots);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }
}

export const agendaController = new AgendaController();