export interface DashboardData {
    weeklyAppointments: number;
    monthlyIncome: number;
    activePayments: number;
    todaysAppointments: Array<{
        id: string;
        date: Date;
        time: string;
        patientId: string;
        description: string;
    }>;
    nextAppointment: {
        id: string;
        date: Date;
        time: string;
        patientId: string;
        description: string;
    } | null;
}
//# sourceMappingURL=Dashboard.d.ts.map