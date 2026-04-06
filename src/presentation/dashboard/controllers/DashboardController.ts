import type { Request, Response } from "express";
import { container } from "tsyringe";
import type { IDashboardService } from "../../../domain/services/IDashboardService.js";
import type { ILogger } from "../../../infrastructure/logging/Logger.js";
import { convertDashboardDates } from "../../../utils/dateUtils.js";

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
   *     summary: Busca os dados completos do dashboard
   *     tags: [Dashboard]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Dados do dashboard expandidos
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 weeklyAppointments: { type: integer }
   *                 monthlyIncome: { type: number }
   *                 activePayments: { type: integer }
   *                 todaysAppointments: { type: array, items: { type: object } }
   *                 nextAppointment: { type: object, nullable: true }
   *                 birthdayList: { type: array, items: { type: object } }
   *                 pendingPayments: { type: array, items: { type: object } }
   *                 overdueAppointments: { type: array, items: { type: object } }
   *                 occupancyGraph: { type: object }
   */
  getDashboard = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Usuário não autenticado" });
      }

      this.logger.info(`Buscando dados do dashboard para usuário: ${userId}`);
      const dashboardData = await this.service.getDashboardData(userId);
      return res.status(200).json(convertDashboardDates(dashboardData));
    } catch (error: any) {
      this.logger.error("Erro ao buscar dados do dashboard", error);
      return res.status(500).json({ message: error.message });
    }
  }
}

export const dashboardController = new DashboardController();