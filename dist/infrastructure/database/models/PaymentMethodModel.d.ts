import mongoose from "mongoose";
import type { PaymentMethod } from "../../../domain/entities/PaymentMethod.js";
declare const PaymentMethodModel: mongoose.Model<PaymentMethod, {}, {}, {}, mongoose.Document<unknown, {}, PaymentMethod, {}, mongoose.DefaultSchemaOptions> & PaymentMethod & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}, any, PaymentMethod>;
export default PaymentMethodModel;
//# sourceMappingURL=PaymentMethodModel.d.ts.map