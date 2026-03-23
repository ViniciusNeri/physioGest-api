import mongoose from "mongoose";
import type { PaymentMethod } from "../../../domain/entities/PaymentMethod.js";

const paymentMethodSchema = new mongoose.Schema<PaymentMethod>(
  {
    id: { type: String },
    userId: { type: String, required: true },
    name: { type: String, required: true },
    type: {
      type: String,
      enum: ['cash', 'credit_card', 'debit_card', 'bank_transfer', 'pix', 'check', 'other'],
      required: true
    },
    active: { type: Boolean, default: true },
    settingsId: { type: String },
  },
  { timestamps: true }
);

// @ts-ignore
paymentMethodSchema.pre('save', function() {
  if (!this.id) {
    this.id = this._id.toString();
  }
});

const PaymentMethodModel = mongoose.model<PaymentMethod>("PaymentMethod", paymentMethodSchema);

export default PaymentMethodModel;
