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
import { getNaiveNowString } from "../../utils/dateUtils.js";
let SettingService = class SettingService {
    repository;
    agendaRepository;
    logger;
    constructor(repository, agendaRepository, logger) {
        this.repository = repository;
        this.agendaRepository = agendaRepository;
        this.logger = logger;
    }
    /** Extrai HH:mm e dia da semana de uma string "YYYY-MM-DDTHH:mm:ss" */
    getLocalDetails(dateStr) {
        const time = dateStr.substring(11, 16); // "HH:mm"
        const datePart = dateStr.substring(0, 10);
        const weekday = new Date(datePart + 'T12:00:00Z').getUTCDay();
        return { weekday, time };
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
        if (setting.operatingDays || setting.businessHours || setting.timezone) {
            const current = await this.repository.findById(id);
            if (current) {
                const newOperatingDays = setting.operatingDays ?? current.operatingDays ?? [1, 2, 3, 4, 5];
                const newBusinessHours = setting.businessHours ?? current.businessHours;
                const newTimezone = setting.timezone ?? current.timezone ?? 'America/Sao_Paulo';
                const nowStr = getNaiveNowString(newTimezone);
                // Far future = 2 years from now as a date string
                const farFutureYear = parseInt(nowStr.substring(0, 4)) + 2;
                const farFutureStr = `${farFutureYear}${nowStr.substring(4)}`;
                const appointments = await this.agendaRepository.findByDateRange(current.userId, nowStr, farFutureStr);
                for (const app of appointments) {
                    const localStart = this.getLocalDetails(app.startDate);
                    const localEnd = this.getLocalDetails(app.endDate);
                    if (!newOperatingDays.includes(localStart.weekday)) {
                        const formattedDate = `${app.startDate.substring(8, 10)}/${app.startDate.substring(5, 7)}`;
                        throw new Error(`Conflito: Existe um agendamento em ${formattedDate}, mas o dia não terá funcionamento.`);
                    }
                    if (newBusinessHours) {
                        const { startTime, endTime, lunchStart, lunchEnd } = newBusinessHours;
                        if (localStart.time < startTime || localEnd.time > endTime) {
                            const formattedDate = `${app.startDate.substring(8, 10)}/${app.startDate.substring(5, 7)} ${localStart.time}`;
                            throw new Error(`Conflito: Agendamento em ${formattedDate} fora do novo expediente.`);
                        }
                        if (lunchStart && lunchEnd) {
                            if ((localStart.time >= lunchStart && localStart.time < lunchEnd) ||
                                (localEnd.time > lunchStart && localEnd.time <= lunchEnd)) {
                                const formattedDate = `${app.startDate.substring(8, 10)}/${app.startDate.substring(5, 7)} ${localStart.time}`;
                                throw new Error(`Conflito: Agendamento em ${formattedDate} no novo intervalo de almoço.`);
                            }
                        }
                    }
                }
            }
        }
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
    __param(1, inject("IAgendaRepository")),
    __param(2, inject("Logger")),
    __metadata("design:paramtypes", [Object, Object, Object])
], SettingService);
export { SettingService };
//# sourceMappingURL=SettingService.js.map