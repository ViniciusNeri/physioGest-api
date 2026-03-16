import type { Request, Response } from "express";
export declare class PatientAgendaController {
    private service;
    private logger;
    constructor();
    /**
     * @swagger
     * /patients/{patientId}/agenda:
     *   get:
     *     summary: Lista agenda do paciente
     *     tags: [Patient Agenda]
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
     *         description: Lista de agendamentos do paciente
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/PatientAgenda'
     *       500:
     *         description: Erro interno do servidor
     */
    getPatientAgenda: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    /**
     * @swagger
     * /patients/{patientId}/agenda/upcoming:
     *   get:
     *     summary: Lista próximos agendamentos do paciente
     *     tags: [Patient Agenda]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: patientId
     *         required: true
     *         schema:
     *           type: string
     *         description: ID do paciente
     *       - in: query
     *         name: limit
     *         schema:
     *           type: integer
     *           default: 10
     *         description: Número máximo de agendamentos
     *     responses:
     *       200:
     *         description: Lista de próximos agendamentos
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/PatientAgenda'
     *       500:
     *         description: Erro interno do servidor
     */
    getUpcomingAgenda: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    /**
     * @swagger
     * /patients/{patientId}/agenda/{id}:
     *   get:
     *     summary: Busca agendamento específico
     *     tags: [Patient Agenda]
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
     *         description: ID do agendamento
     *     responses:
     *       200:
     *         description: Agendamento encontrado
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/PatientAgenda'
     *       404:
     *         description: Agendamento não encontrado
     *       500:
     *         description: Erro interno do servidor
     */
    getAgendaById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    /**
     * @swagger
     * /patients/{patientId}/agenda:
     *   post:
     *     summary: Cria novo agendamento
     *     tags: [Patient Agenda]
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
     *             $ref: '#/components/schemas/CreatePatientAgenda'
     *     responses:
     *       201:
     *         description: Agendamento criado com sucesso
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/PatientAgenda'
     *       400:
     *         description: Dados inválidos
     *       500:
     *         description: Erro interno do servidor
     */
    createAgenda: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    /**
     * @swagger
     * /patients/{patientId}/agenda/{id}:
     *   put:
     *     summary: Atualiza agendamento
     *     tags: [Patient Agenda]
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
     *         description: ID do agendamento
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/UpdatePatientAgenda'
     *     responses:
     *       200:
     *         description: Agendamento atualizado com sucesso
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/PatientAgenda'
     *       404:
     *         description: Agendamento não encontrado
     *       500:
     *         description: Erro interno do servidor
     */
    updateAgenda: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    /**
     * @swagger
     * /patients/{patientId}/agenda/{id}:
     *   delete:
     *     summary: Deleta agendamento
     *     tags: [Patient Agenda]
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
     *         description: ID do agendamento
     *     responses:
     *       204:
     *         description: Agendamento deletado com sucesso
     *       404:
     *         description: Agendamento não encontrado
     *       500:
     *         description: Erro interno do servidor
     */
    deleteAgenda: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=PatientAgendaController.d.ts.map