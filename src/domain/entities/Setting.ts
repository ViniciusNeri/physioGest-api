export interface Setting {
  id?: string;
  userId: string;
  dashboardTheme?: 'light' | 'dark';
  showWeeklyAppointments?: boolean;
  showMonthlyIncome?: boolean;
  showActivePayments?: boolean;
  showNextAppointment?: boolean;
  categoryControlMode?: 'none' | 'manual' | 'auto';
  updatedAt?: Date;
  createdAt?: Date;
}
