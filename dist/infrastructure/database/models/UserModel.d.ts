import mongoose from "mongoose";
import type { User } from "../../../domain/entities/User.js";
declare const UserModel: mongoose.Model<User, {}, {}, {}, mongoose.Document<unknown, {}, User, {}, mongoose.DefaultSchemaOptions> & User & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}, any, User>;
export default UserModel;
//# sourceMappingURL=UserModel.d.ts.map