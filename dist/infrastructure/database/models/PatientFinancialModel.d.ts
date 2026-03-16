import mongoose from "mongoose";
import type { PatientFinancial } from "../../../domain/entities/PatientSubdomains.js";
declare const PatientFinancialModel: mongoose.Model<PatientFinancial, {}, {}, {}, mongoose.Document<unknown, {}, PatientFinancial, {}, mongoose.DefaultSchemaOptions> & PatientFinancial & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}, any, PatientFinancial>;
export default PatientFinancialModel;
//# sourceMappingURL=PatientFinancialModel.d.ts.map