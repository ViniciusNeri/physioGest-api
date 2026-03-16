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
}
//# sourceMappingURL=IDashboardRepository.d.ts.map