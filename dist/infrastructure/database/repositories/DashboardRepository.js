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
import PatientModel from "../models/PatientModel.js";
import { getNaiveNowString, getLocalDayRange, getLocalMonthRange, } from "../../../utils/dateUtils.js";
let DashboardRepository = class DashboardRepository {
    async getWeeklyAppointmentsCount(userId) {
        const nowStr = getNaiveNowString();
        const datePart = nowStr.substring(0, 10); // "YYYY-MM-DD"
        const d = new Date(datePart + 'T12:00:00Z');
        const dayOfWeek = d.getUTCDay(); // 0=Sun
        // Start of week (Sunday)
        const startOfWeek = new Date(d);
        startOfWeek.setUTCDate(d.getUTCDate() - dayOfWeek);
        const startStr = startOfWeek.toISOString().substring(0, 10) + 'T00:00:00';
        // End of week (Saturday)
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setUTCDate(startOfWeek.getUTCDate() + 6);
        const endStr = endOfWeek.toISOString().substring(0, 10) + 'T23:59:59';
        return AgendaModel.countDocuments({
            userId,
            startDate: { $gte: startStr, $lte: endStr }
        });
    }
    async getMonthlyIncome(userId) {
        const nowStr = getNaiveNowString();
        const month = parseInt(nowStr.substring(5, 7));
        const year = parseInt(nowStr.substring(0, 4));
        const { start, end } = getLocalMonthRange(month, year);
        const [generalIncome, patientIncome] = await Promise.all([
            FinancialModel.aggregate([
                { $match: { userId, type: 'income', date: { $gte: start, $lte: end } } },
                { $group: { _id: null, total: { $sum: '$amount' } } }
            ]),
            PatientFinancialModel.aggregate([
                { $match: { userId, type: 'income', status: 'paid', date: { $gte: start, $lte: end } } },
                { $group: { _id: null, total: { $sum: '$amount' } } }
            ])
        ]);
        const generalTotal = generalIncome.length > 0 ? generalIncome[0].total : 0;
        const patientTotal = patientIncome.length > 0 ? patientIncome[0].total : 0;
        return generalTotal + patientTotal;
    }
    async getActivePaymentsCount(userId) {
        const nowStr = getNaiveNowString();
        const month = parseInt(nowStr.substring(5, 7));
        const year = parseInt(nowStr.substring(0, 4));
        const { start } = getLocalMonthRange(month, year);
        return PatientFinancialModel.countDocuments({
            userId,
            status: 'pending',
            $or: [
                { dueDate: { $lte: nowStr } },
                { date: { $gte: start } }
            ]
        });
    }
    async getTodaysAppointments(userId) {
        const nowStr = getNaiveNowString();
        const datePart = nowStr.substring(0, 10);
        const { start, end } = getLocalDayRange(datePart);
        const appointments = await AgendaModel.find({
            userId,
            startDate: { $gte: start, $lte: end }
        })
            .populate('patient', 'name')
            .populate('category', 'name')
            .sort({ startDate: 1 })
            .lean({ virtuals: true });
        return appointments.map((appointment) => ({
            id: appointment.id || appointment._id.toString(),
            date: appointment.startDate,
            time: appointment.startDate?.substring(11, 16) ?? '',
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
        const nowStr = getNaiveNowString();
        const appointment = await AgendaModel.findOne({
            userId,
            status: 'scheduled',
            startDate: { $gte: nowStr }
        })
            .populate('patient', 'name')
            .populate('category', 'name')
            .sort({ startDate: 1 })
            .lean({ virtuals: true });
        if (!appointment)
            return null;
        const app = appointment;
        return {
            id: app.id || app._id.toString(),
            date: app.startDate,
            time: app.startDate?.substring(11, 16) ?? '',
            patientId: app.patientId,
            patientName: app.patient?.name || "",
            categoryId: app.categoryId || "",
            categoryName: app.category?.name || "",
            status: app.status || "scheduled",
            description: app.description || "",
            notes: app.notes || ""
        };
    }
    async getBirthdayList(userId) {
        const nowStr = getNaiveNowString();
        const currentMonth = nowStr.substring(5, 7); // "MM"
        // birthDate stored as string "YYYY-MM-DD..." — use $substr for month comparison
        const patients = await PatientModel.aggregate([
            { $match: { userId, birthDate: { $exists: true, $ne: null, $type: 'string' } } },
            {
                $project: {
                    id: "$_id",
                    name: 1,
                    birthDate: 1,
                    month: { $substr: ["$birthDate", 5, 2] },
                    day: { $substr: ["$birthDate", 8, 2] }
                }
            },
            { $match: { month: currentMonth } },
            { $sort: { day: 1 } }
        ]);
        return patients.map(p => ({
            patientId: p.id.toString(),
            name: p.name,
            birthDate: p.birthDate,
            day: parseInt(p.day)
        }));
    }
    async getPendingPayments(userId) {
        const pending = await PatientFinancialModel.find({ userId, status: 'pending' })
            .populate('patient', 'name')
            .sort({ date: -1 })
            .lean({ virtuals: true });
        return pending.map((p) => ({
            patientId: p.patientId,
            patientName: p.patient?.name || "Paciente Removido",
            amount: p.amount,
            date: p.date,
            dueDate: p.dueDate
        }));
    }
    async getOverdueAppointments(userId) {
        const nowStr = getNaiveNowString();
        const overdue = await AgendaModel.find({
            userId,
            status: 'scheduled',
            startDate: { $lt: nowStr }
        })
            .populate('patient', 'name')
            .sort({ startDate: -1 })
            .lean({ virtuals: true });
        return overdue.map((a) => ({
            id: a.id || a._id.toString(),
            date: a.startDate,
            time: a.startDate?.substring(11, 16) ?? '',
            patientId: a.patientId,
            patientName: a.patient?.name || "Desconhecido",
            description: a.description || ""
        }));
    }
    async getOccupancyGraph(userId) {
        const nowStr = getNaiveNowString();
        const month = nowStr.substring(5, 7);
        const year = nowStr.substring(0, 4);
        const startOfMonth = `${year}-${month}-01T00:00:00`;
        const appointments = await AgendaModel.aggregate([
            { $match: { userId, startDate: { $gte: startOfMonth } } },
            {
                $project: {
                    // Extract hour from string "YYYY-MM-DDTHH:mm:ss" → position 11, length 2
                    hour: { $toInt: { $substr: ["$startDate", 11, 2] } }
                }
            },
            { $group: { _id: "$hour", count: { $sum: 1 } } },
            { $sort: { _id: 1 } }
        ]);
        const result = {};
        appointments.forEach(a => { result[a._id] = a.count; });
        return result;
    }
};
DashboardRepository = __decorate([
    injectable()
], DashboardRepository);
export { DashboardRepository };
//# sourceMappingURL=DashboardRepository.js.map