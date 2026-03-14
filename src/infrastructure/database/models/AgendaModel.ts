import mongoose from "mongoose";
import type { Agenda } from "../../../domain/entities/Agenda.js";

const agendaSchema = new mongoose.Schema<Agenda>(
  {
    date: { type: Date, required: true },
    time: { type: String, required: true },
    patientId: { type: String, required: true },
    description: { type: String, required: true },
    userId: { type: String, required: true },
  },
  { timestamps: true }
);

const AgendaModel = mongoose.model<Agenda>("Agenda", agendaSchema);

export default AgendaModel;