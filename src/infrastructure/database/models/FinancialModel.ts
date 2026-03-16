import mongoose from "mongoose";
import type { Financial } from "../../../domain/entities/Financial.js";

const financialSchema = new mongoose.Schema<Financial>(
  {
    id: { type: String },
    type: { type: String, enum: ['income', 'expense'], required: true },
    amount: { type: Number, required: true },
    date: { type: Date, required: true },
    description: { type: String, required: true },
    userId: { type: String, required: true },
    patientId: { type: String, required: false },
  },
  { timestamps: true }
);

// @ts-ignore
financialSchema.pre('save', function() {
  if (!this.id) {
    this.id = this._id.toString();
  }
});

const FinancialModel = mongoose.model<Financial>("Financial", financialSchema);

export default FinancialModel;