import { injectable, inject } from "tsyringe";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { IAuthenticateRepository } from "../../domain/interfaces/IAuthenticateRepository.js";
import type { IAuthenticateService } from "../../domain/services/IAuthenticateService.js";
import type { User } from "../../domain/entities/User.js";
import type { GoogleProvider } from "../../infrastructure/external/GoogleProvider.js";
import type { RabbitMQService } from "../../infrastructure/messaging/RabbitMQService.js";
import type { EmailProvider } from "../../infrastructure/external/EmailProvider.js";
import { container } from "tsyringe";
import logger from "../../infrastructure/logging/Logger.js";

@injectable()
export class AuthenticateService implements IAuthenticateService {
  constructor(
    @inject("IAuthenticateRepository")
    private repository: IAuthenticateRepository,
    @inject("GoogleProvider")
    private googleProvider: GoogleProvider,
    @inject("RabbitMQService")
    private rabbitMQService: RabbitMQService
  ) {}

  async login(email: string, password: string): Promise<{ token: string; user: User }> {
    logger.debug("Tentativa de login", { email, hasPassword: !!password });

    try {
      const user = await this.repository.findByEmail(email);
      if (!user) {
        logger.warn("Tentativa de login com usuário não encontrado", { email });
        throw new Error("Usuário não encontrado");
      }

      logger.debug("Usuário encontrado", { userId: user.id, verified: user.verified });

      if (!user.password) {
        logger.warn("Tentativa de login com senha para usuário do Google", { userId: user.id, email });
        throw new Error("Usuário registrado com Google, faça login com Google");
      }

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        logger.warn("Tentativa de login com senha incorreta", { userId: user.id, email });
        throw new Error("Senha inválida");
      }

      if (!user.verified) {
        logger.warn("Tentativa de login com email não verificado", { userId: user.id, email });
        throw new Error("Email não verificado. Verifique seu email antes de fazer login.");
      }

      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET || "default_secret",
        { expiresIn: "1d" }
      );

      logger.info("Login realizado com sucesso", { userId: user.id, email });
      return { token, user };
    } catch (error) {
      logger.error("Erro durante login", error, { email });
      throw error;
    }
  }

  async signup(name: string, email: string, password: string): Promise<User> {
    logger.debug("Tentativa de cadastro", { name, email });

    try {
      const existingUser = await this.repository.findByEmail(email);
      if (existingUser) {
        logger.warn("Tentativa de cadastro com email já existente", { email });
        throw new Error("Email já cadastrado");
      }

      logger.debug("Criptografando senha");
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await this.repository.create({
        name,
        email,
        password: hashedPassword,
        verified: false
      });

      logger.info("Usuário criado com sucesso", { userId: user.id, email });

      // Enviar email de verificação
      try {
        await this.sendVerificationEmail(email);
        logger.info("Email de verificação enviado", { userId: user.id, email });
      } catch (emailError) {
        logger.error("Falha ao enviar email de verificação", emailError, { userId: user.id, email });
        // Não falha o cadastro por causa do email
      }

      return user;
    } catch (error) {
      logger.error("Erro durante cadastro", error, { name, email });
      throw error;
    }
  }

  async confirmSignup(email: string): Promise<User | null> {
    logger.debug("Tentativa de confirmação de cadastro", { email });

    try {
      const user = await this.repository.findByEmail(email);
      if (!user) {
        logger.warn("Tentativa de confirmação com email não encontrado", { email });
        return null;
      }

      logger.debug("Marcando usuário como verificado", { userId: user.id, email });
      const updatedUser = await this.repository.update(user.id!, { verified: true });

      if (!updatedUser) {
        logger.error("Falha ao atualizar usuário para verificado", { userId: user.id, email });
        throw new Error("Falha ao confirmar cadastro");
      }

      logger.info("Cadastro confirmado com sucesso", { userId: updatedUser.id, email });
      return updatedUser;
    } catch (error) {
      logger.error("Erro durante confirmação de cadastro", error, { email });
      throw error;
    }
  }

  async googleLogin(googleId: string, email: string, name: string): Promise<{ token: string; user: User }> {
    logger.debug("Tentativa de login com Google", { googleId, email, name });

    try {
      let user = await this.repository.findByEmail(email);

      if (!user) {
        logger.debug("Criando novo usuário com Google", { googleId, email, name });
        user = await this.repository.create({
          name,
          email,
          googleId,
          verified: true // Usuários do Google são considerados verificados
        });
        logger.info("Novo usuário criado via Google", { userId: user.id, email, googleId });
      } else {
        logger.debug("Usuário existente fazendo login com Google", { userId: user.id, email });
        // Verificar se já tem googleId
        if (!user.googleId) {
          logger.debug("Atualizando usuário com Google ID", { userId: user.id });
          const updatedUser = await this.repository.update(user.id!, { googleId });
          if (!updatedUser) {
            logger.error("Falha ao atualizar usuário com Google ID", { userId: user.id });
            throw new Error("Falha ao atualizar usuário");
          }
          user = updatedUser;
        }
      }

      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET || "default_secret",
        { expiresIn: "1d" }
      );

      logger.info("Login com Google realizado com sucesso", { userId: user.id, email, googleId });
      return { token, user };
    } catch (error) {
      logger.error("Erro durante login com Google", error, { googleId, email, name });
      throw error;
    }
  }

  async sendVerificationEmail(email: string): Promise<void> {
    logger.debug("Enviando email de verificação", { email });

    try {
      const verificationToken = jwt.sign(
        { email },
        process.env.JWT_SECRET || "default_secret",
        { expiresIn: "24h" }
      );

      const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?token=${verificationToken}`;

      const message = {
        to: email,
        subject: 'Verifique seu email - PhysioGest',
        html: `
          <h1>Bem-vindo ao PhysioGest!</h1>
          <p>Para completar seu cadastro, clique no link abaixo para verificar seu email:</p>
          <a href="${verificationUrl}">Verificar Email</a>
          <p>Este link expira em 24 horas.</p>
        `,
        text: `Bem-vindo ao PhysioGest! Para completar seu cadastro, acesse: ${verificationUrl}. Este link expira em 24 horas.`
      };

      try {
        logger.debug("Tentando enviar email via RabbitMQ", { email });
        // Try to send via RabbitMQ
        await this.rabbitMQService.sendMessage({
          type: 'send_email',
          data: message
        });
        logger.debug("Email enfileirado para envio", { email });
      } catch (error) {
        logger.warn("RabbitMQ não disponível, enviando email diretamente", { email, error: (error as Error).message });
        // Fallback to direct sending if RabbitMQ is not available
        const emailProvider = container.resolve<EmailProvider>("EmailProvider");
        await emailProvider.sendEmail(message);
        logger.debug("Email enviado diretamente", { email });
      }
    } catch (error) {
      logger.error("Erro ao enviar email de verificação", error, { email });
      throw error;
    }
  }
}
