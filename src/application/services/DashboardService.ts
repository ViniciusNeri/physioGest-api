import { injectable, inject } from "tsyringe";
import type { IDashboardRepository } from "../../domain/interfaces/IDashboardRepository.js";
import type { IDashboardService } from "../../domain/services/IDashboardService.js";
import type { DashboardData } from "../../domain/entities/Dashboard.js";
import logger from "../../infrastructure/logging/Logger.js";

@injectable()
export class DashboardService implements IDashboardService {
  constructor(
    @inject("IDashboardRepository")
    private repository: IDashboardRepository
  ) {}

  async getDashboardData(userId: string): Promise<DashboardData> {
    logger.debug("Buscando dados completos do dashboard", { userId });

    try {
      const [
        weeklyAppointments,
        monthlyIncome,
        activePayments,
        todaysAppointments,
        nextAppointment,
        birthdayList,
        pendingPayments,
        overdueAppointments,
        occupancyGraph
      ] = await Promise.all([
        this.repository.getWeeklyAppointmentsCount(userId),
        this.repository.getMonthlyIncome(userId),
        this.repository.getActivePaymentsCount(userId),
        this.repository.getTodaysAppointments(userId),
        this.repository.getNextAppointment(userId),
        this.repository.getBirthdayList(userId),
        this.repository.getPendingPayments(userId),
        this.repository.getOverdueAppointments(userId),
        this.repository.getOccupancyGraph(userId)
      ]);

      const dashboardData: DashboardData = {
        weeklyAppointments,
        monthlyIncome,
        activePayments,
        todaysAppointments,
        nextAppointment,
        birthdayList,
        pendingPayments,
        overdueAppointments,
        occupancyGraph
      };

      logger.info("Dados do dashboard obtidos com sucesso", {
        userId,
        weeklyAppointments,
        monthlyIncome,
        activePayments,
        todaysCount: todaysAppointments.length,
        birthdaysCount: birthdayList.length,
        pendingCount: pendingPayments.length,
        overdueCount: overdueAppointments.length
      });

      return dashboardData;
    } catch (error) {
      logger.error("Erro ao buscar dados do dashboard", error, { userId });
      throw error;
    }
  }
}