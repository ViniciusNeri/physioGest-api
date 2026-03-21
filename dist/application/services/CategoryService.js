var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { injectable, inject } from "tsyringe";
let CategoryService = class CategoryService {
    repository;
    logger;
    constructor(repository, logger) {
        this.repository = repository;
        this.logger = logger;
    }
    async getCategoryById(id) {
        this.logger.info(`Buscando categoria por ID: ${id}`);
        return this.repository.findById(id);
    }
    async getAllCategories() {
        this.logger.info("Buscando todas as categorias");
        return this.repository.findAll();
    }
    async getCategoriesByUserId(userId) {
        this.logger.info(`Buscando categorias por usuário: ${userId}`);
        return this.repository.findByUserId(userId);
    }
    async createCategory(category) {
        this.logger.info(`Criando categoria para usuário: ${category.userId}`);
        return this.repository.create(category);
    }
    async updateCategory(id, category) {
        this.logger.info(`Atualizando categoria: ${id}`);
        return this.repository.update(id, category);
    }
    async deleteCategory(id) {
        this.logger.info(`Deletando categoria: ${id}`);
        return this.repository.delete(id);
    }
};
CategoryService = __decorate([
    injectable(),
    __param(0, inject("ICategoryRepository")),
    __param(1, inject("Logger")),
    __metadata("design:paramtypes", [Object, Object])
], CategoryService);
export { CategoryService };
//# sourceMappingURL=CategoryService.js.map