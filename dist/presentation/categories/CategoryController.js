import { container } from "tsyringe";
export class CategoryController {
    service;
    logger;
    constructor() {
        this.service = container.resolve("ICategoryService");
        this.logger = container.resolve("Logger");
    }
    getAllCategories = async (req, res) => {
        try {
            this.logger.info("Listando categorias");
            const categories = await this.service.getAllCategories();
            return res.status(200).json(categories);
        }
        catch (error) {
            this.logger.error("Erro ao listar categorias", error);
            return res.status(500).json({ message: error.message });
        }
    };
    getCategoryById = async (req, res) => {
        try {
            const { id } = req.params;
            if (!id || Array.isArray(id))
                return res.status(400).json({ message: "ID é obrigatório e deve ser string" });
            this.logger.info("Buscando categoria", { id });
            const category = await this.service.getCategoryById(id);
            if (!category)
                return res.status(404).json({ message: "Categoria não encontrada" });
            return res.status(200).json(category);
        }
        catch (error) {
            this.logger.error("Erro ao buscar categoria", error, { id: req.params.id });
            return res.status(500).json({ message: error.message });
        }
    };
    getCategoriesByUser = async (req, res) => {
        try {
            const { userId } = req.params;
            if (!userId || Array.isArray(userId))
                return res.status(400).json({ message: "ID do usuário é obrigatório e deve ser string" });
            this.logger.info("Buscando categorias por usuário", { userId });
            const categories = await this.service.getCategoriesByUserId(userId);
            return res.status(200).json(categories);
        }
        catch (error) {
            this.logger.error("Erro ao buscar categorias por usuário", error, { userId: req.params.userId });
            return res.status(500).json({ message: error.message });
        }
    };
    createCategory = async (req, res) => {
        try {
            const userId = req.user?.id;
            if (!userId)
                return res.status(401).json({ message: "Usuário não autenticado" });
            const category = await this.service.createCategory({ ...req.body, userId });
            return res.status(201).json(category);
        }
        catch (error) {
            this.logger.error("Erro ao criar categoria", error, { body: req.body });
            return res.status(500).json({ message: error.message });
        }
    };
    updateCategory = async (req, res) => {
        try {
            const { id } = req.params;
            if (!id || Array.isArray(id))
                return res.status(400).json({ message: "ID é obrigatório e deve ser string" });
            const category = await this.service.updateCategory(id, req.body);
            if (!category)
                return res.status(404).json({ message: "Categoria não encontrada" });
            return res.status(200).json(category);
        }
        catch (error) {
            this.logger.error("Erro ao atualizar categoria", error, { id: req.params.id });
            return res.status(500).json({ message: error.message });
        }
    };
    deleteCategory = async (req, res) => {
        try {
            const { id } = req.params;
            if (!id || Array.isArray(id))
                return res.status(400).json({ message: "ID é obrigatório e deve ser string" });
            const deleted = await this.service.deleteCategory(id);
            if (!deleted)
                return res.status(404).json({ message: "Categoria não encontrada" });
            return res.status(204).send();
        }
        catch (error) {
            this.logger.error("Erro ao deletar categoria", error, { id: req.params.id });
            return res.status(500).json({ message: error.message });
        }
    };
}
//# sourceMappingURL=CategoryController.js.map