import type { Request, Response } from "express";
export declare class PatientAnamnesisController {
    private service;
    private logger;
    constructor();
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
    getPatientAnamnesis: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
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
    getLatestAnamnesis: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
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
    getAnamnesisById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
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
    createAnamnesis: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
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
    updateAnamnesis: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
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
    deleteAnamnesis: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=PatientAnamnesisController.d.ts.map