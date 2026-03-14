var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { injectable } from "tsyringe";
import AgendaModel from "../models/AgendaModel.js";
let AgendaRepository = class AgendaRepository {
    async findById(id) {
        return AgendaModel.findById(id).lean().exec();
    }
    async findAll() {
        return AgendaModel.find().lean().exec();
    }
    async findByUserId(userId) {
        return AgendaModel.find({ userId }).lean().exec();
    }
    async create(agenda) {
        const newAgenda = new AgendaModel(agenda);
        return newAgenda.save();
    }
    async update(id, agenda) {
        return AgendaModel.findByIdAndUpdate(id, agenda, { new: true }).lean().exec();
    }
    async delete(id) {
        const result = await AgendaModel.findByIdAndDelete(id).exec();
        return result !== null;
    }
};
AgendaRepository = __decorate([
    injectable()
], AgendaRepository);
export { AgendaRepository };
//# sourceMappingURL=AgendaRepository.js.map