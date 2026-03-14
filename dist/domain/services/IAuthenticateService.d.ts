import type { User } from "../entities/User.js";
export interface IAuthenticateService {
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
//# sourceMappingURL=IAuthenticateService.d.ts.map