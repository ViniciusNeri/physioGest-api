export interface DashboardData {
  weeklyAppointments: number;
  monthlyIncome: number;
  activePayments: number;
  todaysAppointments: Array<{
    id: string;
    date: Date;
    time: string;
    patientId: string;
    patientName?: string;
    categoryId?: string;
    description: string;
  }>;
  nextAppointment: {
    id: string;
    date: Date;
    time: string;
    patientId: string;
    patientName?: string;
    categoryId?: string;
    description: string;
  } | null;
}