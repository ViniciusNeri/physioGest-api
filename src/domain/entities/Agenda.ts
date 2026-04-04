export interface Agenda {
  id?: string;
  patientId: string;
  userId: string;
  startDate: Date;
  endDate: Date;
  categoryId?: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no_show';
  description?: string;
  notes?: string;
  patientName?: string;
  patient?: { name: string };
  categoryName?: string;
  category?: { name: string };
}