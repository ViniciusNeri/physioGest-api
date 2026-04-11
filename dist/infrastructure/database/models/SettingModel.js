import mongoose from "mongoose";
const settingSchema = new mongoose.Schema({
    id: { type: String },
    userId: { type: String, required: true, unique: true },
    dashboardTheme: { type: String, enum: ['light', 'dark'], default: 'light' },
    showWeeklyAppointments: { type: Boolean, default: true },
    showMonthlyIncome: { type: Boolean, default: true },
    showActivePayments: { type: Boolean, default: true },
    showNextAppointment: { type: Boolean, default: true },
    showPendingPayments: { type: Boolean, default: true },
    showBirthdays: { type: Boolean, default: true },
    showOccupancyGraph: { type: Boolean, default: true },
    showOverdueAppointments: { type: Boolean, default: true },
    categoryControlMode: { type: String, enum: ['none', 'manual', 'auto'], default: 'none' },
    defaultCategoryId: { type: String, required: false },
    defaultPaymentMethodId: { type: String, required: false },
    operatingDays: { type: [Number], default: [1, 2, 3, 4, 5] },
    businessHours: {
        startTime: { type: String, default: '08:00' },
        endTime: { type: String, default: '18:00' },
        lunchStart: { type: String },
        lunchEnd: { type: String }
    },
    timezone: { type: String, default: 'America/Sao_Paulo' },
    sessionDuration: { type: Number, default: 60 },
}, { timestamps: true });
// @ts-ignore
settingSchema.pre('save', function () {
    if (!this.id) {
        this.id = this._id.toString();
    }
});
const SettingModel = mongoose.model("Setting", settingSchema);
export default SettingModel;
//# sourceMappingURL=SettingModel.js.map