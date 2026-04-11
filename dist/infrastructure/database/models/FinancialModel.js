import mongoose from "mongoose";
const financialSchema = new mongoose.Schema({
    id: { type: String },
    type: { type: String, enum: ['income', 'expense'], required: true },
    status: { type: String, enum: ['pending', 'paid', 'cancelled', 'refunded'], default: 'paid', required: true },
    amount: { type: Number, required: true },
    date: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: false },
    expenseType: { type: String, enum: ['fixed', 'variable'], required: false },
    paymentMethod: {
        type: String,
        enum: ['cash', 'credit_card', 'debit_card', 'pix', 'bank_transfer', 'check', 'other'],
        required: false
    },
    userId: { type: String, required: true },
    patientId: { type: String, required: false },
}, { timestamps: true });
// @ts-ignore
financialSchema.pre('save', function () {
    if (!this.id) {
        this.id = this._id.toString();
    }
});
const FinancialModel = mongoose.model("Financial", financialSchema);
export default FinancialModel;
//# sourceMappingURL=FinancialModel.js.map