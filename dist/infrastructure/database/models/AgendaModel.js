import mongoose from "mongoose";
const agendaSchema = new mongoose.Schema({
    id: { type: String },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    patientId: { type: String, required: true },
    description: { type: String, required: true },
    userId: { type: String, required: true },
}, { timestamps: true });
// @ts-ignore
agendaSchema.pre('save', function () {
    if (!this.id) {
        this.id = this._id.toString();
    }
});
const AgendaModel = mongoose.model("Agenda", agendaSchema);
export default AgendaModel;
//# sourceMappingURL=AgendaModel.js.map