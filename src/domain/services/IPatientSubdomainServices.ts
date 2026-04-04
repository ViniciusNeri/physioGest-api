import type { PatientAnamnesis, PatientFinancial, PatientAttachment, PatientFinancialSummary } from "../entities/PatientSubdomains.js";

export interface IPatientAnamnesisService {
  getPatientAnamnesis(patientId: string): Promise<PatientAnamnesis[]>;
  getAnamnesisById(id: string): Promise<PatientAnamnesis | null>;
  createAnamnesis(anamnesis: Omit<PatientAnamnesis, 'id'>): Promise<PatientAnamnesis>;
  updateAnamnesis(id: string, anamnesis: Partial<PatientAnamnesis>): Promise<PatientAnamnesis | null>;
  deleteAnamnesis(id: string): Promise<boolean>;
  getLatestAnamnesis(patientId: string): Promise<PatientAnamnesis | null>;
}

export interface IPatientFinancialService {
  getPatientFinancial(patientId: string): Promise<PatientFinancial[]>;
  getFinancialById(id: string): Promise<PatientFinancial | null>;
  createFinancial(financial: Omit<PatientFinancial, 'id'>): Promise<PatientFinancial>;
  updateFinancial(id: string, financial: Partial<PatientFinancial>): Promise<PatientFinancial | null>;
  deleteFinancial(id: string): Promise<boolean>;
  getPatientBalance(patientId: string): Promise<number>;
  getPendingPayments(patientId: string): Promise<PatientFinancial[]>;
  getFinancialByDateRange(patientId: string, startDate: Date, endDate: Date): Promise<PatientFinancial[]>;
  getFinancialSummary(patientId: string): Promise<PatientFinancialSummary>;
  payFinancial(id: string, paymentMethod?: string): Promise<PatientFinancial | null>;
}

export interface IPatientAttachmentService {
  getPatientAttachments(patientId: string): Promise<PatientAttachment[]>;
  getAttachmentById(id: string): Promise<PatientAttachment | null>;
  createAttachment(attachment: Omit<PatientAttachment, 'id'>): Promise<PatientAttachment>;
  updateAttachment(id: string, attachment: Partial<PatientAttachment>): Promise<PatientAttachment | null>;
  deleteAttachment(id: string): Promise<boolean>;
  getAttachmentsByCategory(patientId: string, category: string): Promise<PatientAttachment[]>;
}