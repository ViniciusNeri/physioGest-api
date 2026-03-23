import type { Request, Response } from "express";
import { container } from "tsyringe";
import type { IPaymentMethodService } from "../../domain/services/IPaymentMethodService.js";
import type { ILogger } from "../../infrastructure/logging/Logger.js";

export class PaymentMethodController {
  private service: IPaymentMethodService;
  private logger: ILogger;

  constructor() {
    this.service = container.resolve<IPaymentMethodService>("IPaymentMethodService");
    this.logger = container.resolve<ILogger>("Logger");
  }

  getAllPaymentMethods = async (req: Request, res: Response) => {
    try {
      console.log("[CONTROLLER DEBUG] getAllPaymentMethods called");
      this.logger.info("Listando formas de pagamento");
      const methods = await this.service.getAllPaymentMethods();
      return res.status(200).json(methods);
    } catch (error: any) {
      this.logger.error("Erro ao listar formas de pagamento", error);
      return res.status(500).json({ message: error.message });
    }
  };

  getPaymentMethodById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      console.log(`[CONTROLLER DEBUG] getPaymentMethodById called with id: ${id}`);
      if (!id || Array.isArray(id)) return res.status(400).json({ message: "ID é obrigatório e deve ser string" });
      const method = await this.service.getPaymentMethodById(id);
      if (!method) return res.status(404).json({ message: "Forma de pagamento não encontrada" });
      return res.status(200).json(method);
    } catch (error: any) {
      this.logger.error("Erro ao buscar forma de pagamento", error, { id: req.params.id });
      return res.status(500).json({ message: error.message });
    }
  };

  getPaymentMethodsByUser = async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      if (!userId || Array.isArray(userId)) return res.status(400).json({ message: "ID do usuário é obrigatório e deve ser string" });
      const methods = await this.service.getPaymentMethodsByUserId(userId);
      return res.status(200).json(methods);
    } catch (error: any) {
      this.logger.error("Erro ao buscar formas de pagamento por usuário", error, { userId: req.params.userId });
      return res.status(500).json({ message: error.message });
    }
  };

  createPaymentMethod = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.id;
      if (!userId) return res.status(401).json({ message: "Usuário não autenticado" });
      const method = await this.service.createPaymentMethod({ ...req.body, userId });
      return res.status(201).json(method);
    } catch (error: any) {
      this.logger.error("Erro ao criar forma de pagamento", error, { body: req.body });
      return res.status(500).json({ message: error.message });
    }
  };

  updatePaymentMethod = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id || Array.isArray(id)) return res.status(400).json({ message: "ID é obrigatório e deve ser string" });
      const method = await this.service.updatePaymentMethod(id, req.body);
      if (!method) return res.status(404).json({ message: "Forma de pagamento não encontrada" });
      return res.status(200).json(method);
    } catch (error: any) {
      this.logger.error("Erro ao atualizar forma de pagamento", error, { id: req.params.id });
      return res.status(500).json({ message: error.message });
    }
  };

  deletePaymentMethod = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id || Array.isArray(id)) return res.status(400).json({ message: "ID é obrigatório e deve ser string" });
      const deleted = await this.service.deletePaymentMethod(id);
      if (!deleted) return res.status(404).json({ message: "Forma de pagamento não encontrada" });
      return res.status(204).send();
    } catch (error: any) {
      this.logger.error("Erro ao deletar forma de pagamento", error, { id: req.params.id });
      return res.status(500).json({ message: error.message });
    }
  };
}
