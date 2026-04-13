export interface PatientAnamnesis {
  id?: string;
  patientId: string;
  userId: string;
  date: string;
  chiefComplaint?: string; // queixa principal
  historyOfPresentIllness?: string; // história da moléstia atual
  pastMedicalHistory?: string; // história médica pregressa
  familyHistory?: string; // histórico familiar
  socialHistory?: string; // hábitos de vida
  currentMedications?: string; // medicamentos em uso
  reviewOfSystems?: string; // revisão de sistemas
  physicalExamination?: string; // exame físico
  assessment?: string; // diagnóstico clínico
  plan?: string; // plano de tratamento
  height?: number; // altura em cm
  weight?: number; // peso em kg
  notes?: string;
}

export interface PatientFinancial {
  id?: string;
  patientId: string;
  userId: string;
  date: string;
  type: 'income' | 'expense';
  category: string; // consulta, exame, tratamento, etc.
  description: string;
  amount: number;
  totalSessions?: number;
  paymentMethod?: 'cash' | 'credit_card' | 'debit_card' | 'pix' | 'bank_transfer' | 'check' | 'other';
  status: 'pending' | 'paid' | 'cancelled' | 'refunded';
  dueDate?: string;
  paymentDate?: string;
  notes?: string;
}

export interface PatientAttachment {
  id?: string;
  patientId: string;
  userId: string;
  fileName: string;
  originalName: string;
  mimeType: string;
  size: number;
  path: string;
  category?: string; // exame, receita, laudo, foto, etc.
  description?: string;
  uploadedAt: string;
  status: 'pending_upload' | 'uploaded' | 'failed';
}

export interface PatientFinancialSummary {
  outstandingBalance: number;
  totalSessions: number;
  totalPaidAmount: number;
  payments: PatientFinancial[];
}