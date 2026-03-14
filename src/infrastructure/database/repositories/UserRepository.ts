import { injectable } from "tsyringe";
import type { IUserRepository } from "../../../domain/interfaces/IUserRepository.js";
import type { IAuthenticateRepository } from "../../../domain/interfaces/IAuthenticateRepository.js";
import type { User } from "../../../domain/entities/User.js";
import UserModel from "../models/UserModel.js";

@injectable()
export class UserRepository implements IUserRepository, IAuthenticateRepository {
  async findById(id: string): Promise<User | null> {
    return UserModel.findById(id).lean<User>().exec();
  }

  async findByEmail(email: string): Promise<User | null> {
    return UserModel.findOne({ email }).lean<User>().exec();
  }

  async findAll(): Promise<User[]> {
    return UserModel.find().lean<User[]>().exec();
  }

  async create(user: Omit<User, 'id'>): Promise<User> {
    const newUser = new UserModel(user);
    return newUser.save();
  }

  async update(id: string, user: Partial<User>): Promise<User> {
    const updatedUser = await UserModel.findByIdAndUpdate(id, user, { new: true }).lean<User>().exec();
    if (!updatedUser) {
      throw new Error('User not found');
    }
    return updatedUser;
  }

  async delete(id: string): Promise<boolean> {
    const result = await UserModel.findByIdAndDelete(id).exec();
    return result !== null;
  }
}
