import { injectable } from "tsyringe";
import type { IDashboardRepository } from "../../../domain/interfaces/IDashboardRepository.js";
import type { DashboardData } from "../../../domain/entities/Dashboard.js";
import AgendaModel from "../models/AgendaModel.js";
import FinancialModel from "../models/FinancialModel.js";

@injectable()
export class DashboardRepository implements IDashboardRepository {
  async getWeeklyAppointmentsCount(userId: string): Promise<number> {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay()); // Domingo da semana atual
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Sábado da semana atual
    endOfWeek.setHours(23, 59, 59, 999);

    const count = await AgendaModel.countDocuments({
      userId,
      date: {
        $gte: startOfWeek,
        $lte: endOfWeek
      }
    });

    return count;
  }

  async getMonthlyIncome(userId: string): Promise<number> {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    const result = await FinancialModel.aggregate([
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

    return result.length > 0 ? result[0].total : 0;
  }

  async getActivePaymentsCount(userId: string): Promise<number> {
    // Considera pagamentos ativos como aqueles do mês atual que ainda não foram pagos
    // Como não temos campo de status, vamos contar todos os pagamentos do mês atual
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const count = await FinancialModel.countDocuments({
      userId,
      date: { $gte: startOfMonth }
    });

    return count;
  }

  async getTodaysAppointments(userId: string): Promise<DashboardData['todaysAppointments']> {
    const today = new Date();
    const startOfDay = new Date(today);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);

    const appointments = await AgendaModel.find({
      userId,
      date: {
        $gte: startOfDay,
        $lte: endOfDay
      }
    })
    .select('id date time patientId description')
    .lean()
    .sort({ time: 1 });

    return appointments.map(appointment => ({
      id: appointment.id || appointment._id.toString(),
      date: appointment.date,
      time: appointment.time,
      patientId: appointment.patientId,
      description: appointment.description
    }));
  }

  async getNextAppointment(userId: string): Promise<DashboardData['nextAppointment']> {
    const now = new Date();

    const appointment = await AgendaModel.findOne({
      userId,
      date: { $gte: now }
    })
    .select('id date time patientId description')
    .lean()
    .sort({ date: 1, time: 1 })
    .limit(1);

    if (!appointment) {
      return null;
    }

    return {
      id: appointment.id || appointment._id.toString(),
      date: appointment.date,
      time: appointment.time,
      patientId: appointment.patientId,
      description: appointment.description
    };
  }
}