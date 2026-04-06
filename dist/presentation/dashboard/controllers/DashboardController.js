import { container } from "tsyringe";
import { convertDashboardDates } from "../../../utils/dateUtils.js";
export class DashboardController {
    service;
    logger;
    constructor() {
        this.service = container.resolve("IDashboardService");
        this.logger = container.resolve("Logger");
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
    getDashboard = async (req, res) => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({ message: "Usuário não autenticado" });
            }
            this.logger.info(`Buscando dados do dashboard para usuário: ${userId}`);
            const dashboardData = await this.service.getDashboardData(userId);
            return res.status(200).json(convertDashboardDates(dashboardData));
        }
        catch (error) {
            this.logger.error("Erro ao buscar dados do dashboard", error);
            return res.status(500).json({ message: error.message });
        }
    };
}
export const dashboardController = new DashboardController();
//# sourceMappingURL=DashboardController.js.map