import type { Request, Response } from "express";
export declare class PatientController {
    private service;
    private logger;
    constructor();
    /**
     * @swagger
     * /patients:
     *   get:
     *     summary: Lista todos os pacientes
     *     tags: [Patients]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Lista de pacientes
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Patient'
     *       500:
     *         description: Erro interno do servidor
     */
    getAll: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    /**
     * @swagger
     * /patients/user/{userId}:
     *   get:
     *     summary: Lista pacientes por usuário
     *     tags: [Patients]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: userId
     *         required: true
     *         schema:
     *           type: string
     *         description: ID do usuário
     *     responses:
     *       200:
     *         description: Lista de pacientes
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Patient'
     *       500:
     *         description: Erro interno do servidor
     */
    getByUserId: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    /**
     * @swagger
     * /patients/{id}:
     *   get:
     *     summary: Busca um paciente por ID
     *     tags: [Patients]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: ID do paciente
     *     responses:
     *       200:
     *         description: Paciente encontrado
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Patient'
     *       404:
     *         description: Paciente não encontrado
     *       500:
     *         description: Erro interno do servidor
     */
    getById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    /**
     * @swagger
     * /patients:
     *   post:
     *     summary: Cria um novo paciente
     *     tags: [Patients]
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
     *               - userId
     *             properties:
     *               name:
     *                 type: string
     *               email:
     *                 type: string
     *                 format: email
     *               phone:
     *                 type: string
     *               birthDate:
     *                 type: string
     *                 format: date
     *               userId:
     *                 type: string
     *     responses:
     *       201:
     *         description: Paciente criado
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Patient'
     *       400:
     *         description: Dados inválidos
     *       500:
     *         description: Erro interno do servidor
     */
    create: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    /**
     * @swagger
     * /patients/{id}:
     *   put:
     *     summary: Atualiza um paciente
     *     tags: [Patients]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: ID do paciente
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
     *               phone:
     *                 type: string
     *               birthDate:
     *                 type: string
     *                 format: date
     *     responses:
     *       200:
     *         description: Paciente atualizado
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Patient'
     *       404:
     *         description: Paciente não encontrado
     *       500:
     *         description: Erro interno do servidor
     */
    update: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    /**
     * @swagger
     * /patients/{id}:
     *   delete:
     *     summary: Deleta um paciente
     *     tags: [Patients]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: ID do paciente
     *     responses:
     *       200:
     *         description: Paciente deletado
     *       404:
     *         description: Paciente não encontrado
     *       500:
     *         description: Erro interno do servidor
     */
    delete: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
}
export declare const patientController: PatientController;
//# sourceMappingURL=PatientController.d.ts.map