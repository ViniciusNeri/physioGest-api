import mongoose from "mongoose";
const patientFinancialSchema = new mongoose.Schema({
    id: { type: String },
    patientId: { type: String, required: true },
    userId: { type: String, required: true },
    date: { type: Date, required: true, default: Date.now },
    type: { type: String, enum: ['income', 'expense'], required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    amount: { type: Number, required: true, min: 0 },
    totalSessions: { type: Number, required: false },
    paymentMethod: {
        type: String,
        enum: ['cash', 'credit_card', 'debit_card', 'pix', 'bank_transfer', 'check', 'other'],
        required: false
    },
    status: {
        type: String,
        enum: ['pending', 'paid', 'cancelled', 'refunded'],
        default: 'pending',
        required: true
    },
    dueDate: { type: Date, required: false },
    paymentDate: { type: Date, required: false },
    notes: { type: String, required: false },
}, { timestamps: true });
// @ts-ignore
patientFinancialSchema.pre('save', function () {
    if (!this.id) {
        this.id = this._id.toString();
    }
});
const PatientFinancialModel = mongoose.model("PatientFinancial", patientFinancialSchema);
export default PatientFinancialModel;
//# sourceMappingURL=PatientFinancialModel.js.map