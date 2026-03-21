import mongoose from "mongoose";
import type { Setting } from "../../../domain/entities/Setting.js";
declare const SettingModel: mongoose.Model<Setting, {}, {}, {}, mongoose.Document<unknown, {}, Setting, {}, mongoose.DefaultSchemaOptions> & Setting & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}, any, Setting>;
export default SettingModel;
//# sourceMappingURL=SettingModel.d.ts.map