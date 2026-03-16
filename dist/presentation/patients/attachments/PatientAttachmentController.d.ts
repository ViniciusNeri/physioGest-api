import type { Request, Response } from "express";
export declare class PatientAttachmentController {
    private service;
    private logger;
    constructor();
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
    getPatientAttachments: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
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
    getAttachmentsByCategory: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
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
    getAttachmentById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
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
    createAttachment: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
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
    updateAttachment: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
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
    deleteAttachment: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=PatientAttachmentController.d.ts.map