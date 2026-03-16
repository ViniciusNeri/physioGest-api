import type { PatientAgenda, PatientAnamnesis, PatientFinancial, PatientAttachment } from "../entities/PatientSubdomains.js";

export interface IPatientAgendaService {
  getPatientAgenda(patientId: string): Promise<PatientAgenda[]>;
  getAgendaById(id: string): Promise<PatientAgenda | null>;
  createAgenda(agenda: Omit<PatientAgenda, 'id'>): Promise<PatientAgenda>;
  updateAgenda(id: string, agenda: Partial<PatientAgenda>): Promise<PatientAgenda | null>;
  deleteAgenda(id: string): Promise<boolean>;
  getUpcomingAgenda(patientId: string, limit?: number): Promise<PatientAgenda[]>;
  getAgendaByDateRange(patientId: string, startDate: Date, endDate: Date): Promise<PatientAgenda[]>;
}

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
}

export interface IPatientAttachmentService {
  getPatientAttachments(patientId: string): Promise<PatientAttachment[]>;
  getAttachmentById(id: string): Promise<PatientAttachment | null>;
  createAttachment(attachment: Omit<PatientAttachment, 'id'>): Promise<PatientAttachment>;
  updateAttachment(id: string, attachment: Partial<PatientAttachment>): Promise<PatientAttachment | null>;
  deleteAttachment(id: string): Promise<boolean>;
  getAttachmentsByCategory(patientId: string, category: string): Promise<PatientAttachment[]>;
}