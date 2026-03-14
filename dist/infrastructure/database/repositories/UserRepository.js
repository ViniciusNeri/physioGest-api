var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { injectable } from "tsyringe";
import UserModel from "../models/UserModel.js";
let UserRepository = class UserRepository {
    async findById(id) {
        return UserModel.findById(id).lean().exec();
    }
    async findByEmail(email) {
        return UserModel.findOne({ email }).lean().exec();
    }
    async findAll() {
        return UserModel.find().lean().exec();
    }
    async create(user) {
        const newUser = new UserModel(user);
        return newUser.save();
    }
    async update(id, user) {
        const updatedUser = await UserModel.findByIdAndUpdate(id, user, { new: true }).lean().exec();
        if (!updatedUser) {
            throw new Error('User not found');
        }
        return updatedUser;
    }
    async delete(id) {
        const result = await UserModel.findByIdAndDelete(id).exec();
        return result !== null;
    }
};
UserRepository = __decorate([
    injectable()
], UserRepository);
export { UserRepository };
//# sourceMappingURL=UserRepository.js.map