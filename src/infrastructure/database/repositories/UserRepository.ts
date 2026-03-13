import { injectable } from "tsyringe";
import type { IAuthenticateRepository } from "../../../domain/interfaces/IAuthenticateRepository.js";
import type { User } from "../../../domain/entities/User.js";
import UserModel from "../models/UserModel.js";

@injectable()
export class UserRepository implements IAuthenticateRepository {
  async findByEmail(email: string): Promise<User | null> {
    return UserModel.findOne({ email }).lean<User>().exec();
  }

  async create(user: User): Promise<User> {
    const newUser = new UserModel(user);
    return newUser.save();
  }
}
