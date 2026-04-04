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
    categoryName?: string;
    status: string;
    description: string;
    notes?: string;
  }>;
  nextAppointment: {
    id: string;
    date: Date;
    time: string;
    patientId: string;
    patientName?: string;
    categoryId?: string;
    categoryName?: string;
    status: string;
    description: string;
    notes?: string;
  } | null;
}