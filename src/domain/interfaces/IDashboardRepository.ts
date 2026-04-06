import type { DashboardData } from "../entities/Dashboard.js";

export interface IDashboardRepository {
  /**
   * Busca o número de atendimentos da semana atual para um usuário
   * @param userId - ID do usuário
   * @returns Número de atendimentos
   */
  getWeeklyAppointmentsCount(userId: string): Promise<number>;

  /**
   * Busca o consolidado de entradas de pagamentos no mês atual para um usuário
   * @param userId - ID do usuário
   * @returns Valor total das entradas
   */
  getMonthlyIncome(userId: string): Promise<number>;

  /**
   * Busca a quantidade de pagamentos ativos para um usuário
   * @param userId - ID do usuário
   * @returns Número de pagamentos ativos
   */
  getActivePaymentsCount(userId: string): Promise<number>;

  /**
   * Busca os agendamentos de hoje para um usuário
   * @param userId - ID do usuário
   * @returns Lista de agendamentos do dia
   */
  getTodaysAppointments(userId: string): Promise<DashboardData['todaysAppointments']>;

  /**
   * Busca o próximo atendimento para um usuário
   * @param userId - ID do usuário
   * @returns Próximo atendimento ou null
   */
  getNextAppointment(userId: string): Promise<DashboardData['nextAppointment']>;

  /**
   * Busca aniversariantes do mês para um usuário
   * @param userId - ID do usuário
   * @returns Lista de aniversariantes
   */
  getBirthdayList(userId: string): Promise<DashboardData['birthdayList']>;

  /**
   * Busca pagamentos pendentes para um usuário
   * @param userId - ID do usuário
   * @returns Lista de pagamentos pendentes
   */
  getPendingPayments(userId: string): Promise<DashboardData['pendingPayments']>;

  /**
   * Busca agendamentos atrasados (passaram da data mas continuam agendados)
   * @param userId - ID do usuário
   * @returns Lista de agendamentos atrasados
   */
  getOverdueAppointments(userId: string): Promise<DashboardData['overdueAppointments']>;

  /**
   * Busca dados do gráfico de ocupação por hora
   * @param userId - ID do usuário
   * @returns Objeto com contagem por hora
   */
  getOccupancyGraph(userId: string): Promise<DashboardData['occupancyGraph']>;
}