import type { IDashboardRepository } from "../../../domain/interfaces/IDashboardRepository.js";
import type { DashboardData } from "../../../domain/entities/Dashboard.js";
export declare class DashboardRepository implements IDashboardRepository {
    getWeeklyAppointmentsCount(userId: string): Promise<number>;
    getMonthlyIncome(userId: string): Promise<number>;
    getActivePaymentsCount(userId: string): Promise<number>;
    getTodaysAppointments(userId: string): Promise<DashboardData['todaysAppointments']>;
    getNextAppointment(userId: string): Promise<DashboardData['nextAppointment']>;
}
//# sourceMappingURL=DashboardRepository.d.ts.map