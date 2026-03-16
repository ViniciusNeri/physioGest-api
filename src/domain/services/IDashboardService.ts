import type { DashboardData } from "../entities/Dashboard.js";

export interface IDashboardService {
  /**
   * Busca os dados do dashboard para um usuário
   * @param userId - ID do usuário
   * @returns Dados do dashboard
   */
  getDashboardData(userId: string): Promise<DashboardData>;
}