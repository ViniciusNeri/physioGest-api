import type { IAuthenticateRepository } from "../../domain/interfaces/IAuthenticateRepository.js";
import type { IAuthenticateService } from "../../domain/services/IAuthenticateService.js";
import type { User } from "../../domain/entities/User.js";
import type { GoogleProvider } from "../../infrastructure/external/GoogleProvider.js";
import type { RabbitMQService } from "../../infrastructure/messaging/RabbitMQService.js";
export declare class AuthenticateService implements IAuthenticateService {
    private repository;
    private googleProvider;
    private rabbitMQService;
    constructor(repository: IAuthenticateRepository, googleProvider: GoogleProvider, rabbitMQService: RabbitMQService);
    login(email: string, password: string): Promise<{
        token: string;
        user: User;
    }>;
    signup(name: string, email: string, password: string): Promise<User>;
    confirmSignup(email: string): Promise<User | null>;
    googleLogin(googleId: string, email: string, name: string): Promise<{
        token: string;
        user: User;
    }>;
    sendVerificationEmail(email: string): Promise<void>;
}
//# sourceMappingURL=AuthenticateService.d.ts.map