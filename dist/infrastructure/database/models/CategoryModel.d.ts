import mongoose from "mongoose";
import type { Category } from "../../../domain/entities/Category.js";
declare const CategoryModel: mongoose.Model<Category, {}, {}, {}, mongoose.Document<unknown, {}, Category, {}, mongoose.DefaultSchemaOptions> & Category & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}, any, Category>;
export default CategoryModel;
//# sourceMappingURL=CategoryModel.d.ts.map