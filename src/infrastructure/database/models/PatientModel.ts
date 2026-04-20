import mongoose from "mongoose";
import type { Patient } from "../../../domain/entities/Patient.js";

const patientSchema = new mongoose.Schema<Patient>(
  {
    id: { type: String },
    name: { type: String, required: true },
    email: { type: String, required: false },
    phone: { type: String, required: false, unique: true, sparse: true, index: true },
    birthDate: { type: Date, required: false },
    gender: { type: String, enum: ['male', 'female', 'other'], required: false },
    profession: { type: String, required: false },
    observations: { type: String, required: false },
    userId: { type: String, required: true },
    pin: { type: String, required: false },
    status: { type: Boolean, default: true },
  },
  { timestamps: true, id: false }
);

// @ts-ignore
patientSchema.pre('save', function () {
  if (!this.id) {
    this.id = this._id.toString();
  }
});

const PatientModel = mongoose.model<Patient>("Patient", patientSchema);

export default PatientModel;