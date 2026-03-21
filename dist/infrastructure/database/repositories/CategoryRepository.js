var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { injectable } from "tsyringe";
import CategoryModel from "../models/CategoryModel.js";
let CategoryRepository = class CategoryRepository {
    async findById(id) {
        return CategoryModel.findById(id).lean({ virtuals: true }).exec();
    }
    async findAll() {
        return CategoryModel.find().lean({ virtuals: true }).exec();
    }
    async findByUserId(userId) {
        return CategoryModel.find({ userId }).lean({ virtuals: true }).exec();
    }
    async create(category) {
        const newCategory = new CategoryModel(category);
        return newCategory.save();
    }
    async update(id, category) {
        return CategoryModel.findByIdAndUpdate(id, category, { new: true }).lean({ virtuals: true }).exec();
    }
    async delete(id) {
        const result = await CategoryModel.findByIdAndDelete(id).exec();
        return result !== null;
    }
};
CategoryRepository = __decorate([
    injectable()
], CategoryRepository);
export { CategoryRepository };
//# sourceMappingURL=CategoryRepository.js.map