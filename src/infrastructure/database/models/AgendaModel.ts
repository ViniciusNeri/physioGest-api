import mongoose from "mongoose";
import type { Agenda } from "../../../domain/entities/Agenda.js";

const agendaSchema = new mongoose.Schema<Agenda>(
  {
    id: { type: String },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    patientId: { type: String, required: true },
    description: { type: String, required: true },
    userId: { type: String, required: true },
  },
  { timestamps: true }
);

// @ts-ignore
agendaSchema.pre('save', function() {
  if (!this.id) {
    this.id = this._id.toString();
  }
});

const AgendaModel = mongoose.model<Agenda>("Agenda", agendaSchema);

export default AgendaModel;