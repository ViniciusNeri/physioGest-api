import mongoose from "mongoose";
import type { Agenda } from "../../../domain/entities/Agenda.js";

const agendaSchema = new mongoose.Schema<Agenda>(
  {
    id: { type: String },
    patientId: { type: String, required: true },
    userId: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    categoryId: { type: String },
    status: { 
      type: String, 
      enum: ['scheduled', 'completed', 'cancelled', 'no_show'],
      default: 'scheduled'
    },
    description: { type: String },
    notes: { type: String },
  },
  { timestamps: true }
);

// @ts-ignore
agendaSchema.pre('save', function() {
  if (!this.id) {
    this.id = this._id.toString();
  }
});

agendaSchema.virtual('patient', {
  ref: 'Patient',
  localField: 'patientId',
  foreignField: 'id',
  justOne: true
});

agendaSchema.set('toObject', { virtuals: true });
agendaSchema.set('toJSON', { virtuals: true });

const AgendaModel = mongoose.model<Agenda>("Agenda", agendaSchema);

export default AgendaModel;