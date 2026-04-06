import { injectable } from "tsyringe";
import type { IDashboardRepository } from "../../../domain/interfaces/IDashboardRepository.js";
import type { DashboardData } from "../../../domain/entities/Dashboard.js";
import AgendaModel from "../models/AgendaModel.js";
import FinancialModel from "../models/FinancialModel.js";
import PatientFinancialModel from "../models/PatientFinancialModel.js";
import PatientModel from "../models/PatientModel.js";

@injectable()
export class DashboardRepository implements IDashboardRepository {
  async getWeeklyAppointmentsCount(userId: string): Promise<number> {
    const spTodayStr = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo' }).format(new Date());
    const todayLocal = new Date(`${spTodayStr}T12:00:00-03:00`); 

    const startOfWeek = new Date(todayLocal);
    startOfWeek.setHours(0, 0, 0, 0); 
    startOfWeek.setDate(todayLocal.getDate() - todayLocal.getDay());

    const startOfWeekUTC = new Date(`${new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo' }).format(startOfWeek)}T00:00:00-03:00`);

    const endOfWeek = new Date(startOfWeekUTC);
    endOfWeek.setDate(startOfWeekUTC.getDate() + 6);
    const endOfWeekUTC = new Date(`${new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo' }).format(endOfWeek)}T23:59:59-03:00`);

    const query: any = {
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

  async getMonthlyIncome(userId: string): Promise<number> {
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

  async getActivePaymentsCount(userId: string): Promise<number> {
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

  async getTodaysAppointments(userId: string): Promise<DashboardData['todaysAppointments']> {
    const now = new Date();
    const dateStr = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo' }).format(now);
    
    const startOfDay = new Date(`${dateStr}T00:00:00-03:00`);
    const endOfDay = new Date(`${dateStr}T23:59:59-03:00`);

    const query: any = {
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
    .sort({ startDate: 1 })
    .lean({ virtuals: true });

    const formatter = new Intl.DateTimeFormat('pt-BR', { timeZone: 'America/Sao_Paulo', hour: '2-digit', minute: '2-digit' });

    return appointments.map((appointment: any) => ({
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

  async getNextAppointment(userId: string): Promise<DashboardData['nextAppointment']> {
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
    .sort({ startDate: 1 })
    .lean({ virtuals: true });

    if (!appointment) {
      return null;
    }

    const formatter = new Intl.DateTimeFormat('pt-BR', { timeZone: 'America/Sao_Paulo', hour: '2-digit', minute: '2-digit' });
    const app = appointment as any;

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

  async getBirthdayList(userId: string): Promise<DashboardData['birthdayList']> {
    const now = new Date();
    const currentMonth = now.getMonth() + 1; // 1-12

    const patients = await PatientModel.aggregate([
      {
        $match: {
          userId,
          birthDate: { $exists: true, $ne: null }
        }
      },
      {
        $project: {
          id: "$_id",
          name: 1,
          birthDate: 1,
          month: { $month: "$birthDate" },
          day: { $dayOfMonth: "$birthDate" }
        }
      },
      {
        $match: {
          month: currentMonth
        }
      },
      {
        $sort: { day: 1 }
      }
    ]);

    return patients.map(p => ({
      patientId: p.id.toString(),
      name: p.name,
      birthDate: p.birthDate,
      day: p.day
    }));
  }

  async getPendingPayments(userId: string): Promise<DashboardData['pendingPayments']> {
    const pending = await PatientFinancialModel.find({
      userId,
      status: 'pending'
    })
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
    const now = new Date();

    const overdue = await AgendaModel.find({
      userId,
      status: 'scheduled',
      startDate: { $lt: now }
    })
    .populate('patient', 'name')
    .sort({ startDate: -1 })
    .lean({ virtuals: true });

    const formatter = new Intl.DateTimeFormat('pt-BR', { timeZone: 'America/Sao_Paulo', hour: '2-digit', minute: '2-digit' });

    return overdue.map((a: any) => ({
      id: a._id.toString(),
      date: a.startDate,
      time: formatter.format(a.startDate),
      patientId: a.patientId,
      patientName: a.patient?.name || "Desconhecido",
      description: a.description || ""
    }));
  }

  async getOccupancyGraph(userId: string): Promise<DashboardData['occupancyGraph']> {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const appointments = await AgendaModel.aggregate([
      {
        $match: {
          userId,
          startDate: { $gte: startOfMonth }
        }
      },
      {
        $project: {
          hour: { $hour: { date: "$startDate", timezone: "America/Sao_Paulo" } }
        }
      },
      {
        $group: {
          _id: "$hour",
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    const result: { [hour: number]: number } = {};
    appointments.forEach(a => {
      result[a._id] = a.count;
    });

    return result;
  }
}