import type { ICategoryRepository } from "../../domain/interfaces/ICategoryRepository.js";
import type { ICategoryService } from "../../domain/services/ICategoryService.js";
import type { Category } from "../../domain/entities/Category.js";
import type { ILogger } from "../../infrastructure/logging/Logger.js";
export declare class CategoryService implements ICategoryService {
    private repository;
    private logger;
    constructor(repository: ICategoryRepository, logger: ILogger);
    getCategoryById(id: string): Promise<Category | null>;
    getAllCategories(): Promise<Category[]>;
    getCategoriesByUserId(userId: string): Promise<Category[]>;
    createCategory(category: Omit<Category, 'id'>): Promise<Category>;
    updateCategory(id: string, category: Partial<Category>): Promise<Category | null>;
    deleteCategory(id: string): Promise<boolean>;
}
//# sourceMappingURL=CategoryService.d.ts.map