export interface BusinessHours {
  startTime: string;   // "08:00"
  endTime: string;     // "18:00"
  lunchStart?: string; // "12:00"
  lunchEnd?: string;   // "13:30"
}

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
  operatingDays?: number[]; // 0-6 (Domingo a Sábado)
  businessHours?: BusinessHours;
  timezone?: string; // "America/Sao_Paulo"
  sessionDuration?: number; // em minutos, padrão 60
  updatedAt?: Date;
  createdAt?: Date;
}
