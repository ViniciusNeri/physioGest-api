import mongoose from "mongoose";
import type { Financial } from "../../../domain/entities/Financial.js";

const financialSchema = new mongoose.Schema<Financial>(
  {
    type: { type: String, enum: ['income', 'expense'], required: true },
    amount: { type: Number, required: true },
    date: { type: Date, required: true },
    description: { type: String, required: true },
    userId: { type: String, required: true },
  },
  { timestamps: true }
);

const FinancialModel = mongoose.model<Financial>("Financial", financialSchema);

export default FinancialModel;