import { container } from "tsyringe";
export class PatientAnamnesisController {
    service;
    logger;
    constructor() {
        this.service = container.resolve("IPatientAnamnesisService");
        this.logger = container.resolve("Logger");
    }
    /**
     * @swagger
     * /patients/{patientId}/anamnesis:
     *   get:
     *     summary: Lista anamneses do paciente
     *     tags: [Patient Anamnesis]
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
     *         description: Lista de anamneses do paciente
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/PatientAnamnesis'
     *       500:
     *         description: Erro interno do servidor
     */
    getPatientAnamnesis = async (req, res) => {
        try {
            const { patientId } = req.params;
            if (!patientId) {
                return res.status(400).json({ message: "ID do paciente é obrigatório" });
            }
            this.logger.info("Listando anamneses do paciente", { patientId });
            const anamnesis = await this.service.getPatientAnamnesis(patientId);
            return res.status(200).json(anamnesis);
        }
        catch (error) {
            this.logger.error("Erro ao listar anamneses do paciente", error, { patientId: req.params.patientId });
            return res.status(500).json({ message: error.message });
        }
    };
    /**
     * @swagger
     * /patients/{patientId}/anamnesis/latest:
     *   get:
     *     summary: Busca última anamnese do paciente
     *     tags: [Patient Anamnesis]
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
     *         description: Última anamnese encontrada
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/PatientAnamnesis'
     *       404:
     *         description: Nenhuma anamnese encontrada
     *       500:
     *         description: Erro interno do servidor
     */
    getLatestAnamnesis = async (req, res) => {
        try {
            const { patientId } = req.params;
            if (!patientId) {
                return res.status(400).json({ message: "ID do paciente é obrigatório" });
            }
            this.logger.info("Buscando última anamnese do paciente", { patientId });
            const anamnesis = await this.service.getLatestAnamnesis(patientId);
            if (!anamnesis) {
                return res.status(404).json({ message: "Nenhuma anamnese encontrada" });
            }
            return res.status(200).json(anamnesis);
        }
        catch (error) {
            this.logger.error("Erro ao buscar última anamnese", error, { patientId: req.params.patientId });
            return res.status(500).json({ message: error.message });
        }
    };
    /**
     * @swagger
     * /patients/{patientId}/anamnesis/{id}:
     *   get:
     *     summary: Busca anamnese específica
     *     tags: [Patient Anamnesis]
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
     *         description: ID da anamnese
     *     responses:
     *       200:
     *         description: Anamnese encontrada
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/PatientAnamnesis'
     *       404:
     *         description: Anamnese não encontrada
     *       500:
     *         description: Erro interno do servidor
     */
    getAnamnesisById = async (req, res) => {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ message: "ID da anamnese é obrigatório" });
            }
            this.logger.info("Buscando anamnese por ID", { anamnesisId: id });
            const anamnesis = await this.service.getAnamnesisById(id);
            if (!anamnesis) {
                return res.status(404).json({ message: "Anamnese não encontrada" });
            }
            return res.status(200).json(anamnesis);
        }
        catch (error) {
            this.logger.error("Erro ao buscar anamnese", error, { anamnesisId: req.params.id });
            return res.status(500).json({ message: error.message });
        }
    };
    /**
     * @swagger
     * /patients/{patientId}/anamnesis:
     *   post:
     *     summary: Cria nova anamnese
     *     tags: [Patient Anamnesis]
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
     *             $ref: '#/components/schemas/CreatePatientAnamnesis'
     *     responses:
     *       201:
     *         description: Anamnese criada com sucesso
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/PatientAnamnesis'
     *       400:
     *         description: Dados inválidos
     *       500:
     *         description: Erro interno do servidor
     */
    createAnamnesis = async (req, res) => {
        try {
            const { patientId } = req.params;
            const anamnesisData = { ...req.body, patientId, userId: req.user?.id };
            this.logger.info("Criando anamnese", { patientId });
            const anamnesis = await this.service.createAnamnesis(anamnesisData);
            return res.status(201).json(anamnesis);
        }
        catch (error) {
            this.logger.error("Erro ao criar anamnese", error, { patientId: req.params.patientId });
            return res.status(500).json({ message: error.message });
        }
    };
    /**
     * @swagger
     * /patients/{patientId}/anamnesis/{id}:
     *   put:
     *     summary: Atualiza anamnese
     *     tags: [Patient Anamnesis]
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
     *         description: ID da anamnese
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/UpdatePatientAnamnesis'
     *     responses:
     *       200:
     *         description: Anamnese atualizada com sucesso
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/PatientAnamnesis'
     *       404:
     *         description: Anamnese não encontrada
     *       500:
     *         description: Erro interno do servidor
     */
    updateAnamnesis = async (req, res) => {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ message: "ID da anamnese é obrigatório" });
            }
            this.logger.info("Atualizando anamnese", { anamnesisId: id });
            const updates = req.body;
            const anamnesis = await this.service.updateAnamnesis(id, updates);
            if (!anamnesis) {
                return res.status(404).json({ message: "Anamnese não encontrada" });
            }
            return res.status(200).json(anamnesis);
        }
        catch (error) {
            this.logger.error("Erro ao atualizar anamnese", error, { anamnesisId: req.params.id });
            return res.status(500).json({ message: error.message });
        }
    };
    /**
     * @swagger
     * /patients/{patientId}/anamnesis/{id}:
     *   delete:
     *     summary: Deleta anamnese
     *     tags: [Patient Anamnesis]
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
     *         description: ID da anamnese
     *     responses:
     *       204:
     *         description: Anamnese deletada com sucesso
     *       404:
     *         description: Anamnese não encontrada
     *       500:
     *         description: Erro interno do servidor
     */
    deleteAnamnesis = async (req, res) => {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ message: "ID da anamnese é obrigatório" });
            }
            this.logger.info("Deletando anamnese", { anamnesisId: id });
            const deleted = await this.service.deleteAnamnesis(id);
            if (!deleted) {
                return res.status(404).json({ message: "Anamnese não encontrada" });
            }
            return res.status(204).send();
        }
        catch (error) {
            this.logger.error("Erro ao deletar anamnese", error, { anamnesisId: req.params.id });
            return res.status(500).json({ message: error.message });
        }
    };
}
//# sourceMappingURL=PatientAnamnesisController.js.map