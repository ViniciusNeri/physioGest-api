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
let SettingService = class SettingService {
    repository;
    logger;
    constructor(repository, logger) {
        this.repository = repository;
        this.logger = logger;
    }
    async getSettingById(id) {
        this.logger.info(`Buscando configuração por ID: ${id}`);
        return this.repository.findById(id);
    }
    async getAllSettings() {
        this.logger.info("Buscando todas as configurações");
        return this.repository.findAll();
    }
    async getSettingByUserId(userId) {
        this.logger.info(`Buscando configuração do usuário: ${userId}`);
        return this.repository.findByUserId(userId);
    }
    async createSetting(setting) {
        this.logger.info(`Criando configuração para usuário: ${setting.userId}`);
        return this.repository.create(setting);
    }
    async updateSetting(id, setting) {
        this.logger.info(`Atualizando configuração: ${id}`);
        return this.repository.update(id, setting);
    }
    async deleteSetting(id) {
        this.logger.info(`Deletando configuração: ${id}`);
        return this.repository.delete(id);
    }
};
SettingService = __decorate([
    injectable(),
    __param(0, inject("ISettingRepository")),
    __param(1, inject("Logger")),
    __metadata("design:paramtypes", [Object, Object])
], SettingService);
export { SettingService };
//# sourceMappingURL=SettingService.js.map