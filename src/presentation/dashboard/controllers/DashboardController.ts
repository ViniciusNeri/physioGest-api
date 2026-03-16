import type { Request, Response } from "express";
import { container } from "tsyringe";
import type { IDashboardService } from "../../../domain/services/IDashboardService.js";
import type { ILogger } from "../../../infrastructure/logging/Logger.js";

export class DashboardController {
  private service: IDashboardService;
  private logger: ILogger;

  constructor() {
    this.service = container.resolve<IDashboardService>("IDashboardService");
    this.logger = container.resolve<ILogger>("Logger");
  }

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
  getDashboard = async (req: Request, res: Response) => {
    try {
      // O userId vem do token JWT (middleware de autenticação)
      const userId = (req as any).user?.id;

      if (!userId) {
        return res.status(401).json({ message: "Usuário não autenticado" });
      }

      this.logger.info(`Buscando dados do dashboard para usuário: ${userId}`);
      const dashboardData = await this.service.getDashboardData(userId);
      return res.status(200).json(dashboardData);
    } catch (error: any) {
      this.logger.error("Erro ao buscar dados do dashboard", error);
      return res.status(500).json({ message: error.message });
    }
  }
}

export const dashboardController = new DashboardController();