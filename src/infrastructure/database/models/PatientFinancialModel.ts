import mongoose from "mongoose";
import type { PatientFinancial } from "../../../domain/entities/PatientSubdomains.js";

const patientFinancialSchema = new mongoose.Schema<PatientFinancial>(
  {
    id: { type: String },
    patientId: { type: String, required: true },
    userId: { type: String, required: true },
    date: { type: Date, required: true, default: Date.now },
    type: { type: String, enum: ['income', 'expense'], required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    amount: { type: Number, required: true, min: 0 },
    paymentMethod: {
      type: String,
      enum: ['cash', 'credit_card', 'debit_card', 'pix', 'bank_transfer', 'check', 'other'],
      required: false
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'cancelled', 'refunded'],
      default: 'pending',
      required: true
    },
    dueDate: { type: Date, required: false },
    paymentDate: { type: Date, required: false },
    notes: { type: String, required: false },
  },
  { timestamps: true }
);

// @ts-ignore
patientFinancialSchema.pre('save', function() {
  if (!this.id) {
    this.id = (this as any)._id.toString();
  }
});

const PatientFinancialModel = mongoose.model<PatientFinancial>("PatientFinancial", patientFinancialSchema);

export default PatientFinancialModel;