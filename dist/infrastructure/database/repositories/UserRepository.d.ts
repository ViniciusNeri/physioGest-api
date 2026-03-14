import type { IUserRepository } from "../../../domain/interfaces/IUserRepository.js";
import type { IAuthenticateRepository } from "../../../domain/interfaces/IAuthenticateRepository.js";
import type { User } from "../../../domain/entities/User.js";
export declare class UserRepository implements IUserRepository, IAuthenticateRepository {
    findById(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    findAll(): Promise<User[]>;
    create(user: Omit<User, 'id'>): Promise<User>;
    update(id: string, user: Partial<User>): Promise<User>;
    delete(id: string): Promise<boolean>;
}
//# sourceMappingURL=UserRepository.d.ts.map