import type { Request, Response } from "express";
import { container } from "tsyringe";
import type { IFinancialService } from "../../../domain/services/IFinancialService.js";
import type { ILogger } from "../../../infrastructure/logging/Logger.js";

export class FinancialController {
  private service: IFinancialService;
  private logger: ILogger;

  constructor() {
    this.service = container.resolve<IFinancialService>("IFinancialService");
    this.logger = container.resolve<ILogger>("Logger");
  }

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
  getAll = async (req: Request, res: Response) => {
    try {
      this.logger.info("Listando todos os registros financeiros");
      const financials = await this.service.getAllFinancials();
      return res.status(200).json(financials);
    } catch (error: any) {
      this.logger.error("Erro ao listar registros financeiros", error);
      return res.status(500).json({ message: error.message });
    }
  }

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
  getByUserId = async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      if (!userId) {
        return res.status(400).json({ message: "userId é obrigatório" });
      }
      this.logger.info(`Listando registros financeiros do usuário: ${userId}`);
      const financials = await this.service.getFinancialsByUserId(userId as string);
      return res.status(200).json(financials);
    } catch (error: any) {
      this.logger.error("Erro ao listar registros financeiros do usuário", error);
      return res.status(500).json({ message: error.message });
    }
  }

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
  getByPatientId = async (req: Request, res: Response) => {
    try {
      const { patientId } = req.params;
      if (!patientId) {
        return res.status(400).json({ message: "patientId é obrigatório" });
      }
      this.logger.info(`Listando registros financeiros do paciente: ${patientId}`);
      const financials = await this.service.getFinancialsByPatientId(patientId as string);
      return res.status(200).json(financials);
    } catch (error: any) {
      this.logger.error("Erro ao listar registros financeiros do paciente", error);
      return res.status(500).json({ message: error.message });
    }
  }

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
  getById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: "ID é obrigatório" });
      }
      this.logger.info(`Buscando registro financeiro por ID: ${id}`);
      const financial = await this.service.getFinancialById(id as string);
      if (!financial) {
        return res.status(404).json({ message: "Registro financeiro não encontrado" });
      }
      return res.status(200).json(financial);
    } catch (error: any) {
      this.logger.error("Erro ao buscar registro financeiro", error);
      return res.status(500).json({ message: error.message });
    }
  }

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
   *               amount:
   *                 type: number
   *               date:
   *                 type: string
   *                 format: date
   *               description:
   *                 type: string
   *               userId:
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
  create = async (req: Request, res: Response) => {
    try {
      const financialData = req.body;
      this.logger.info(`Criando registro financeiro para usuário: ${financialData.userId}`);
      const financial = await this.service.createFinancial(financialData);
      return res.status(201).json(financial);
    } catch (error: any) {
      this.logger.error("Erro ao criar registro financeiro", error);
      return res.status(400).json({ message: error.message });
    }
  }

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
   *               amount:
   *                 type: number
   *               date:
   *                 type: string
   *                 format: date
   *               description:
   *                 type: string
   *               userId:
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
  update = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: "ID é obrigatório" });
      }
      const updates = req.body;
      this.logger.info(`Atualizando registro financeiro: ${id}`);
      const financial = await this.service.updateFinancial(id as string, updates);
      if (!financial) {
        return res.status(404).json({ message: "Registro financeiro não encontrado" });
      }
      return res.status(200).json(financial);
    } catch (error: any) {
      this.logger.error("Erro ao atualizar registro financeiro", error);
      return res.status(500).json({ message: error.message });
    }
  }

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
   *     responses:
   *       200:
   *         description: Registro financeiro deletado
   *       404:
   *         description: Registro financeiro não encontrado
   *       500:
   *         description: Erro interno do servidor
   */
  delete = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: "ID é obrigatório" });
      }
      this.logger.info(`Deletando registro financeiro: ${id}`);
      const deleted = await this.service.deleteFinancial(id as string);
      if (!deleted) {
        return res.status(404).json({ message: "Registro financeiro não encontrado" });
      }
      return res.status(200).json({ message: "Registro financeiro deletado com sucesso" });
    } catch (error: any) {
      this.logger.error("Erro ao deletar registro financeiro", error);
      return res.status(500).json({ message: error.message });
    }
  }
}

export const financialController = new FinancialController();