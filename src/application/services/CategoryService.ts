import { injectable, inject } from "tsyringe";
import type { ICategoryRepository } from "../../domain/interfaces/ICategoryRepository.js";
import type { ICategoryService } from "../../domain/services/ICategoryService.js";
import type { Category } from "../../domain/entities/Category.js";
import type { ILogger } from "../../infrastructure/logging/Logger.js";

@injectable()
export class CategoryService implements ICategoryService {
  constructor(
    @inject("ICategoryRepository")
    private repository: ICategoryRepository,
    @inject("Logger")
    private logger: ILogger
  ) {}

  async getCategoryById(id: string): Promise<Category | null> {
    this.logger.info(`Buscando categoria por ID: ${id}`);
    return this.repository.findById(id);
  }

  async getAllCategories(): Promise<Category[]> {
    this.logger.info("Buscando todas as categorias");
    return this.repository.findAll();
  }

  async getCategoriesByUserId(userId: string): Promise<Category[]> {
    this.logger.info(`Buscando categorias por usuário: ${userId}`);
    return this.repository.findByUserId(userId);
  }

  async createCategory(category: Omit<Category, 'id'>): Promise<Category> {
    this.logger.info(`Criando categoria para usuário: ${category.userId}`);
    return this.repository.create(category as Category);
  }

  async updateCategory(id: string, category: Partial<Category>): Promise<Category | null> {
    this.logger.info(`Atualizando categoria: ${id}`);
    return this.repository.update(id, category);
  }

  async deleteCategory(id: string): Promise<boolean> {
    this.logger.info(`Deletando categoria: ${id}`);
    return this.repository.delete(id);
  }
}
