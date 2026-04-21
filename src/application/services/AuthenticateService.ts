import { injectable, inject } from "tsyringe";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { IAuthenticateRepository } from "../../domain/interfaces/IAuthenticateRepository.js";
import type { IAuthenticateService } from "../../domain/services/IAuthenticateService.js";
import type { User } from "../../domain/entities/User.js";
import type { GoogleProvider } from "../../infrastructure/external/GoogleProvider.js";
import type { RabbitMQService } from "../../infrastructure/messaging/RabbitMQService.js";
import type { EmailProvider } from "../../infrastructure/external/EmailProvider.js";
import type { ISettingRepository } from "../../domain/interfaces/ISettingRepository.js";
import { container } from "tsyringe";
import logger from "../../infrastructure/logging/Logger.js";

@injectable()
export class AuthenticateService implements IAuthenticateService {
  private verificationCodes: Map<string, string> = new Map();

  constructor(
    @inject("IAuthenticateRepository")
    private repository: IAuthenticateRepository,
    @inject("ISettingRepository")
    private settingRepository: ISettingRepository,
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

  async signup(name: string, email: string, password: string, phone: string): Promise<User> {
    logger.debug("Tentativa de cadastro", { name, email, phone });

    try {
      const existingUser = await this.repository.findByEmail(email);
      if (existingUser) {
        logger.warn("Tentativa de cadastro com email já existente", { email });
        throw new Error("Email já cadastrado");
      }

      // Sanitização do telefone (remove espaços, parênteses, traços, etc)
      const sanitizedPhone = phone.replace(/\D/g, '');
      if (sanitizedPhone.length < 10) {
        throw new Error("Telefone inválido. Informe o número com DDD.");
      }

      logger.debug("Criptografando senha");
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await this.repository.create({
        name,
        email,
        password: hashedPassword,
        phone: sanitizedPhone,
        verified: false
      });

      logger.info("Usuário criado com sucesso", { userId: user.id, email });

      await this.createSettingsForNewUser(user.id!);
      logger.debug("Configurações iniciais criadas para novo usuário", { userId: user.id });

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

  async confirmSignup(email: string, code: string): Promise<User | null> {
    logger.debug("Tentativa de confirmação de cadastro", { email, hasCode: !!code });

    try {
      const user = await this.repository.findByEmail(email);
      if (!user) {
        logger.warn("Tentativa de confirmação com email não encontrado", { email });
        return null;
      }

      const storedCode = this.verificationCodes.get(email);
      if (!storedCode || storedCode !== code) {
        logger.warn("Código de verificação inválido", { email, providedCode: code });
        throw new Error("Código de verificação inválido");
      }

      logger.debug("Marcando usuário como verificado", { userId: user.id, email });
      const updatedUser = await this.repository.update(user.id!, { verified: true });

      if (!updatedUser) {
        logger.error("Falha ao atualizar usuário para verificado", { userId: user.id, email });
        throw new Error("Falha ao confirmar cadastro");
      }

      // Remover código do cache após verificação bem-sucedida
      this.verificationCodes.delete(email);

      logger.info("Cadastro confirmado com sucesso", { userId: updatedUser.id, email });
      return updatedUser;
    } catch (error) {
      logger.error("Erro durante confirmação de cadastro", error, { email });
      throw error;
    }
  }

  async forgotPassword(email: string): Promise<void> {
    logger.debug("Solicitação de redefinição de senha", { email });

    try {
      const user = await this.repository.findByEmail(email);
      if (!user) {
        logger.warn("Tentativa de redefinição de senha com email não encontrado", { email });
        // Não retornar erro para não expor se o email existe ou não
        return;
      }

      if (!user.verified) {
        logger.warn("Tentativa de redefinição de senha com email não verificado", { email });
        // Não retornar erro
        return;
      }

      // Gerar token de redefinição (válido por 1 hora)
      const resetToken = jwt.sign(
        { email, type: 'password_reset' },
        process.env.JWT_SECRET || "default_secret",
        { expiresIn: "1h" }
      );

      const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;

      const message = {
        to: email,
        subject: 'Redefinição de Senha - PhysioGest',
        html: `
          <!DOCTYPE html>
          <html lang="pt-BR">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Redefinição de Senha - PhysioGest</title>
            <style>
              body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                margin: 0;
                padding: 0;
                background-color: #f4f4f4;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              }
              .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 40px 30px;
                text-align: center;
              }
              .header h1 {
                margin: 0;
                font-size: 28px;
                font-weight: 300;
              }
              .content {
                padding: 40px 30px;
                color: #333333;
                line-height: 1.6;
              }
              .button {
                display: inline-block;
                padding: 15px 30px;
                background-color: #667eea;
                color: white;
                text-decoration: none;
                border-radius: 6px;
                font-weight: 500;
                margin: 20px 0;
                text-align: center;
              }
              .button:hover {
                background-color: #5a6fd8;
              }
              .footer {
                background-color: #f8f9fa;
                padding: 20px 30px;
                text-align: center;
                color: #666666;
                font-size: 14px;
              }
              .warning {
                background-color: #fff3cd;
                border: 1px solid #ffeaa7;
                color: #856404;
                padding: 15px;
                border-radius: 4px;
                margin: 20px 0;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>PhysioGest</h1>
                <p>Sistema de Gestão Fisioterapêutica</p>
              </div>
              
              <div class="content">
                <h2>Redefinição de Senha</h2>
                <p>Olá ${user.name}!</p>
                <p>Recebemos uma solicitação para redefinir sua senha no <strong>PhysioGest</strong>. Se você não solicitou esta alteração, ignore este email.</p>
                
                <p>Para redefinir sua senha, clique no botão abaixo:</p>
                
                <div style="text-align: center;">
                  <a href="${resetUrl}" class="button">Redefinir Senha</a>
                </div>
                
                <p>Este link é válido por 1 hora. Após expirar, você precisará solicitar uma nova redefinição.</p>
                
                <div class="warning">
                  <strong>Importante:</strong> Não compartilhe este link com ninguém. Nossa equipe nunca solicitará seus dados pessoais por email.
                </div>
                
                <p>Atenciosamente,<br>
                <strong>Equipe PhysioGest</strong></p>
              </div>
              
              <div class="footer">
                <p>Este é um email automático, por favor não responda.</p>
                <p>&copy; 2026 PhysioGest. Todos os direitos reservados.</p>
              </div>
            </div>
          </body>
          </html>
        `,
        text: `PhysioGest - Redefinição de Senha

Olá ${user.name}!

Recebemos uma solicitação para redefinir sua senha no PhysioGest.

Para redefinir sua senha, acesse: ${resetUrl}

Este link é válido por 1 hora.

Se você não solicitou esta alteração, ignore este email.

Atenciosamente,
Equipe PhysioGest

---
Este é um email automático. Não responda a este email.`
      };

      try {
        logger.debug("Tentando enviar email de redefinição via RabbitMQ", { email });
        await this.rabbitMQService.sendMessage({
          type: 'send_email',
          data: message
        });
        logger.debug("Email de redefinição enfileirado", { email });
      } catch (error) {
        logger.warn("RabbitMQ não disponível, enviando email diretamente", { email, error: (error as Error).message });
        const emailProvider = container.resolve<EmailProvider>("EmailProvider");
        await emailProvider.sendEmail(message);
        logger.debug("Email de redefinição enviado diretamente", { email });
      }

      logger.info("Email de redefinição de senha enviado", { userId: user.id, email });
    } catch (error) {
      logger.error("Erro ao processar solicitação de redefinição de senha", error, { email });
      throw error;
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<User | null> {
    logger.debug("Tentativa de redefinição de senha com token");

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "default_secret") as { email: string; type: string };

      if (decoded.type !== 'password_reset') {
        logger.warn("Token inválido para redefinição de senha");
        throw new Error("Token inválido");
      }

      const user = await this.repository.findByEmail(decoded.email);
      if (!user) {
        logger.warn("Tentativa de redefinição com email não encontrado", { email: decoded.email });
        throw new Error("Usuário não encontrado");
      }

      logger.debug("Criptografando nova senha");
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      const updatedUser = await this.repository.update(user.id!, { password: hashedPassword });

      if (!updatedUser) {
        logger.error("Falha ao atualizar senha do usuário", { userId: user.id });
        throw new Error("Falha ao redefinir senha");
      }

      logger.info("Senha redefinida com sucesso", { userId: updatedUser.id });
      return updatedUser;
    } catch (error) {
      logger.error("Erro durante redefinição de senha", error);
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
          phone: '',  // phone pode ser atualizado posteriormente pelo usuário
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

  async loginWithGoogle(token: string): Promise<{ token: string; user: User }> {
    logger.debug("Tentativa de login com token do Google");

    try {
      const payload = await this.googleProvider.verifyToken(token);
      if (!payload) {
        logger.warn("Token do Google inválido");
        throw new Error("Token do Google inválido");
      }

      const { sub: googleId, email, name } = payload;
      return await this.googleLogin(googleId, email!, name!);
    } catch (error) {
      logger.error("Erro durante login com token do Google", error);
      throw error;
    }
  }

  async sendVerificationEmail(email: string): Promise<void> {
    logger.debug("Enviando email de verificação", { email });

    try {
      // Gerar código de verificação de 6 dígitos
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

      // Armazenar código no cache
      this.verificationCodes.set(email, verificationCode);

      const message = {
        to: email,
        subject: 'Código de Verificação - PhysioGest',
        html: `
          <!DOCTYPE html>
          <html lang="pt-BR">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Verificação de Email - PhysioGest</title>
            <style>
              body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                margin: 0;
                padding: 0;
                background-color: #f4f4f4;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              }
              .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 40px 30px;
                text-align: center;
              }
              .header h1 {
                margin: 0;
                font-size: 28px;
                font-weight: 300;
              }
              .content {
                padding: 40px 30px;
                color: #333333;
                line-height: 1.6;
              }
              .code-container {
                text-align: center;
                margin: 30px 0;
              }
              .verification-code {
                display: inline-block;
                font-size: 32px;
                font-weight: bold;
                color: #667eea;
                background-color: #f8f9fa;
                border: 2px solid #667eea;
                border-radius: 8px;
                padding: 15px 30px;
                letter-spacing: 4px;
                margin: 20px 0;
              }
              .footer {
                background-color: #f8f9fa;
                padding: 20px 30px;
                text-align: center;
                color: #666666;
                font-size: 14px;
              }
              .warning {
                background-color: #fff3cd;
                border: 1px solid #ffeaa7;
                color: #856404;
                padding: 15px;
                border-radius: 4px;
                margin: 20px 0;
              }
              .button {
                display: inline-block;
                padding: 12px 24px;
                background-color: #667eea;
                color: white;
                text-decoration: none;
                border-radius: 6px;
                font-weight: 500;
                margin: 10px 0;
              }
              .button:hover {
                background-color: #5a6fd8;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>PhysioGest</h1>
                <p>Sistema de Gestão Fisioterapêutica</p>
              </div>
              
              <div class="content">
                <h2>Verificação de Email</h2>
                <p>Olá!</p>
                <p>Obrigado por se cadastrar no <strong>PhysioGest</strong>. Para completar seu registro e garantir a segurança da sua conta, precisamos verificar seu endereço de email.</p>
                
                <div class="code-container">
                  <p><strong>Seu código de verificação é:</strong></p>
                  <div class="verification-code">${verificationCode}</div>
                </div>
                
                <p>Insira este código na aplicação para confirmar seu cadastro. O código é válido por 24 horas.</p>
                
                <div class="warning">
                  <strong>Importante:</strong> Não compartilhe este código com ninguém. Nossa equipe nunca solicitará seus dados pessoais por email.
                </div>
                
                <p>Se você não solicitou este cadastro, ignore este email.</p>
                
                <p>Atenciosamente,<br>
                <strong>Equipe PhysioGest</strong></p>
              </div>
              
              <div class="footer">
                <p>Este é um email automático, por favor não responda.</p>
                <p>&copy; 2026 PhysioGest. Todos os direitos reservados.</p>
              </div>
            </div>
          </body>
          </html>
        `,
        text: `PhysioGest - Verificação de Email

Olá!

Obrigado por se cadastrar no PhysioGest. Para completar seu registro, use o código de verificação: ${verificationCode}

Este código expira em 24 horas.

Se você não solicitou este cadastro, ignore este email.

Atenciosamente,
Equipe PhysioGest

---
Este é um email automático. Não responda a este email.`
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

 private async createSettingsForNewUser(userId: string): Promise<void> {
  logger.debug("Criando configurações iniciais para novo usuário", { userId });
  
    try {
    // 1. Criação das Configurações Iniciais
    const settings = await this.settingRepository.create({
      userId,
      dashboardTheme: 'light',
      showWeeklyAppointments: true,
      showMonthlyIncome: true,
      showActivePayments: true,
      showNextAppointment: true,
      categoryControlMode: 'none',
    });    
    } catch (error) {
      console.error("Erro ao inicializar dados do usuário:", error);
      throw error;
    }
  }
}
