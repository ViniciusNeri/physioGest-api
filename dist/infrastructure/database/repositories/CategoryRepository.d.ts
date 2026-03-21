import type { ICategoryRepository } from "../../../domain/interfaces/ICategoryRepository.js";
import type { Category } from "../../../domain/entities/Category.js";
export declare class CategoryRepository implements ICategoryRepository {
    findById(id: string): Promise<Category | null>;
    findAll(): Promise<Category[]>;
    findByUserId(userId: string): Promise<Category[]>;
    create(category: Category): Promise<Category>;
    update(id: string, category: Partial<Category>): Promise<Category | null>;
    delete(id: string): Promise<boolean>;
}
//# sourceMappingURL=CategoryRepository.d.ts.map