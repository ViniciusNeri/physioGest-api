export interface PatientAgenda {
    id?: string;
    patientId: string;
    userId: string;
    date: Date;
    time: string;
    description?: string;
    status: 'scheduled' | 'completed' | 'cancelled' | 'no_show';
    notes?: string;
    duration?: number;
}
export interface PatientAnamnesis {
    id?: string;
    patientId: string;
    userId: string;
    date: Date;
    chiefComplaint: string;
    historyOfPresentIllness: string;
    pastMedicalHistory: string;
    familyHistory?: string;
    socialHistory?: string;
    reviewOfSystems?: string;
    physicalExamination?: string;
    assessment?: string;
    plan?: string;
    notes?: string;
}
export interface PatientFinancial {
    id?: string;
    patientId: string;
    userId: string;
    date: Date;
    type: 'income' | 'expense';
    category: string;
    description: string;
    amount: number;
    paymentMethod?: 'cash' | 'credit_card' | 'debit_card' | 'pix' | 'bank_transfer' | 'check' | 'other';
    status: 'pending' | 'paid' | 'cancelled' | 'refunded';
    dueDate?: Date;
    paymentDate?: Date;
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
    category?: string;
    description?: string;
    uploadedAt: Date;
}
//# sourceMappingURL=PatientSubdomains.d.ts.map