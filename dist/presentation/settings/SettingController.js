import { container } from "tsyringe";
export class SettingController {
    service;
    logger;
    constructor() {
        this.service = container.resolve("ISettingService");
        this.logger = container.resolve("Logger");
    }
    getAllSettings = async (req, res) => {
        try {
            this.logger.info("Listando todas as configurações");
            const settings = await this.service.getAllSettings();
            return res.status(200).json(settings);
        }
        catch (error) {
            this.logger.error("Erro ao listar configurações", error);
            return res.status(500).json({ message: error.message });
        }
    };
    getSettingById = async (req, res) => {
        try {
            const { id } = req.params;
            if (!id || Array.isArray(id)) {
                return res.status(400).json({ message: "ID é obrigatório e deve ser string" });
            }
            this.logger.info("Buscando configuração por ID", { id });
            const setting = await this.service.getSettingById(id);
            if (!setting) {
                return res.status(404).json({ message: "Configuração não encontrada" });
            }
            return res.status(200).json(setting);
        }
        catch (error) {
            this.logger.error("Erro ao buscar configuração", error, { id: req.params.id });
            return res.status(500).json({ message: error.message });
        }
    };
    getSettingByUserId = async (req, res) => {
        try {
            const { userId } = req.params;
            if (!userId || Array.isArray(userId)) {
                return res.status(400).json({ message: "ID do usuário é obrigatório e deve ser string" });
            }
            this.logger.info("Buscando configuração do usuário", { userId });
            const setting = await this.service.getSettingByUserId(userId);
            if (!setting) {
                return res.status(404).json({ message: "Configuração não encontrada" });
            }
            return res.status(200).json(setting);
        }
        catch (error) {
            this.logger.error("Erro ao buscar configuração por usuário", error, { userId: req.params.userId });
            return res.status(500).json({ message: error.message });
        }
    };
    createSetting = async (req, res) => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({ message: "Usuário não autenticado" });
            }
            const settingData = { ...req.body, userId };
            this.logger.info("Criando configuração", { userId });
            const setting = await this.service.createSetting(settingData);
            return res.status(201).json(setting);
        }
        catch (error) {
            this.logger.error("Erro ao criar configuração", error, { body: req.body });
            return res.status(500).json({ message: error.message });
        }
    };
    updateSetting = async (req, res) => {
        try {
            const { id } = req.params;
            if (!id || Array.isArray(id)) {
                return res.status(400).json({ message: "ID é obrigatório e deve ser string" });
            }
            this.logger.info("Atualizando configuração", { id });
            const setting = await this.service.updateSetting(id, req.body);
            if (!setting) {
                return res.status(404).json({ message: "Configuração não encontrada" });
            }
            return res.status(200).json(setting);
        }
        catch (error) {
            this.logger.error("Erro ao atualizar configuração", error, { id: req.params.id });
            return res.status(500).json({ message: error.message });
        }
    };
    deleteSetting = async (req, res) => {
        try {
            const { id } = req.params;
            if (!id || Array.isArray(id)) {
                return res.status(400).json({ message: "ID é obrigatório e deve ser string" });
            }
            this.logger.info("Deletando configuração", { id });
            const deleted = await this.service.deleteSetting(id);
            if (!deleted) {
                return res.status(404).json({ message: "Configuração não encontrada" });
            }
            return res.status(204).send();
        }
        catch (error) {
            this.logger.error("Erro ao deletar configuração", error, { id: req.params.id });
            return res.status(500).json({ message: error.message });
        }
    };
}
//# sourceMappingURL=SettingController.js.map