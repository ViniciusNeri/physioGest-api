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
        const spTodayStr = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo' }).format(new Date());
        const todayLocal = new Date(`${spTodayStr}T12:00:00-03:00`); // 12:00 do dia em SP
        const startOfWeek = new Date(todayLocal);
        startOfWeek.setHours(0, 0, 0, 0); // Começa zerado o objeto que representa o dia local
        startOfWeek.setDate(todayLocal.getDate() - todayLocal.getDay());
        // Reinicializar para garantir o 00:00 daquele dia
        const startOfWeekUTC = new Date(`${new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo' }).format(startOfWeek)}T00:00:00-03:00`);
        const endOfWeek = new Date(startOfWeekUTC);
        endOfWeek.setDate(startOfWeekUTC.getDate() + 6);
        const endOfWeekUTC = new Date(`${new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo' }).format(endOfWeek)}T23:59:59-03:00`);
        const query = {
            $or: [
                { userId },
                { userId: null }
            ],
            startDate: {
                $gte: startOfWeekUTC,
                $lte: endOfWeekUTC
            }
        };
        const count = await AgendaModel.countDocuments(query);
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
        // Considera apenas pagamentos pendentes dos pacientes (vencidos ou do mês atual)
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const patientCount = await PatientFinancialModel.countDocuments({
            userId,
            status: 'pending',
            $or: [
                { dueDate: { $lte: now } },
                { date: { $gte: startOfMonth } }
            ]
        });
        return patientCount;
    }
    async getTodaysAppointments(userId) {
        const now = new Date();
        const dateStr = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo' }).format(now);
        // ISO Strings com offset garantem que o Mongoose compare no instante UTC correspondente
        const startOfDay = new Date(`${dateStr}T00:00:00-03:00`);
        const endOfDay = new Date(`${dateStr}T23:59:59-03:00`);
        const query = {
            $or: [
                { userId },
                { userId: null }
            ],
            startDate: {
                $gte: startOfDay,
                $lte: endOfDay
            }
        };
        const appointments = await AgendaModel.find(query)
            .populate('patient', 'name')
            .populate('category', 'name')
            .select('id startDate patientId categoryId description patient status category notes')
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
            categoryName: appointment.category?.name || "",
            status: appointment.status || "scheduled",
            description: appointment.description || "",
            notes: appointment.notes || ""
        }));
    }
    async getNextAppointment(userId) {
        const now = new Date();
        const appointment = await AgendaModel.findOne({
            $or: [
                { userId },
                { userId: null }
            ],
            status: 'scheduled',
            startDate: { $gte: now }
        })
            .populate('patient', 'name')
            .populate('category', 'name')
            .select('id startDate patientId categoryId description patient status category')
            .lean({ virtuals: true })
            .sort({ startDate: 1 });
        if (!appointment) {
            return null;
        }
        const formatter = new Intl.DateTimeFormat('pt-BR', { timeZone: 'America/Sao_Paulo', hour: '2-digit', minute: '2-digit' });
        const app = appointment;
        return {
            id: app.id || app._id.toString(),
            date: app.startDate,
            time: formatter.format(app.startDate),
            patientId: app.patientId,
            patientName: app.patient?.name || "",
            categoryId: app.categoryId || "",
            categoryName: app.category?.name || "",
            status: app.status || "scheduled",
            description: app.description || "",
            notes: app.notes || ""
        };
    }
};
DashboardRepository = __decorate([
    injectable()
], DashboardRepository);
export { DashboardRepository };
//# sourceMappingURL=DashboardRepository.js.map