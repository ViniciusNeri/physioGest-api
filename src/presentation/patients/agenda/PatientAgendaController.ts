import type { Request, Response } from "express";
import { container } from "tsyringe";
import type { IPatientAgendaService } from "../../../domain/services/IPatientSubdomainServices.js";
import type { ILogger } from "../../../infrastructure/logging/Logger.js";

export class PatientAgendaController {
  private service: IPatientAgendaService;
  private logger: ILogger;

  constructor() {
    this.service = container.resolve<IPatientAgendaService>("IPatientAgendaService");
    this.logger = container.resolve<ILogger>("Logger");
  }

  /**
   * @swagger
   * /patients/{patientId}/agenda:
   *   get:
   *     summary: Lista agenda do paciente
   *     tags: [Patient Agenda]
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
   *         description: Lista de agendamentos do paciente
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/PatientAgenda'
   *       500:
   *         description: Erro interno do servidor
   */
  getPatientAgenda = async (req: Request, res: Response) => {
    try {
      const { patientId } = req.params;
      if (!patientId) {
        return res.status(400).json({ message: "ID do paciente é obrigatório" });
      }
      this.logger.info("Listando agenda do paciente", { patientId });
      const agenda = await this.service.getPatientAgenda(patientId as string);
      return res.status(200).json(agenda);
    } catch (error: any) {
      this.logger.error("Erro ao listar agenda do paciente", error, { patientId: req.params.patientId });
      return res.status(500).json({ message: error.message });
    }
  }

  /**
   * @swagger
   * /patients/{patientId}/agenda/upcoming:
   *   get:
   *     summary: Lista próximos agendamentos do paciente
   *     tags: [Patient Agenda]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: patientId
   *         required: true
   *         schema:
   *           type: string
   *         description: ID do paciente
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           default: 10
   *         description: Número máximo de agendamentos
   *     responses:
   *       200:
   *         description: Lista de próximos agendamentos
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/PatientAgenda'
   *       500:
   *         description: Erro interno do servidor
   */
  getUpcomingAgenda = async (req: Request, res: Response) => {
    try {
      const { patientId } = req.params;
      if (!patientId) {
        return res.status(400).json({ message: "ID do paciente é obrigatório" });
      }
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      this.logger.info("Listando próximos agendamentos", { patientId, limit });
      const agenda = await this.service.getUpcomingAgenda(patientId as string, limit);
      return res.status(200).json(agenda);
    } catch (error: any) {
      this.logger.error("Erro ao listar próximos agendamentos", error, { patientId: req.params.patientId });
      return res.status(500).json({ message: error.message });
    }
  }

  /**
   * @swagger
   * /patients/{patientId}/agenda/{id}:
   *   get:
   *     summary: Busca agendamento específico
   *     tags: [Patient Agenda]
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
   *         description: ID do agendamento
   *     responses:
   *       200:
   *         description: Agendamento encontrado
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/PatientAgenda'
   *       404:
   *         description: Agendamento não encontrado
   *       500:
   *         description: Erro interno do servidor
   */
  getAgendaById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: "ID do agendamento é obrigatório" });
      }
      this.logger.info("Buscando agendamento por ID", { agendaId: id });
      const agenda = await this.service.getAgendaById(id as string);
      if (!agenda) {
        return res.status(404).json({ message: "Agendamento não encontrado" });
      }
      return res.status(200).json(agenda);
    } catch (error: any) {
      this.logger.error("Erro ao buscar agendamento", error, { agendaId: req.params.id });
      return res.status(500).json({ message: error.message });
    }
  }

  /**
   * @swagger
   * /patients/{patientId}/agenda:
   *   post:
   *     summary: Cria novo agendamento
   *     tags: [Patient Agenda]
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
   *             $ref: '#/components/schemas/CreatePatientAgenda'
   *     responses:
   *       201:
   *         description: Agendamento criado com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/PatientAgenda'
   *       400:
   *         description: Dados inválidos
   *       500:
   *         description: Erro interno do servidor
   */
  createAgenda = async (req: Request, res: Response) => {
    try {
      const { patientId } = req.params;
      const agendaData = { ...req.body, patientId, userId: (req as any).user?.id };
      this.logger.info("Criando agendamento", { patientId, date: agendaData.date });
      const agenda = await this.service.createAgenda(agendaData);
      return res.status(201).json(agenda);
    } catch (error: any) {
      this.logger.error("Erro ao criar agendamento", error, { patientId: req.params.patientId });
      return res.status(500).json({ message: error.message });
    }
  }

  /**
   * @swagger
   * /patients/{patientId}/agenda/{id}:
   *   put:
   *     summary: Atualiza agendamento
   *     tags: [Patient Agenda]
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
   *         description: ID do agendamento
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UpdatePatientAgenda'
   *     responses:
   *       200:
   *         description: Agendamento atualizado com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/PatientAgenda'
   *       404:
   *         description: Agendamento não encontrado
   *       500:
   *         description: Erro interno do servidor
   */
  updateAgenda = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: "ID do agendamento é obrigatório" });
      }
      this.logger.info("Atualizando agendamento", { agendaId: id });
      const agenda = await this.service.updateAgenda(id as string, req.body);
      if (!agenda) {
        return res.status(404).json({ message: "Agendamento não encontrado" });
      }
      return res.status(200).json(agenda);
    } catch (error: any) {
      this.logger.error("Erro ao atualizar agendamento", error, { agendaId: req.params.id });
      return res.status(500).json({ message: error.message });
    }
  }

  /**
   * @swagger
   * /patients/{patientId}/agenda/{id}:
   *   delete:
   *     summary: Deleta agendamento
   *     tags: [Patient Agenda]
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
   *         description: ID do agendamento
   *     responses:
   *       204:
   *         description: Agendamento deletado com sucesso
   *       404:
   *         description: Agendamento não encontrado
   *       500:
   *         description: Erro interno do servidor
   */
  deleteAgenda = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: "ID do agendamento é obrigatório" });
      }
      this.logger.info("Deletando agendamento", { agendaId: id });
      const deleted = await this.service.deleteAgenda(id as string);
      if (!deleted) {
        return res.status(404).json({ message: "Agendamento não encontrado" });
      }
      return res.status(204).send();
    } catch (error: any) {
      this.logger.error("Erro ao deletar agendamento", error, { agendaId: req.params.id });
      return res.status(500).json({ message: error.message });
    }
  }
}