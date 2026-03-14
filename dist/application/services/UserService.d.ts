import type { IUserRepository } from "../../domain/interfaces/IUserRepository.js";
import type { IUserService } from "../../domain/services/IUserService.js";
import type { User } from "../../domain/entities/User.js";
export declare class UserService implements IUserService {
    private repository;
    constructor(repository: IUserRepository);
    getUserById(id: string): Promise<User | null>;
    getAllUsers(): Promise<User[]>;
    createUser(user: Omit<User, 'id'>): Promise<User>;
    updateUser(id: string, user: Partial<User>): Promise<User | null>;
    deleteUser(id: string): Promise<boolean>;
}
//# sourceMappingURL=UserService.d.ts.map