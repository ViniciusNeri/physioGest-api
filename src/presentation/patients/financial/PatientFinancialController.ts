import type { Request, Response } from "express";
import { container } from "tsyringe";
import type { IPatientFinancialService } from "../../../domain/services/IPatientSubdomainServices.js";
import type { ILogger } from "../../../infrastructure/logging/Logger.js";

export class PatientFinancialController {
  private service: IPatientFinancialService;
  private logger: ILogger;

  constructor() {
    this.service = container.resolve<IPatientFinancialService>("IPatientFinancialService");
    this.logger = container.resolve<ILogger>("Logger");
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
  getPatientFinancial = async (req: Request, res: Response) => {
    try {
      const { patientId } = req.params;
      if (!patientId) {
        return res.status(400).json({ message: "ID do paciente é obrigatório" });
      }
      this.logger.info("Listando registros financeiros do paciente", { patientId });
      const financial = await this.service.getPatientFinancial(patientId as string);
      return res.status(200).json(financial);
    } catch (error: any) {
      this.logger.error("Erro ao listar registros financeiros", error, { patientId: req.params.patientId });
      return res.status(500).json({ message: error.message });
    }
  }

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
  getPatientBalance = async (req: Request, res: Response) => {
    try {
      const { patientId } = req.params;
      if (!patientId) {
        return res.status(400).json({ message: "ID do paciente é obrigatório" });
      }
      this.logger.info("Calculando saldo do paciente", { patientId });
      const balance = await this.service.getPatientBalance(patientId as string);
      return res.status(200).json({ balance });
    } catch (error: any) {
      this.logger.error("Erro ao calcular saldo", error, { patientId: req.params.patientId });
      return res.status(500).json({ message: error.message });
    }
  }

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
  getPendingPayments = async (req: Request, res: Response) => {
    try {
      const { patientId } = req.params;
      if (!patientId) {
        return res.status(400).json({ message: "ID do paciente é obrigatório" });
      }
      this.logger.info("Listando pagamentos pendentes", { patientId });
      const payments = await this.service.getPendingPayments(patientId as string);
      return res.status(200).json(payments);
    } catch (error: any) {
      this.logger.error("Erro ao listar pagamentos pendentes", error, { patientId: req.params.patientId });
      return res.status(500).json({ message: error.message });
    }
  }

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
  getFinancialSummary = async (req: Request, res: Response) => {
    try {
      const { patientId } = req.params;
      if (!patientId) {
        return res.status(400).json({ message: "ID do paciente é obrigatório" });
      }
      this.logger.info("Gerando resumo financeiro do paciente", { patientId });
      const summary = await this.service.getFinancialSummary(patientId as string);
      return res.status(200).json(summary);
    } catch (error: any) {
      this.logger.error("Erro ao gerar resumo financeiro", error, { patientId: req.params.patientId });
      return res.status(500).json({ message: error.message });
    }
  }

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
  getFinancialById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: "ID do registro financeiro é obrigatório" });
      }
      this.logger.info("Buscando registro financeiro por ID", { financialId: id });
      const financial = await this.service.getFinancialById(id as string);
      if (!financial) {
        return res.status(404).json({ message: "Registro financeiro não encontrado" });
      }
      return res.status(200).json(financial);
    } catch (error: any) {
      this.logger.error("Erro ao buscar registro financeiro", error, { financialId: req.params.id });
      return res.status(500).json({ message: error.message });
    }
  }

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
  createFinancial = async (req: Request, res: Response) => {
    try {
      const { patientId } = req.params;
      const financialData = { ...req.body, patientId, userId: (req as any).user?.id };
      
      // Garantir que valores numéricos sejam tratados corretamente
      if (financialData.amount) financialData.amount = Number(financialData.amount);
      if (financialData.totalSessions) financialData.totalSessions = Number(financialData.totalSessions);

      this.logger.info("Criando registro financeiro", { patientId, type: financialData.type, amount: financialData.amount });
      const financial = await this.service.createFinancial(financialData);
      return res.status(201).json(financial);
    } catch (error: any) {
      this.logger.error("Erro ao criar registro financeiro", error, { patientId: req.params.patientId });
      return res.status(500).json({ message: error.message });
    }
  }

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
  payFinancial = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { paymentMethod } = req.body;
      if (!id) {
        return res.status(400).json({ message: "ID do registro financeiro é obrigatório" });
      }
      this.logger.info("Marcando registro financeiro como pago", { financialId: id });
      const financial = await this.service.payFinancial(id as string, paymentMethod);
      if (!financial) {
        return res.status(404).json({ message: "Registro financeiro não encontrado" });
      }
      return res.status(200).json(financial);
    } catch (error: any) {
      this.logger.error("Erro ao marcar como pago", error, { financialId: req.params.id });
      return res.status(500).json({ message: error.message });
    }
  }

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
  updateFinancial = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: "ID do registro financeiro é obrigatório" });
      }
      this.logger.info("Atualizando registro financeiro", { financialId: id });
      
      const updates = { ...req.body };
      if (updates.amount) updates.amount = Number(updates.amount);
      if (updates.totalSessions) updates.totalSessions = Number(updates.totalSessions);

      const financial = await this.service.updateFinancial(id as string, updates);
      if (!financial) {
        return res.status(404).json({ message: "Registro financeiro não encontrado" });
      }
      return res.status(200).json(financial);
    } catch (error: any) {
      this.logger.error("Erro ao atualizar registro financeiro", error, { financialId: req.params.id });
      return res.status(500).json({ message: error.message });
    }
  }

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
  deleteFinancial = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: "ID do registro financeiro é obrigatório" });
      }
      this.logger.info("Deletando registro financeiro", { financialId: id });
      const deleted = await this.service.deleteFinancial(id as string);
      if (!deleted) {
        return res.status(404).json({ message: "Registro financeiro não encontrado" });
      }
      return res.status(204).send();
    } catch (error: any) {
      this.logger.error("Erro ao deletar registro financeiro", error, { financialId: req.params.id });
      return res.status(500).json({ message: error.message });
    }
  }
}