var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { injectable, inject } from "tsyringe";
import logger from "../../infrastructure/logging/Logger.js";
let DashboardService = class DashboardService {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async getDashboardData(userId) {
        logger.debug("Buscando dados do dashboard", { userId });
        try {
            const [weeklyAppointments, monthlyIncome, activePayments, todaysAppointments, nextAppointment] = await Promise.all([
                this.repository.getWeeklyAppointmentsCount(userId),
                this.repository.getMonthlyIncome(userId),
                this.repository.getActivePaymentsCount(userId),
                this.repository.getTodaysAppointments(userId),
                this.repository.getNextAppointment(userId)
            ]);
            const dashboardData = {
                weeklyAppointments,
                monthlyIncome,
                activePayments,
                todaysAppointments,
                nextAppointment
            };
            logger.info("Dados do dashboard obtidos com sucesso", {
                userId,
                weeklyAppointments,
                monthlyIncome,
                activePayments,
                todaysAppointmentsCount: todaysAppointments.length,
                hasNextAppointment: nextAppointment !== null
            });
            return dashboardData;
        }
        catch (error) {
            logger.error("Erro ao buscar dados do dashboard", error, { userId });
            throw error;
        }
    }
};
DashboardService = __decorate([
    injectable(),
    __param(0, inject("IDashboardRepository")),
    __metadata("design:paramtypes", [Object])
], DashboardService);
export { DashboardService };
//# sourceMappingURL=DashboardService.js.map