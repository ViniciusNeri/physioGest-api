import mongoose from "mongoose";
import type { PatientAnamnesis } from "../../../domain/entities/PatientSubdomains.js";
declare const PatientAnamnesisModel: mongoose.Model<PatientAnamnesis, {}, {}, {}, mongoose.Document<unknown, {}, PatientAnamnesis, {}, mongoose.DefaultSchemaOptions> & PatientAnamnesis & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}, any, PatientAnamnesis>;
export default PatientAnamnesisModel;
//# sourceMappingURL=PatientAnamnesisModel.d.ts.map