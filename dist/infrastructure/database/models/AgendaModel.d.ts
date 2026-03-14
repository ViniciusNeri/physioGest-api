import mongoose from "mongoose";
import type { Agenda } from "../../../domain/entities/Agenda.js";
declare const AgendaModel: mongoose.Model<Agenda, {}, {}, {}, mongoose.Document<unknown, {}, Agenda, {}, mongoose.DefaultSchemaOptions> & Agenda & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}, any, Agenda>;
export default AgendaModel;
//# sourceMappingURL=AgendaModel.d.ts.map