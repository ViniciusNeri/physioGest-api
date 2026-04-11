var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { injectable } from "tsyringe";
import CategoryModel from "../models/CategoryModel.js";
import mongoose from "mongoose";
let CategoryRepository = class CategoryRepository {
    async findById(id) {
        const isObjectId = mongoose.Types.ObjectId.isValid(id);
        const query = isObjectId ? { _id: id } : { id: id };
        return CategoryModel.findOne(query).lean({ virtuals: true }).exec();
    }
    async findAll() {
        return CategoryModel.find().lean({ virtuals: true }).exec();
    }
    async findByUserId(userId) {
        return CategoryModel.find({
            $or: [
                { userId: userId },
                { userId: null }
            ]
        })
            .lean({ virtuals: true })
            .exec();
    }
    async create(category) {
        const newCategory = new CategoryModel(category);
        return newCategory.save();
    }
    async update(id, category) {
        const isObjectId = mongoose.Types.ObjectId.isValid(id);
        const query = isObjectId ? { _id: id } : { id: id };
        return CategoryModel.findOneAndUpdate(query, category, { new: true }).lean({ virtuals: true }).exec();
    }
    async delete(id) {
        const isObjectId = mongoose.Types.ObjectId.isValid(id);
        const query = isObjectId ? { _id: id } : { id: id };
        const result = await CategoryModel.findOneAndDelete(query).exec();
        return result !== null;
    }
};
CategoryRepository = __decorate([
    injectable()
], CategoryRepository);
export { CategoryRepository };
//# sourceMappingURL=CategoryRepository.js.map