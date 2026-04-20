var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { injectable } from "tsyringe";
import mongoose from "mongoose";
import UserModel from "../models/UserModel.js";
let UserRepository = class UserRepository {
    getIdentifierQuery(identifier) {
        return mongoose.Types.ObjectId.isValid(identifier)
            ? { _id: identifier }
            : { email: identifier };
    }
    async findById(id) {
        const query = this.getIdentifierQuery(id);
        return UserModel.findOne(query).lean({ virtuals: true }).exec();
    }
    async findByEmail(email) {
        return UserModel.findOne({ email }).lean({ virtuals: true }).exec();
    }
    async findByPhone(phone) {
        return UserModel.findOne({ phone }).lean({ virtuals: true }).exec();
    }
    async findAll() {
        return UserModel.find().lean({ virtuals: true }).exec();
    }
    async create(user) {
        const newUser = new UserModel(user);
        return newUser.save();
    }
    async update(id, user) {
        const query = this.getIdentifierQuery(id);
        const updatedUser = await UserModel.findOneAndUpdate(query, user, { new: true }).lean({ virtuals: true }).exec();
        return updatedUser;
    }
    async delete(id) {
        const query = this.getIdentifierQuery(id);
        const result = await UserModel.findOneAndDelete(query).exec();
        return result !== null;
    }
};
UserRepository = __decorate([
    injectable()
], UserRepository);
export { UserRepository };
//# sourceMappingURL=UserRepository.js.map