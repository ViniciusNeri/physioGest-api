import { injectable, inject } from "tsyringe";
import type { ISettingRepository } from "../../domain/interfaces/ISettingRepository.js";
import type { ISettingService } from "../../domain/services/ISettingService.js";
import type { Setting } from "../../domain/entities/Setting.js";
import type { ILogger } from "../../infrastructure/logging/Logger.js";

@injectable()
export class SettingService implements ISettingService {
  constructor(
    @inject("ISettingRepository")
    private repository: ISettingRepository,
    @inject("Logger")
    private logger: ILogger
  ) {}

  async getSettingById(id: string): Promise<Setting | null> {
    this.logger.info(`Buscando configuração por ID: ${id}`);
    return this.repository.findById(id);
  }

  async getAllSettings(): Promise<Setting[]> {
    this.logger.info("Buscando todas as configurações");
    return this.repository.findAll();
  }

  async getSettingByUserId(userId: string): Promise<Setting | null> {
    this.logger.info(`Buscando configuração do usuário: ${userId}`);
    return this.repository.findByUserId(userId);
  }

  async createSetting(setting: Omit<Setting, 'id'>): Promise<Setting> {
    this.logger.info(`Criando configuração para usuário: ${setting.userId}`);
    return this.repository.create(setting as Setting);
  }

  async updateSetting(id: string, setting: Partial<Setting>): Promise<Setting | null> {
    this.logger.info(`Atualizando configuração: ${id}`);
    return this.repository.update(id, setting);
  }

  async deleteSetting(id: string): Promise<boolean> {
    this.logger.info(`Deletando configuração: ${id}`);
    return this.repository.delete(id);
  }
}
