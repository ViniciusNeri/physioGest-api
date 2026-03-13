import { injectable, inject } from "tsyringe";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { IAuthenticateRepository } from "../../domain/interfaces/IAuthenticateRepository.js";
import type { IAuthenticateService } from "../../domain/services/IAuthenticateService.js";
import type { User } from "../../domain/entities/User.js";

@injectable()
export class AuthenticateService implements IAuthenticateService {
  constructor(
    @inject("IAuthenticateRepository")
    private repository: IAuthenticateRepository
  ) {}

  async login(email: string, password: string): Promise<{ token: string; user: User }> {
    const user = await this.repository.findByEmail(email);
    if (!user) throw new Error("Usuário não encontrado");

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) throw new Error("Senha inválida");

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || "default_secret",
      { expiresIn: "1d" }
    );

    return { token, user };
  }

  async signup(name: string, email: string, password: string): Promise<User> {
    const existingUser = await this.repository.findByEmail(email);
    if (existingUser) throw new Error("Email já cadastrado");

    const hashedPassword = await bcrypt.hash(password, 10);
    return this.repository.create({ name, email, password: hashedPassword });
  }

  async confirmSignup(email: string): Promise<User | null> {
    return this.repository.findByEmail(email);
  }
}
