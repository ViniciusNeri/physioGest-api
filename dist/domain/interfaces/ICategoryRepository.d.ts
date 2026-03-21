import type { Category } from "../entities/Category.js";
export interface ICategoryRepository {
    findById(id: string): Promise<Category | null>;
    findAll(): Promise<Category[]>;
    findByUserId(userId: string): Promise<Category[]>;
    create(category: Category): Promise<Category>;
    update(id: string, category: Partial<Category>): Promise<Category | null>;
    delete(id: string): Promise<boolean>;
}
//# sourceMappingURL=ICategoryRepository.d.ts.map