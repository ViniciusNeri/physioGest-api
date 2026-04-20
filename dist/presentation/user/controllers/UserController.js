import { container } from "tsyringe";
export class UserController {
    service;
    logger;
    constructor() {
        this.service = container.resolve("IUserService");
        this.logger = container.resolve("Logger");
    }
    /**
     * @swagger
     * /users:
     *   get:
     *     summary: Lista todos os usuários
     *     tags: [Users]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Lista de usuários
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/User'
     *       500:
     *         description: Erro interno do servidor
     */
    getAll = async (req, res) => {
        try {
            this.logger.info("Listando todos os usuários");
            const users = await this.service.getAllUsers();
            return res.status(200).json(users);
        }
        catch (error) {
            this.logger.error("Erro ao listar usuários", error);
            return res.status(500).json({ message: error.message });
        }
    };
    /**
     * @swagger
     * /users/{id}:
     *   get:
     *     summary: Busca um usuário por ID
     *     tags: [Users]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: ID do usuário
     *     responses:
     *       200:
     *         description: Usuário encontrado
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/User'
     *       404:
     *         description: Usuário não encontrado
     *       500:
     *         description: Erro interno do servidor
     */
    getById = async (req, res) => {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ message: "Identificador é obrigatório" });
            }
            this.logger.info(`Buscando usuário por identificador: ${id}`);
            const user = await this.service.getUserById(id);
            if (!user) {
                return res.status(404).json({ message: "Usuário não encontrado" });
            }
            return res.status(200).json(user);
        }
        catch (error) {
            this.logger.error("Erro ao buscar usuário", error);
            return res.status(500).json({ message: error.message });
        }
    };
    /**
     * @swagger
     * /users:
     *   post:
     *     summary: Cria um novo usuário
     *     tags: [Users]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - name
     *               - email
     *               - password
     *               - phone
     *             properties:
     *               name:
     *                 type: string
     *               email:
     *                 type: string
     *                 format: email
     *               password:
     *                 type: string
     *                 minLength: 6
     *               phone:
     *                 type: string
     *                 description: "Telefone com DDD, somente números (ex: 5511999998888)"
     *                 example: "5511999998888"
     *     responses:
     *       201:
     *         description: Usuário criado
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/User'
     *       400:
     *         description: Dados inválidos ou telefone já cadastrado
     *       500:
     *         description: Erro interno do servidor
     */
    create = async (req, res) => {
        try {
            const { name, email, password, phone } = req.body;
            if (!phone) {
                return res.status(400).json({ message: "O campo telefone (phone) é obrigatório." });
            }
            this.logger.info(`Criando usuário: ${email}`);
            const user = await this.service.createUser({ name, email, password, phone });
            return res.status(201).json(user);
        }
        catch (error) {
            this.logger.error("Erro ao criar usuário", error);
            return res.status(400).json({ message: error.message });
        }
    };
    /**
     * @swagger
     * /users/{id}:
     *   put:
     *     summary: Atualiza um usuário
     *     tags: [Users]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: ID do usuário
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               name:
     *                 type: string
     *               email:
     *                 type: string
     *                 format: email
     *               password:
     *                 type: string
     *                 minLength: 6
     *               phone:
     *                 type: string
     *                 description: "Telefone com DDD, somente números (ex: 5511999998888)"
     *                 example: "5511999998888"
     *     responses:
     *       200:
     *         description: Usuário atualizado
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/User'
     *       400:
     *         description: Telefone inválido ou já cadastrado
     *       404:
     *         description: Usuário não encontrado
     *       500:
     *         description: Erro interno do servidor
     */
    update = async (req, res) => {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ message: "Identificador é obrigatório" });
            }
            const updates = req.body;
            this.logger.info(`Atualizando usuário por identificador: ${id}`);
            const user = await this.service.updateUser(id, updates);
            if (!user) {
                return res.status(404).json({ message: "Usuário não encontrado" });
            }
            return res.status(200).json(user);
        }
        catch (error) {
            this.logger.error("Erro ao atualizar usuário", error);
            return res.status(500).json({ message: error.message });
        }
    };
    /**
     * @swagger
     * /users/{id}:
     *   delete:
     *     summary: Deleta um usuário
     *     tags: [Users]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: ID do usuário
     *     responses:
     *       200:
     *         description: Usuário deletado
     *       404:
     *         description: Usuário não encontrado
     *       500:
     *         description: Erro interno do servidor
     */
    delete = async (req, res) => {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ message: "Identificador é obrigatório" });
            }
            this.logger.info(`Deletando usuário por identificador: ${id}`);
            const deleted = await this.service.deleteUser(id);
            if (!deleted) {
                return res.status(404).json({ message: "Usuário não encontrado" });
            }
            return res.status(200).json({ message: "Usuário deletado com sucesso" });
        }
        catch (error) {
            this.logger.error("Erro ao deletar usuário", error);
            return res.status(500).json({ message: error.message });
        }
    };
}
export const userController = new UserController();
//# sourceMappingURL=UserController.js.map