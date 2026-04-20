import { injectable } from "tsyringe";
import mongoose from "mongoose";
import type { IUserRepository } from "../../../domain/interfaces/IUserRepository.js";
import type { IAuthenticateRepository } from "../../../domain/interfaces/IAuthenticateRepository.js";
import type { User } from "../../../domain/entities/User.js";
import UserModel from "../models/UserModel.js";

@injectable()
export class UserRepository implements IUserRepository, IAuthenticateRepository {
  private getIdentifierQuery(identifier: string) {
    return mongoose.Types.ObjectId.isValid(identifier) 
      ? { _id: identifier } 
      : { email: identifier };
  }

  async findById(id: string): Promise<User | null> {
    const query = this.getIdentifierQuery(id);
    return UserModel.findOne(query).lean<User>({ virtuals: true }).exec();
  }

  async findByEmail(email: string): Promise<User | null> {
    return UserModel.findOne({ email }).lean<User>({ virtuals: true }).exec();
  }

  async findByPhone(phone: string): Promise<User | null> {
    return UserModel.findOne({ phone }).lean<User>({ virtuals: true }).exec();
  }

  async findAll(): Promise<User[]> {
    return UserModel.find().lean<User[]>({ virtuals: true }).exec();
  }

  async create(user: Omit<User, 'id'>): Promise<User> {
    const newUser = new UserModel(user);
    return newUser.save();
  }

  async update(id: string, user: Partial<User>): Promise<User | null> {
    const query = this.getIdentifierQuery(id);
    const updatedUser = await UserModel.findOneAndUpdate(query, user, { new: true }).lean<User>({ virtuals: true }).exec();
    return updatedUser;
  }

  async delete(id: string): Promise<boolean> {
    const query = this.getIdentifierQuery(id);
    const result = await UserModel.findOneAndDelete(query).exec();
    return result !== null;
  }
}
