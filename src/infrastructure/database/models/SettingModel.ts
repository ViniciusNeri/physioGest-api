import mongoose from "mongoose";
import type { Setting } from "../../../domain/entities/Setting.js";

const settingSchema = new mongoose.Schema<Setting>(
  {
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
  },
  { timestamps: true }
);

// @ts-ignore
settingSchema.pre('save', function() {
  if (!this.id) {
    this.id = this._id.toString();
  }
});

const SettingModel = mongoose.model<Setting>("Setting", settingSchema);

export default SettingModel;
