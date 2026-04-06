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
import bcrypt from "bcryptjs";
import logger from "../../infrastructure/logging/Logger.js";
let UserService = class UserService {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async getUserById(id) {
        logger.debug("Buscando usuário por identificador", { identifier: id });
        try {
            const user = await this.repository.findById(id);
            if (user) {
                logger.debug("Usuário encontrado", { userId: id, email: user.email });
            }
            else {
                logger.warn("Usuário não encontrado", { userId: id });
            }
            return user;
        }
        catch (error) {
            logger.error("Erro ao buscar usuário por identificador", error, { identifier: id });
            throw error;
        }
    }
    async getAllUsers() {
        logger.debug("Buscando todos os usuários");
        try {
            const users = await this.repository.findAll();
            logger.info("Usuários encontrados", { count: users.length });
            return users;
        }
        catch (error) {
            logger.error("Erro ao buscar todos os usuários", error);
            throw error;
        }
    }
    async createUser(user) {
        logger.debug("Criando usuário", { email: user.email, name: user.name });
        try {
            const existingUser = await this.repository.findByEmail(user.email);
            if (existingUser) {
                logger.warn("Tentativa de criar usuário com email já existente", { email: user.email });
                throw new Error("Email já cadastrado");
            }
            let hashedPassword;
            if (user.password) {
                logger.debug("Criptografando senha do usuário");
                hashedPassword = await bcrypt.hash(user.password, 10);
            }
            const newUser = { ...user, password: hashedPassword };
            const createdUser = await this.repository.create(newUser);
            logger.debug('Documento salvo no banco:', createdUser.id);
            logger.info("Usuário criado com sucesso", {
                userId: createdUser.id,
                email: createdUser.email,
                verified: createdUser.verified
            });
            return createdUser;
        }
        catch (error) {
            logger.error("Erro ao criar usuário", error, { email: user.email, name: user.name });
            throw error;
        }
    }
    async updateUser(id, user) {
        logger.debug("Atualizando usuário", { identifier: id, updates: Object.keys(user) });
        try {
            if (user.password) {
                logger.debug("Criptografando nova senha do usuário", { userId: id });
                user.password = await bcrypt.hash(user.password, 10);
            }
            const updatedUser = await this.repository.update(id, user);
            if (updatedUser) {
                logger.info("Usuário atualizado com sucesso", {
                    userId: id,
                    email: updatedUser.email,
                    updates: Object.keys(user)
                });
            }
            else {
                logger.warn("Usuário não encontrado para atualização", { userId: id });
            }
            return updatedUser;
        }
        catch (error) {
            logger.error("Erro ao atualizar usuário", error, { identifier: id });
            throw error;
        }
    }
    async deleteUser(id) {
        logger.debug("Deletando usuário", { identifier: id });
        try {
            const deleted = await this.repository.delete(id);
            if (deleted) {
                logger.info("Usuário deletado com sucesso", { userId: id });
            }
            else {
                logger.warn("Usuário não encontrado para deleção", { userId: id });
            }
            return deleted;
        }
        catch (error) {
            logger.error("Erro ao deletar usuário", error, { identifier: id });
            throw error;
        }
    }
};
UserService = __decorate([
    injectable(),
    __param(0, inject("IUserRepository")),
    __metadata("design:paramtypes", [Object])
], UserService);
export { UserService };
//# sourceMappingURL=UserService.js.map