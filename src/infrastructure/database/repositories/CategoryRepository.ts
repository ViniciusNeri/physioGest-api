import { injectable } from "tsyringe";
import type { ICategoryRepository } from "../../../domain/interfaces/ICategoryRepository.js";
import type { Category } from "../../../domain/entities/Category.js";
import CategoryModel from "../models/CategoryModel.js";

@injectable()
export class CategoryRepository implements ICategoryRepository {
  async findById(id: string): Promise<Category | null> {
    return CategoryModel.findById(id).lean<Category>({ virtuals: true }).exec();
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
    return CategoryModel.findByIdAndUpdate(id, category, { new: true }).lean<Category>({ virtuals: true }).exec();
  }

  async delete(id: string): Promise<boolean> {
    const result = await CategoryModel.findByIdAndDelete(id).exec();
    return result !== null;
  }
}
