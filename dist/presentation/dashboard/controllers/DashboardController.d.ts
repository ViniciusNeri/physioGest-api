import type { Request, Response } from "express";
export declare class DashboardController {
    private service;
    private logger;
    constructor();
    /**
     * @swagger
     * /dashboard:
     *   get:
     *     summary: Busca os dados do dashboard
     *     tags: [Dashboard]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Dados do dashboard
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 weeklyAppointments:
     *                   type: integer
     *                   description: Número de atendimentos da semana
     *                 monthlyIncome:
     *                   type: number
     *                   description: Consolidado de entradas de pagamentos no mês atual
     *                 activePayments:
     *                   type: integer
     *                   description: Quantidade de pagamentos ativos
     *                 todaysAppointments:
     *                   type: array
     *                   description: Agendamentos de hoje
     *                   items:
     *                     type: object
     *                     properties:
     *                       id:
     *                         type: string
     *                       date:
     *                         type: string
     *                         format: date-time
     *                       time:
     *                         type: string
     *                       patientId:
     *                         type: string
     *                       description:
     *                         type: string
     *                 nextAppointment:
     *                   type: object
     *                   nullable: true
     *                   description: Próximo atendimento
     *                   properties:
     *                     id:
     *                       type: string
     *                     date:
     *                       type: string
     *                       format: date-time
     *                     time:
     *                       type: string
     *                     patientId:
     *                       type: string
     *                     description:
     *                       type: string
     *       500:
     *         description: Erro interno do servidor
     */
    getDashboard: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
}
export declare const dashboardController: DashboardController;
//# sourceMappingURL=DashboardController.d.ts.map