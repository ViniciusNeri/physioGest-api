import mongoose from "mongoose";
const financialSchema = new mongoose.Schema({
    type: { type: String, enum: ['income', 'expense'], required: true },
    amount: { type: Number, required: true },
    date: { type: Date, required: true },
    description: { type: String, required: true },
    userId: { type: String, required: true },
}, { timestamps: true });
const FinancialModel = mongoose.model("Financial", financialSchema);
export default FinancialModel;
//# sourceMappingURL=FinancialModel.js.map