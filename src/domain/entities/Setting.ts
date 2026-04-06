export interface Setting {
  id?: string;
  userId: string;
  dashboardTheme?: 'light' | 'dark';
  showWeeklyAppointments?: boolean;
  showMonthlyIncome?: boolean;
  showActivePayments?: boolean;
  showNextAppointment?: boolean;
  showPendingPayments?: boolean;
  showBirthdays?: boolean;
  showOccupancyGraph?: boolean;
  showOverdueAppointments?: boolean;
  categoryControlMode?: 'none' | 'manual' | 'auto';
  defaultCategoryId?: string;
  defaultPaymentMethodId?: string;
  updatedAt?: Date;
  createdAt?: Date;
}
