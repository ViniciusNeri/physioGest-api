import mongoose from "mongoose";
import type { PatientAgenda } from "../../../domain/entities/PatientSubdomains.js";
declare const PatientAgendaModel: mongoose.Model<PatientAgenda, {}, {}, {}, mongoose.Document<unknown, {}, PatientAgenda, {}, mongoose.DefaultSchemaOptions> & PatientAgenda & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}, any, PatientAgenda>;
export default PatientAgendaModel;
//# sourceMappingURL=PatientAgendaModel.d.ts.map