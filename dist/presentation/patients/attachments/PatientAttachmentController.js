import { container } from "tsyringe";
export class PatientAttachmentController {
    service;
    logger;
    constructor() {
        this.service = container.resolve("IPatientAttachmentService");
        this.logger = container.resolve("Logger");
    }
    /**
     * @swagger
     * /patients/{patientId}/attachments:
     *   get:
     *     summary: Lista anexos do paciente
     *     tags: [Patient Attachments]
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
     *         description: Lista de anexos do paciente
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/PatientAttachment'
     *       500:
     *         description: Erro interno do servidor
     */
    getPatientAttachments = async (req, res) => {
        try {
            const { patientId } = req.params;
            if (!patientId) {
                return res.status(400).json({ message: "ID do paciente é obrigatório" });
            }
            this.logger.info("Listando anexos do paciente", { patientId });
            const attachments = await this.service.getPatientAttachments(patientId);
            return res.status(200).json(attachments);
        }
        catch (error) {
            this.logger.error("Erro ao listar anexos do paciente", error, { patientId: req.params.patientId });
            return res.status(500).json({ message: error.message });
        }
    };
    /**
     * @swagger
     * /patients/{patientId}/attachments/category/{category}:
     *   get:
     *     summary: Lista anexos por categoria
     *     tags: [Patient Attachments]
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
     *         name: category
     *         required: true
     *         schema:
     *           type: string
     *         description: Categoria do anexo
     *     responses:
     *       200:
     *         description: Lista de anexos da categoria
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/PatientAttachment'
     *       500:
     *         description: Erro interno do servidor
     */
    getAttachmentsByCategory = async (req, res) => {
        try {
            const { patientId, category } = req.params;
            if (!patientId || !category) {
                return res.status(400).json({ message: "ID do paciente e categoria são obrigatórios" });
            }
            this.logger.info("Listando anexos por categoria", { patientId, category });
            const attachments = await this.service.getAttachmentsByCategory(patientId, category);
            return res.status(200).json(attachments);
        }
        catch (error) {
            this.logger.error("Erro ao listar anexos por categoria", error, { patientId: req.params.patientId, category: req.params.category });
            return res.status(500).json({ message: error.message });
        }
    };
    /**
     * @swagger
     * /patients/{patientId}/attachments/{id}:
     *   get:
     *     summary: Busca anexo específico
     *     tags: [Patient Attachments]
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
     *         description: ID do anexo
     *     responses:
     *       200:
     *         description: Anexo encontrado
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/PatientAttachment'
     *       404:
     *         description: Anexo não encontrado
     *       500:
     *         description: Erro interno do servidor
     */
    getAttachmentById = async (req, res) => {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ message: "ID do anexo é obrigatório" });
            }
            this.logger.info("Buscando anexo por ID", { attachmentId: id });
            const attachment = await this.service.getAttachmentById(id);
            if (!attachment) {
                return res.status(404).json({ message: "Anexo não encontrado" });
            }
            return res.status(200).json(attachment);
        }
        catch (error) {
            this.logger.error("Erro ao buscar anexo", error, { attachmentId: req.params.id });
            return res.status(500).json({ message: error.message });
        }
    };
    /**
     * @swagger
     * /patients/{patientId}/attachments:
     *   post:
     *     summary: Cria novo anexo
     *     tags: [Patient Attachments]
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
     *             $ref: '#/components/schemas/CreatePatientAttachment'
     *     responses:
     *       201:
     *         description: Anexo criado com sucesso
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/PatientAttachment'
     *       400:
     *         description: Dados inválidos
     *       500:
     *         description: Erro interno do servidor
     */
    createAttachment = async (req, res) => {
        try {
            const { patientId } = req.params;
            if (!patientId) {
                return res.status(400).json({ message: "ID do paciente é obrigatório" });
            }
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({ message: "Usuário não autenticado" });
            }
            const file = req.file;
            // Se houver um arquivo físico (Multipart), usamos o fluxo de upload padrão
            if (file) {
                this.logger.info("Criando anexo via upload físico", { patientId, fileName: file.originalname });
                const { category, description } = req.body;
                const attachment = await this.service.uploadAndCreateAttachment(patientId, userId, {
                    buffer: file.buffer,
                    originalname: file.originalname,
                    mimetype: file.mimetype,
                    size: file.size
                }, category, description);
                return res.status(201).json(attachment);
            }
            // Se não houver arquivo, tratamos como criação via metadados JSON (Fluxo antigo/Swagger)
            const attachmentData = { ...req.body, patientId: patientId, userId };
            this.logger.info("Criando anexo via metadados JSON", { patientId, fileName: attachmentData.fileName });
            const attachment = await this.service.createAttachment(attachmentData);
            return res.status(201).json(attachment);
        }
        catch (error) {
            this.logger.error("Erro ao criar anexo", error, { patientId: req.params.patientId });
            return res.status(500).json({ message: error.message });
        }
    };
    /**
     * @swagger
     * /patients/{patientId}/attachments/{id}:
     *   put:
     *     summary: Atualiza anexo
     *     tags: [Patient Attachments]
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
     *         description: ID do anexo
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/UpdatePatientAttachment'
     *     responses:
     *       200:
     *         description: Anexo atualizado com sucesso
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/PatientAttachment'
     *       404:
     *         description: Anexo não encontrado
     *       500:
     *         description: Erro interno do servidor
     */
    updateAttachment = async (req, res) => {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ message: "ID do anexo é obrigatório" });
            }
            this.logger.info("Atualizando anexo", { attachmentId: id });
            const attachment = await this.service.updateAttachment(id, req.body);
            if (!attachment) {
                return res.status(404).json({ message: "Anexo não encontrado" });
            }
            return res.status(200).json(attachment);
        }
        catch (error) {
            this.logger.error("Erro ao atualizar anexo", error, { attachmentId: req.params.id });
            return res.status(500).json({ message: error.message });
        }
    };
    /**
     * @swagger
     * /patients/{patientId}/attachments/{id}:
     *   delete:
     *     summary: Deleta anexo
     *     tags: [Patient Attachments]
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
     *         description: ID do anexo
     *     responses:
     *       204:
     *         description: Anexo deletado com sucesso
     *       404:
     *         description: Anexo não encontrado
     *       500:
     *         description: Erro interno do servidor
     */
    deleteAttachment = async (req, res) => {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ message: "ID do anexo é obrigatório" });
            }
            this.logger.info("Deletando anexo", { attachmentId: id });
            const deleted = await this.service.deleteAttachment(id);
            if (!deleted) {
                return res.status(404).json({ message: "Anexo não encontrado" });
            }
            return res.status(204).send();
        }
        catch (error) {
            this.logger.error("Erro ao deletar anexo", error, { attachmentId: req.params.id });
            return res.status(500).json({ message: error.message });
        }
    };
    /**
     * @swagger
     * /patients/{patientId}/attachments/upload:
     *   post:
     *     summary: Faz upload de um arquivo para o paciente
     *     tags: [Patient Attachments]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: patientId
     *         required: true
     *         schema:
     *           type: string
     *     requestBody:
     *       content:
     *         multipart/form-data:
     *           schema:
     *             type: object
     *             properties:
     *               file:
     *                 type: string
     *                 format: binary
     *               category:
     *                 type: string
     *               description:
     *                 type: string
     *     responses:
     *       201:
     *         description: Upload realizado com sucesso
     *       400:
     *         description: Arquivo não enviado
     *       500:
     *         description: Falha no upload
     */
    uploadAttachment = async (req, res) => {
        try {
            const { patientId } = req.params;
            const file = req.file;
            if (!file) {
                return res.status(400).json({ message: "Arquivo não enviado" });
            }
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({ message: "Usuário não autenticado" });
            }
            this.logger.info("Iniciando upload de anexo", {
                patientId,
                fileName: file.originalname,
                size: file.size
            });
            const { category, description } = req.body;
            const attachment = await this.service.uploadAndCreateAttachment(patientId, userId, {
                buffer: file.buffer,
                originalname: file.originalname,
                mimetype: file.mimetype,
                size: file.size
            }, category, description);
            return res.status(201).json(attachment);
        }
        catch (error) {
            this.logger.error("Erro no controller ao fazer upload", error, {
                patientId: req.params.patientId
            });
            return res.status(500).json({ message: error.message });
        }
    };
}
//# sourceMappingURL=PatientAttachmentController.js.map