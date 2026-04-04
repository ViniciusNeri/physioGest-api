var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { injectable } from "tsyringe";
import AgendaModel from "../models/AgendaModel.js";
import FinancialModel from "../models/FinancialModel.js";
import PatientFinancialModel from "../models/PatientFinancialModel.js";
let DashboardRepository = class DashboardRepository {
    async getWeeklyAppointmentsCount(userId) {
        const now = new Date();
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay()); // Domingo da semana atual
        startOfWeek.setHours(0, 0, 0, 0);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6); // Sábado da semana atual
        endOfWeek.setHours(23, 59, 59, 999);
        const count = await AgendaModel.countDocuments({
            userId,
            status: { $nin: ['cancelled', 'no_show'] },
            startDate: {
                $gte: startOfWeek,
                $lte: endOfWeek
            }
        });
        return count;
    }
    async getMonthlyIncome(userId) {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
        const generalIncomePromise = FinancialModel.aggregate([
            {
                $match: {
                    userId,
                    type: 'income',
                    date: {
                        $gte: startOfMonth,
                        $lte: endOfMonth
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$amount' }
                }
            }
        ]);
        const patientIncomePromise = PatientFinancialModel.aggregate([
            {
                $match: {
                    userId,
                    type: 'income',
                    status: 'paid',
                    date: {
                        $gte: startOfMonth,
                        $lte: endOfMonth
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$amount' }
                }
            }
        ]);
        const [generalIncome, patientIncome] = await Promise.all([generalIncomePromise, patientIncomePromise]);
        const generalTotal = generalIncome.length > 0 ? generalIncome[0].total : 0;
        const patientTotal = patientIncome.length > 0 ? patientIncome[0].total : 0;
        return generalTotal + patientTotal;
    }
    async getActivePaymentsCount(userId) {
        // Considera pagamentos ativos como aqueles do mês atual (ou vencidos) que ainda não foram pagos
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const generalCountPromise = FinancialModel.countDocuments({
            userId,
            date: { $gte: startOfMonth }
        });
        const patientCountPromise = PatientFinancialModel.countDocuments({
            userId,
            status: 'pending',
            $or: [
                { dueDate: { $lte: now } },
                { date: { $gte: startOfMonth } }
            ]
        });
        const [generalCount, patientCount] = await Promise.all([generalCountPromise, patientCountPromise]);
        return generalCount + patientCount;
    }
    async getTodaysAppointments(userId) {
        const today = new Date();
        const startOfDay = new Date(today);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(today);
        endOfDay.setHours(23, 59, 59, 999);
        const appointments = await AgendaModel.find({
            userId,
            status: { $nin: ['cancelled', 'no_show'] },
            startDate: {
                $gte: startOfDay,
                $lte: endOfDay
            }
        })
            .populate('patient', 'name')
            .select('id startDate patientId categoryId description patient')
            .lean({ virtuals: true })
            .sort({ startDate: 1 });
        const formatter = new Intl.DateTimeFormat('pt-BR', { timeZone: 'America/Sao_Paulo', hour: '2-digit', minute: '2-digit' });
        return appointments.map((appointment) => ({
            id: appointment.id || appointment._id.toString(),
            date: appointment.startDate,
            time: formatter.format(appointment.startDate),
            patientId: appointment.patientId,
            patientName: appointment.patient?.name || "",
            categoryId: appointment.categoryId || "",
            description: appointment.description || ""
        }));
    }
    async getNextAppointment(userId) {
        const now = new Date();
        const appointment = await AgendaModel.findOne({
            userId,
            status: { $nin: ['cancelled', 'no_show'] },
            startDate: { $gte: now }
        })
            .populate('patient', 'name')
            .select('id startDate patientId categoryId description patient')
            .lean({ virtuals: true })
            .sort({ startDate: 1 })
            .limit(1);
        if (!appointment) {
            return null;
        }
        const formatter = new Intl.DateTimeFormat('pt-BR', { timeZone: 'America/Sao_Paulo', hour: '2-digit', minute: '2-digit' });
        return {
            id: appointment.id || appointment._id.toString(),
            date: appointment.startDate,
            time: formatter.format(appointment.startDate),
            patientId: appointment.patientId,
            patientName: appointment.patient?.name || "",
            categoryId: appointment.categoryId || "",
            description: appointment.description || ""
        };
    }
};
DashboardRepository = __decorate([
    injectable()
], DashboardRepository);
export { DashboardRepository };
//# sourceMappingURL=DashboardRepository.js.map