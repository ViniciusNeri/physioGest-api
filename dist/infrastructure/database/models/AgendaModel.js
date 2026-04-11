import mongoose from "mongoose";
const agendaSchema = new mongoose.Schema({
    id: { type: String },
    patientId: { type: String, required: true },
    userId: { type: String, required: true },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    categoryId: {
        type: String,
        set: (v) => v === "" ? null : v
    },
    status: {
        type: String,
        enum: ['scheduled', 'completed', 'cancelled', 'no_show'],
        default: 'scheduled'
    },
    description: { type: String },
    notes: { type: String },
}, { timestamps: true });
// @ts-ignore
agendaSchema.pre('save', function () {
    if (!this.id) {
        this.id = this._id.toString();
    }
});
agendaSchema.virtual('patient', {
    ref: 'Patient',
    localField: 'patientId',
    foreignField: '_id',
    justOne: true
});
agendaSchema.virtual('category', {
    ref: 'Category',
    localField: 'categoryId',
    foreignField: '_id',
    justOne: true
});
agendaSchema.set('toObject', { virtuals: true });
agendaSchema.set('toJSON', { virtuals: true });
const AgendaModel = mongoose.model("Agenda", agendaSchema);
export default AgendaModel;
//# sourceMappingURL=AgendaModel.js.map