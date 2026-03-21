import { container } from "tsyringe";
export class PaymentMethodController {
    service;
    logger;
    constructor() {
        this.service = container.resolve("IPaymentMethodService");
        this.logger = container.resolve("Logger");
    }
    getAllPaymentMethods = async (req, res) => {
        try {
            this.logger.info("Listando formas de pagamento");
            const methods = await this.service.getAllPaymentMethods();
            return res.status(200).json(methods);
        }
        catch (error) {
            this.logger.error("Erro ao listar formas de pagamento", error);
            return res.status(500).json({ message: error.message });
        }
    };
    getPaymentMethodById = async (req, res) => {
        try {
            const { id } = req.params;
            if (!id || Array.isArray(id))
                return res.status(400).json({ message: "ID é obrigatório e deve ser string" });
            const method = await this.service.getPaymentMethodById(id);
            if (!method)
                return res.status(404).json({ message: "Forma de pagamento não encontrada" });
            return res.status(200).json(method);
        }
        catch (error) {
            this.logger.error("Erro ao buscar forma de pagamento", error, { id: req.params.id });
            return res.status(500).json({ message: error.message });
        }
    };
    getPaymentMethodsByUser = async (req, res) => {
        try {
            const { userId } = req.params;
            if (!userId || Array.isArray(userId))
                return res.status(400).json({ message: "ID do usuário é obrigatório e deve ser string" });
            const methods = await this.service.getPaymentMethodsByUserId(userId);
            return res.status(200).json(methods);
        }
        catch (error) {
            this.logger.error("Erro ao buscar formas de pagamento por usuário", error, { userId: req.params.userId });
            return res.status(500).json({ message: error.message });
        }
    };
    createPaymentMethod = async (req, res) => {
        try {
            const userId = req.user?.id;
            if (!userId)
                return res.status(401).json({ message: "Usuário não autenticado" });
            const method = await this.service.createPaymentMethod({ ...req.body, userId });
            return res.status(201).json(method);
        }
        catch (error) {
            this.logger.error("Erro ao criar forma de pagamento", error, { body: req.body });
            return res.status(500).json({ message: error.message });
        }
    };
    updatePaymentMethod = async (req, res) => {
        try {
            const { id } = req.params;
            if (!id || Array.isArray(id))
                return res.status(400).json({ message: "ID é obrigatório e deve ser string" });
            const method = await this.service.updatePaymentMethod(id, req.body);
            if (!method)
                return res.status(404).json({ message: "Forma de pagamento não encontrada" });
            return res.status(200).json(method);
        }
        catch (error) {
            this.logger.error("Erro ao atualizar forma de pagamento", error, { id: req.params.id });
            return res.status(500).json({ message: error.message });
        }
    };
    deletePaymentMethod = async (req, res) => {
        try {
            const { id } = req.params;
            if (!id || Array.isArray(id))
                return res.status(400).json({ message: "ID é obrigatório e deve ser string" });
            const deleted = await this.service.deletePaymentMethod(id);
            if (!deleted)
                return res.status(404).json({ message: "Forma de pagamento não encontrada" });
            return res.status(204).send();
        }
        catch (error) {
            this.logger.error("Erro ao deletar forma de pagamento", error, { id: req.params.id });
            return res.status(500).json({ message: error.message });
        }
    };
}
//# sourceMappingURL=PaymentMethodController.js.map