import mongoose from "mongoose";
const paymentMethodSchema = new mongoose.Schema({
    id: { type: String },
    userId: { type: String, required: true },
    name: { type: String, required: true },
    type: {
        type: String,
        enum: ['cash', 'credit_card', 'debit_card', 'bank_transfer', 'pix', 'check', 'other'],
        required: true
    },
    active: { type: Boolean, default: true },
    settingsId: { type: String },
}, { timestamps: true });
// @ts-ignore
paymentMethodSchema.pre('save', function () {
    if (!this.id) {
        this.id = this._id.toString();
    }
});
const PaymentMethodModel = mongoose.model("PaymentMethod", paymentMethodSchema);
export default PaymentMethodModel;
//# sourceMappingURL=PaymentMethodModel.js.map