import { injectable } from "tsyringe";
import type { IDashboardRepository } from "../../../domain/interfaces/IDashboardRepository.js";
import type { DashboardData } from "../../../domain/entities/Dashboard.js";
import AgendaModel from "../models/AgendaModel.js";
import FinancialModel from "../models/FinancialModel.js";
import PatientFinancialModel from "../models/PatientFinancialModel.js";
import PatientModel from "../models/PatientModel.js";
import { getNaiveNow } from "../../../utils/dateUtils.js";

@injectable()
export class DashboardRepository implements IDashboardRepository {
  async getWeeklyAppointmentsCount(userId: string): Promise<number> {
    const nowLocal = getNaiveNow(); // Default SP
    const startOfWeek = new Date(nowLocal);
    startOfWeek.setUTCHours(0, 0, 0, 0);
    startOfWeek.setUTCDate(nowLocal.getUTCDate() - nowLocal.getUTCDay());

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setUTCDate(startOfWeek.getUTCDate() + 6);
    endOfWeek.setUTCHours(23, 59, 59, 999);

    return AgendaModel.countDocuments({
      userId,
      startDate: { $gte: startOfWeek, $lte: endOfWeek }
    });
  }

  async getMonthlyIncome(userId: string): Promise<number> {
    const now = getNaiveNow();
    const startOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0));
    const endOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0, 23, 59, 59));

    const [generalIncome, patientIncome] = await Promise.all([
      FinancialModel.aggregate([
        { $match: { userId, type: 'income', date: { $gte: startOfMonth, $lte: endOfMonth } } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      PatientFinancialModel.aggregate([
        { $match: { userId, type: 'income', status: 'paid', date: { $gte: startOfMonth, $lte: endOfMonth } } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ])
    ]);

    const generalTotal = generalIncome.length > 0 ? generalIncome[0].total : 0;
    const patientTotal = patientIncome.length > 0 ? patientIncome[0].total : 0;

    return generalTotal + patientTotal;
  }

  async getActivePaymentsCount(userId: string): Promise<number> {
    const now = getNaiveNow();
    const startOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0));

    return PatientFinancialModel.countDocuments({
      userId,
      status: 'pending',
      $or: [
        { dueDate: { $lte: now } },
        { date: { $gte: startOfMonth } }
      ]
    });
  }

  async getTodaysAppointments(userId: string): Promise<DashboardData['todaysAppointments']> {
    const now = getNaiveNow();
    const startOfDay = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0));
    const endOfDay = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 23, 59, 59));

    const appointments = await AgendaModel.find({
      userId,
      startDate: { $gte: startOfDay, $lte: endOfDay }
    })
    .populate('patient', 'name')
    .populate('category', 'name')
    .sort({ startDate: 1 })
    .lean({ virtuals: true });

    return appointments.map((appointment: any) => ({
      id: appointment.id || appointment._id.toString(),
      date: appointment.startDate,
      time: appointment.startDate.getUTCHours().toString().padStart(2, '0') + ':' + appointment.startDate.getUTCMinutes().toString().padStart(2, '0'),
      patientId: appointment.patientId,
      patientName: appointment.patient?.name || "",
      categoryId: appointment.categoryId || "",
      categoryName: appointment.category?.name || "",
      status: appointment.status || "scheduled",
      description: appointment.description || "",
      notes: appointment.notes || ""
    }));
  }

  async getNextAppointment(userId: string): Promise<DashboardData['nextAppointment']> {
    const now = getNaiveNow();

    const appointment = await AgendaModel.findOne({
      userId,
      status: 'scheduled',
      startDate: { $gte: now }
    })
    .populate('patient', 'name')
    .populate('category', 'name')
    .sort({ startDate: 1 })
    .lean({ virtuals: true });

    if (!appointment) return null;

    const app = appointment as any;
    return {
      id: app.id || app._id.toString(),
      date: app.startDate,
      time: app.startDate.getUTCHours().toString().padStart(2, '0') + ':' + app.startDate.getUTCMinutes().toString().padStart(2, '0'),
      patientId: app.patientId,
      patientName: app.patient?.name || "",
      categoryId: app.categoryId || "",
      categoryName: app.category?.name || "",
      status: app.status || "scheduled",
      description: app.description || "",
      notes: app.notes || ""
    };
  }

  async getBirthdayList(userId: string): Promise<DashboardData['birthdayList']> {
    const now = getNaiveNow();
    const currentMonth = now.getUTCMonth() + 1;

    const patients = await PatientModel.aggregate([
      { $match: { userId, birthDate: { $exists: true, $ne: null } } },
      {
        $project: {
          id: "$_id",
          name: 1,
          birthDate: 1,
          month: { $month: "$birthDate" },
          day: { $dayOfMonth: "$birthDate" }
        }
      },
      { $match: { month: currentMonth } },
      { $sort: { day: 1 } }
    ]);

    return patients.map(p => ({
      patientId: p.id.toString(),
      name: p.name,
      birthDate: p.birthDate,
      day: p.day
    }));
  }

  async getPendingPayments(userId: string): Promise<DashboardData['pendingPayments']> {
    const pending = await PatientFinancialModel.find({ userId, status: 'pending' })
    .populate('patient', 'name')
    .sort({ date: -1 })
    .lean({ virtuals: true });

    return pending.map((p: any) => ({
      patientId: p.patientId,
      patientName: p.patient?.name || "Paciente Removido",
      amount: p.amount,
      date: p.date,
      dueDate: p.dueDate
    }));
  }

  async getOverdueAppointments(userId: string): Promise<DashboardData['overdueAppointments']> {
    const now = getNaiveNow();

    const overdue = await AgendaModel.find({
      userId,
      status: 'scheduled',
      startDate: { $lt: now }
    })
    .populate('patient', 'name')
    .sort({ startDate: -1 })
    .lean({ virtuals: true });

    return overdue.map((a: any) => ({
      id: a.id || a._id.toString(),
      date: a.startDate,
      time: a.startDate.getUTCHours().toString().padStart(2, '0') + ':' + a.startDate.getUTCMinutes().toString().padStart(2, '0'),
      patientId: a.patientId,
      patientName: a.patient?.name || "Desconhecido",
      description: a.description || ""
    }));
  }

  async getOccupancyGraph(userId: string): Promise<DashboardData['occupancyGraph']> {
    const now = getNaiveNow();
    const startOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));

    const appointments = await AgendaModel.aggregate([
      { $match: { userId, startDate: { $gte: startOfMonth } } },
      { $project: { hour: { $hour: "$startDate" } } },
      { $group: { _id: "$hour", count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    const result: { [hour: number]: number } = {};
    appointments.forEach(a => { result[a._id] = a.count; });
    return result;
  }
}