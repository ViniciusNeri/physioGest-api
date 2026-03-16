import mongoose from "mongoose";
import type { PatientAgenda } from "../../../domain/entities/PatientSubdomains.js";

const patientAgendaSchema = new mongoose.Schema<PatientAgenda>(
  {
    id: { type: String },
    patientId: { type: String, required: true },
    userId: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    description: { type: String, required: false },
    status: {
      type: String,
      enum: ['scheduled', 'completed', 'cancelled', 'no_show'],
      default: 'scheduled',
      required: true
    },
    notes: { type: String, required: false },
    duration: { type: Number, required: false, default: 60 }, // 60 minutos por padrão
  },
  { timestamps: true }
);

// @ts-ignore
patientAgendaSchema.pre('save', function() {
  if (!this.id) {
    this.id = (this as any)._id.toString();
  }
});

const PatientAgendaModel = mongoose.model<PatientAgenda>("PatientAgenda", patientAgendaSchema);

export default PatientAgendaModel;