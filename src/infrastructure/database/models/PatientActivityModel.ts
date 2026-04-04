import mongoose from "mongoose";
import type { PatientActivity } from "../../../domain/entities/PatientActivity.js";

const patientActivitySchema = new mongoose.Schema<PatientActivity>(
  {
    id: { type: String },
    patientId: { type: String, required: true },
    userId: { type: String, required: true },
    type: { 
      type: String, 
      enum: ['appointment_created', 'appointment_completed', 'appointment_cancelled', 'appointment_no_show', 'payment_pending', 'payment_paid', 'anamnesis_updated'],
      required: true 
    },
    description: { type: String, required: true },
    date: { type: Date, default: Date.now },
    metadata: { type: mongoose.Schema.Types.Mixed, required: false },
  },
  { timestamps: true }
);

// @ts-ignore
patientActivitySchema.pre('save', function() {
  if (!this.id) {
    this.id = this._id.toString();
  }
});

const PatientActivityModel = mongoose.model<PatientActivity>("PatientActivity", patientActivitySchema);

export default PatientActivityModel;
