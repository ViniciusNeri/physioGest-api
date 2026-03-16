import mongoose from "mongoose";
import type { PatientAttachment } from "../../../domain/entities/PatientSubdomains.js";
declare const PatientAttachmentModel: mongoose.Model<PatientAttachment, {}, {}, {}, mongoose.Document<unknown, {}, PatientAttachment, {}, mongoose.DefaultSchemaOptions> & PatientAttachment & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}, any, PatientAttachment>;
export default PatientAttachmentModel;
//# sourceMappingURL=PatientAttachmentModel.d.ts.map