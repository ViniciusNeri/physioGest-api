import mongoose from "mongoose";
import type { Patient } from "../../../domain/entities/Patient.js";
declare const PatientModel: mongoose.Model<Patient, {}, {}, {}, mongoose.Document<unknown, {}, Patient, {}, mongoose.DefaultSchemaOptions> & Patient & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}, any, Patient>;
export default PatientModel;
//# sourceMappingURL=PatientModel.d.ts.map