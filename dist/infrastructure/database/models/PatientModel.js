import mongoose from "mongoose";
const patientSchema = new mongoose.Schema({
    id: { type: String },
    name: { type: String, required: true },
    email: { type: String, required: false },
    phone: { type: String, required: false },
    birthDate: { type: Date, required: false },
    gender: { type: String, enum: ['male', 'female', 'other'], required: false },
    profession: { type: String, required: false },
    observations: { type: String, required: false },
    userId: { type: String, required: true },
}, { timestamps: true });
// @ts-ignore
patientSchema.pre('save', function () {
    if (!this.id) {
        this.id = this._id.toString();
    }
});
const PatientModel = mongoose.model("Patient", patientSchema);
export default PatientModel;
//# sourceMappingURL=PatientModel.js.map