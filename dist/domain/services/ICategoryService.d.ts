import type { Category } from "../entities/Category.js";
export interface ICategoryService {
    getCategoryById(id: string): Promise<Category | null>;
    getAllCategories(): Promise<Category[]>;
    getCategoriesByUserId(userId: string): Promise<Category[]>;
    createCategory(category: Omit<Category, 'id'>): Promise<Category>;
    updateCategory(id: string, category: Partial<Category>): Promise<Category | null>;
    deleteCategory(id: string): Promise<boolean>;
}
//# sourceMappingURL=ICategoryService.d.ts.map