var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { injectable, inject } from "tsyringe";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { container } from "tsyringe";
import logger from "../../infrastructure/logging/Logger.js";
let AuthenticateService = class AuthenticateService {
    repository;
    googleProvider;
    rabbitMQService;
    constructor(repository, googleProvider, rabbitMQService) {
        this.repository = repository;
        this.googleProvider = googleProvider;
        this.rabbitMQService = rabbitMQService;
    }
    async login(email, password) {
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
            const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || "default_secret", { expiresIn: "1d" });
            logger.info("Login realizado com sucesso", { userId: user.id, email });
            return { token, user };
        }
        catch (error) {
            logger.error("Erro durante login", error, { email });
            throw error;
        }
    }
    async signup(name, email, password) {
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
            }
            catch (emailError) {
                logger.error("Falha ao enviar email de verificação", emailError, { userId: user.id, email });
                // Não falha o cadastro por causa do email
            }
            return user;
        }
        catch (error) {
            logger.error("Erro durante cadastro", error, { name, email });
            throw error;
        }
    }
    async confirmSignup(email) {
        logger.debug("Tentativa de confirmação de cadastro", { email });
        try {
            const user = await this.repository.findByEmail(email);
            if (!user) {
                logger.warn("Tentativa de confirmação com email não encontrado", { email });
                return null;
            }
            logger.debug("Marcando usuário como verificado", { userId: user.id, email });
            const updatedUser = await this.repository.update(user.id, { verified: true });
            if (!updatedUser) {
                logger.error("Falha ao atualizar usuário para verificado", { userId: user.id, email });
                throw new Error("Falha ao confirmar cadastro");
            }
            logger.info("Cadastro confirmado com sucesso", { userId: updatedUser.id, email });
            return updatedUser;
        }
        catch (error) {
            logger.error("Erro durante confirmação de cadastro", error, { email });
            throw error;
        }
    }
    async googleLogin(googleId, email, name) {
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
            }
            else {
                logger.debug("Usuário existente fazendo login com Google", { userId: user.id, email });
                // Verificar se já tem googleId
                if (!user.googleId) {
                    logger.debug("Atualizando usuário com Google ID", { userId: user.id });
                    const updatedUser = await this.repository.update(user.id, { googleId });
                    if (!updatedUser) {
                        logger.error("Falha ao atualizar usuário com Google ID", { userId: user.id });
                        throw new Error("Falha ao atualizar usuário");
                    }
                    user = updatedUser;
                }
            }
            const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || "default_secret", { expiresIn: "1d" });
            logger.info("Login com Google realizado com sucesso", { userId: user.id, email, googleId });
            return { token, user };
        }
        catch (error) {
            logger.error("Erro durante login com Google", error, { googleId, email, name });
            throw error;
        }
    }
    async sendVerificationEmail(email) {
        logger.debug("Enviando email de verificação", { email });
        try {
            const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET || "default_secret", { expiresIn: "24h" });
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
            }
            catch (error) {
                logger.warn("RabbitMQ não disponível, enviando email diretamente", { email, error: error.message });
                // Fallback to direct sending if RabbitMQ is not available
                const emailProvider = container.resolve("EmailProvider");
                await emailProvider.sendEmail(message);
                logger.debug("Email enviado diretamente", { email });
            }
        }
        catch (error) {
            logger.error("Erro ao enviar email de verificação", error, { email });
            throw error;
        }
    }
};
AuthenticateService = __decorate([
    injectable(),
    __param(0, inject("IAuthenticateRepository")),
    __param(1, inject("GoogleProvider")),
    __param(2, inject("RabbitMQService")),
    __metadata("design:paramtypes", [Object, Function, Function])
], AuthenticateService);
export { AuthenticateService };
//# sourceMappingURL=AuthenticateService.js.map