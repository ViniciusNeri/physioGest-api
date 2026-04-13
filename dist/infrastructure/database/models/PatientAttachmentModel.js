import mongoose from "mongoose";
const patientAttachmentSchema = new mongoose.Schema({
    id: { type: String },
    patientId: { type: String, required: true },
    userId: { type: String, required: true },
    fileName: { type: String, required: true },
    originalName: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true, min: 0 },
    path: { type: String, required: true },
    category: { type: String, required: false },
    description: { type: String, required: false },
    status: { type: String, enum: ['pending_upload', 'uploaded', 'failed'], default: 'uploaded' },
    uploadedAt: { type: String, required: true, default: () => new Date().toISOString().substring(0, 19) },
}, { timestamps: true });
// @ts-ignore
patientAttachmentSchema.pre('save', function () {
    if (!this.id) {
        this.id = this._id.toString();
    }
});
const PatientAttachmentModel = mongoose.model("PatientAttachment", patientAttachmentSchema);
export default PatientAttachmentModel;
//# sourceMappingURL=PatientAttachmentModel.js.map