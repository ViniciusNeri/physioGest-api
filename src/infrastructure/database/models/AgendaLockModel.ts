import mongoose from "mongoose";
import type { AgendaLock } from "../../../domain/entities/AgendaLock.js";

const agendaLockSchema = new mongoose.Schema<AgendaLock>(
  {
    userId: { type: String, required: true },
    type: { type: String, enum: ['total', 'partial'], required: true },
    date: { type: String, required: true },
    startTime: { type: String, required: false },
    endTime: { type: String, required: false },
    description: { type: String, required: false },
  },
  { timestamps: true }
);

const AgendaLockModel = mongoose.model<AgendaLock>("AgendaLock", agendaLockSchema);

export default AgendaLockModel;
