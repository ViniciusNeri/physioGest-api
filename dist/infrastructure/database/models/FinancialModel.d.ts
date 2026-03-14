import mongoose from "mongoose";
import type { Financial } from "../../../domain/entities/Financial.js";
declare const FinancialModel: mongoose.Model<Financial, {}, {}, {}, mongoose.Document<unknown, {}, Financial, {}, mongoose.DefaultSchemaOptions> & Financial & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}, any, Financial>;
export default FinancialModel;
//# sourceMappingURL=FinancialModel.d.ts.map