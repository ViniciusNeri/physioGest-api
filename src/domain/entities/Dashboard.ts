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
  birthdayList: Array<{
    patientId: string;
    name: string;
    birthDate: Date;
    day: number;
  }>;
  pendingPayments: Array<{
    patientId: string;
    patientName: string;
    amount: number;
    date: Date;
    dueDate?: Date;
  }>;
  overdueAppointments: Array<{
    id: string;
    date: Date;
    time: string;
    patientId: string;
    patientName: string;
    description: string;
  }>;
  occupancyGraph: {
    [hour: number]: number;
  };
}