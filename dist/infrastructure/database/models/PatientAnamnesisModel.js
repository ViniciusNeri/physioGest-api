import mongoose from "mongoose";
const patientAnamnesisSchema = new mongoose.Schema({
    id: { type: String },
    patientId: { type: String, required: true },
    userId: { type: String, required: true },
    date: { type: Date, required: true, default: Date.now },
    chiefComplaint: { type: String, required: true },
    historyOfPresentIllness: { type: String, required: true },
    pastMedicalHistory: { type: String, required: true },
    familyHistory: { type: String, required: false },
    socialHistory: { type: String, required: false },
    reviewOfSystems: { type: String, required: false },
    physicalExamination: { type: String, required: false },
    assessment: { type: String, required: false },
    plan: { type: String, required: false },
    notes: { type: String, required: false },
}, { timestamps: true });
// @ts-ignore
patientAnamnesisSchema.pre('save', function () {
    if (!this.id) {
        this.id = this._id.toString();
    }
});
const PatientAnamnesisModel = mongoose.model("PatientAnamnesis", patientAnamnesisSchema);
export default PatientAnamnesisModel;
//# sourceMappingURL=PatientAnamnesisModel.js.map