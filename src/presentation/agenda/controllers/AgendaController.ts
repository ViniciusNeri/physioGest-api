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
  getAll = async (req: Request, res: Response) => {
    try {
      this.logger.info("Listando todas as agendas");
      const agendas = await this.service.getAllAgendas();
      return res.status(200).json(convertAgendaArrayDates(agendas));
    } catch (error: any) {
      this.logger.error("Erro ao listar agendas", error);
      return res.status(500).json({ message: error.message });
    }
  }

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
  getByUserId = async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      if (!userId) {
        return res.status(400).json({ message: "userId é obrigatório" });
      }
      this.logger.info(`Listando agendas do usuário: ${userId}`);
      const agendas = await this.service.getAgendasByUserId(userId as string);
      return res.status(200).json(convertAgendaArrayDates(agendas));
    } catch (error: any) {
      this.logger.error("Erro ao listar agendas do usuário", error);
      return res.status(500).json({ message: error.message });
    }
  }

  /**
   * @swagger
   * /agendas/patient/{patientId}:
   *   get:
   *     summary: Lista agendas por paciente
   *     tags: [Agendas]
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
   *         description: Lista de agendas do paciente
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Agenda'
   *       500:
   *         description: Erro interno do servidor
   */
  getByPatientId = async (req: Request, res: Response) => {
    try {
      const { patientId } = req.params;
      if (!patientId) {
        return res.status(400).json({ message: "patientId é obrigatório" });
      }
      this.logger.info(`Listando agendas do paciente: ${patientId}`);
      const agendas = await this.service.getAgendasByPatientId(patientId as string);
      return res.status(200).json(convertAgendaArrayDates(agendas));
    } catch (error: any) {
      this.logger.error("Erro ao listar agendas do paciente", error);
      return res.status(500).json({ message: error.message });
    }
  }

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
  getById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: "ID é obrigatório" });
      }
      this.logger.info(`Buscando agenda por ID: ${id}`);
      const agenda = await this.service.getAgendaById(id as string);
      if (!agenda) {
        return res.status(404).json({ message: "Agenda não encontrada" });
      }
      return res.status(200).json(convertAgendaDates(agenda));
    } catch (error: any) {
      this.logger.error("Erro ao buscar agenda", error);
      return res.status(500).json({ message: error.message });
    }
  }

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
   *               - patientId
   *               - userId
   *               - startDate
   *               - endDate
   *             properties:
   *               startDate:
   *                 type: string
   *                 format: date-time
   *               endDate:
   *                 type: string
   *                 format: date-time
   *               patientId:
   *                 type: string
   *               userId:
   *                 type: string
   *               categoryId:
   *                 type: string
   *               status:
   *                 type: string
   *                 enum: ['scheduled', 'completed', 'cancelled', 'no_show']
   *               description:
   *                 type: string
   *               notes:
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
  create = async (req: Request, res: Response) => {
    try {
      const agendaData = req.body;
      this.logger.info(`Criando agenda para usuário: ${agendaData.userId}`);
      const agenda = await this.service.createAgenda(agendaData);
      return res.status(201).json(convertAgendaDates(agenda));
    } catch (error: any) {
      this.logger.error("Erro ao criar agenda", error);
      return res.status(400).json({ message: error.message });
    }
  }

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
   *               startDate:
   *                 type: string
   *                 format: date-time
   *               endDate:
   *                 type: string
   *                 format: date-time
   *               patientId:
   *                 type: string
   *               userId:
   *                 type: string
   *               categoryId:
   *                 type: string
   *               status:
   *                 type: string
   *                 enum: ['scheduled', 'completed', 'cancelled', 'no_show']
   *               description:
   *                 type: string
   *               notes:
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
  update = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: "ID é obrigatório" });
      }
      const updates = req.body;
      this.logger.info(`Atualizando agenda: ${id}`);
      const agenda = await this.service.updateAgenda(id as string, updates);
      if (!agenda) {
        return res.status(404).json({ message: "Agenda não encontrada" });
      }
      return res.status(200).json(convertAgendaDates(agenda));
    } catch (error: any) {
      this.logger.error("Erro ao atualizar agenda", error);
      return res.status(500).json({ message: error.message });
    }
  }

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
  delete = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: "ID é obrigatório" });
      }
      this.logger.info(`Deletando agenda: ${id}`);
      const deleted = await this.service.deleteAgenda(id as string);
      if (!deleted) {
        return res.status(404).json({ message: "Agenda não encontrada" });
      }
      return res.status(200).json({ message: "Agenda deletada com sucesso" });
    } catch (error: any) {
      this.logger.error("Erro ao deletar agenda", error);
      return res.status(500).json({ message: error.message });
    }
  }
}

export const agendaController = new AgendaController();