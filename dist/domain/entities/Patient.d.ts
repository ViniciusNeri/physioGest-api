export interface Patient {
    id?: string;
    name: string;
    email?: string;
    phone?: string;
    birthDate?: Date;
    gender?: 'male' | 'female' | 'other';
    profession?: string;
    observations?: string;
    completedAppointments?: number;
    cancelledAppointments?: number;
    noShowAppointments?: number;
    nextAppointmentDate?: Date | null;
    userId: string;
}
//# sourceMappingURL=Patient.d.ts.map