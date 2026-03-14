import mongoose from "mongoose";
const agendaSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    time: { type: String, required: true },
    patientId: { type: String, required: true },
    description: { type: String, required: true },
    userId: { type: String, required: true },
}, { timestamps: true });
const AgendaModel = mongoose.model("Agenda", agendaSchema);
export default AgendaModel;
//# sourceMappingURL=AgendaModel.js.map