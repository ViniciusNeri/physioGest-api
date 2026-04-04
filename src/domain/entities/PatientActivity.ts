export interface PatientActivity {
  id?: string;
  patientId: string;
  userId: string;
  type: 'appointment_created' | 'appointment_completed' | 'appointment_cancelled' | 'appointment_no_show' | 'payment_pending' | 'payment_paid' | 'anamnesis_updated';
  description: string;
  date: Date;
  metadata?: any;
}
