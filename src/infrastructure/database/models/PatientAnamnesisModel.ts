import mongoose from "mongoose";
import type { PatientAnamnesis } from "../../../domain/entities/PatientSubdomains.js";

const patientAnamnesisSchema = new mongoose.Schema<PatientAnamnesis>(
  {
    id: { type: String },
    patientId: { type: String, required: true },
    userId: { type: String, required: true },
    date: { type: Date, required: true, default: Date.now },
    chiefComplaint: { type: String, required: false },
    historyOfPresentIllness: { type: String, required: false },
    pastMedicalHistory: { type: String, required: false },
    familyHistory: { type: String, required: false },
    socialHistory: { type: String, required: false },
    currentMedications: { type: String, required: false },
    reviewOfSystems: { type: String, required: false },
    physicalExamination: { type: String, required: false },
    assessment: { type: String, required: false },
    plan: { type: String, required: false },
    height: { type: Number, required: false },
    weight: { type: Number, required: false },
    notes: { type: String, required: false },
  },
  { timestamps: true }
);

// @ts-ignore
patientAnamnesisSchema.pre('save', function() {
  if (!this.id) {
    this.id = (this as any)._id.toString();
  }
});

const PatientAnamnesisModel = mongoose.model<PatientAnamnesis>("PatientAnamnesis", patientAnamnesisSchema);

export default PatientAnamnesisModel;