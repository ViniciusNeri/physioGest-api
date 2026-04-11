import { injectable } from "tsyringe";
import type { ICategoryRepository } from "../../../domain/interfaces/ICategoryRepository.js";
import type { Category } from "../../../domain/entities/Category.js";
import CategoryModel from "../models/CategoryModel.js";
import mongoose from "mongoose";

@injectable()
export class CategoryRepository implements ICategoryRepository {
  async findById(id: string): Promise<Category | null> {
    const isObjectId = mongoose.Types.ObjectId.isValid(id);
    const query = isObjectId ? { _id: id } : { id: id };
    return CategoryModel.findOne(query).lean<Category>({ virtuals: true }).exec();
  }

  async findAll(): Promise<Category[]> {
    return CategoryModel.find().lean<Category[]>({ virtuals: true }).exec();
  }

  async findByUserId(userId: string): Promise<Category[]> {
    return CategoryModel.find({
      $or: [
        { userId: userId },
        { userId: null }
      ]
    })
    .lean<Category[]>({ virtuals: true })
    .exec();
  }

  async create(category: Category): Promise<Category> {
    const newCategory = new CategoryModel(category);
    return newCategory.save();
  }

  async update(id: string, category: Partial<Category>): Promise<Category | null> {
    const isObjectId = mongoose.Types.ObjectId.isValid(id);
    const query = isObjectId ? { _id: id } : { id: id };
    return CategoryModel.findOneAndUpdate(query, category, { new: true }).lean<Category>({ virtuals: true }).exec();
  }

  async delete(id: string): Promise<boolean> {
    const isObjectId = mongoose.Types.ObjectId.isValid(id);
    const query = isObjectId ? { _id: id } : { id: id };
    const result = await CategoryModel.findOneAndDelete(query).exec();
    return result !== null;
  }
}
