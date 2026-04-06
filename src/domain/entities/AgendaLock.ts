export interface AgendaLock {
  id?: string;
  userId: string;
  type: 'total' | 'partial';
  date: Date;
  startTime?: string; // HH:mm
  endTime?: string;   // HH:mm
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
