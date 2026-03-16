import type { Request, Response } from "express";
import { container } from "tsyringe";
import type { IAuthenticateService } from "../../../domain/services/IAuthenticateService.js";
import type { GoogleProvider } from "../../../infrastructure/external/GoogleProvider.js";
import jwt from "jsonwebtoken";

export class AuthenticateController {
  private service: IAuthenticateService;

  constructor() {
    this.service = container.resolve<IAuthenticateService>("IAuthenticateService");
  }

  /**
   * @swagger
   * /auth/sessions:
   *   post:
   *     summary: Realizar login
   *     tags: [Authentication]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/LoginRequest'
   *     responses:
   *       200:
   *         description: Login realizado com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/LoginResponse'
   *       401:
   *         description: Credenciais inválidas
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
  handle = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const result = await this.service.login(email, password);
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(401).json({ message: error.message });
    }
  }

  /**
   * @swagger
   * /auth/signup:
   *   post:
   *     summary: Criar nova conta de usuário
   *     tags: [Authentication]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/SignupRequest'
   *     responses:
   *       201:
   *         description: Usuário criado com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/SignupResponse'
   *       400:
   *         description: Dados inválidos ou usuário já existe
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
  signup = async (req: Request, res: Response) => {
    try {
      const { name, email, password } = req.body;
      const user = await this.service.signup(name, email, password);
      return res.status(201).json({
        message: "Usuário criado com sucesso. Verifique seu email para confirmar o cadastro.",
        user
      });
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  /**
   * @swagger
   * /auth/signup/confirm:
   *   post:
   *     summary: Confirmar cadastro via email
   *     tags: [Authentication]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/ConfirmSignupRequest'
   *     responses:
   *       200:
   *         description: Cadastro confirmado com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Cadastro confirmado"
   *                 user:
   *                   $ref: '#/components/schemas/User'
   *       400:
   *         description: Email não encontrado ou já confirmado
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
  confirmSignup = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      const user = await this.service.confirmSignup(email);
      return res.status(200).json({ message: "Cadastro confirmado", user });
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  /**
   * @swagger
   * /auth/google:
   *   post:
   *     summary: Login com Google OAuth
   *     tags: [Authentication]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/GoogleLoginRequest'
   *     responses:
   *       200:
   *         description: Login com Google realizado com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/LoginResponse'
   *       400:
   *         description: Token inválido
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *       401:
   *         description: Falha na autenticação Google
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
  googleLogin = async (req: Request, res: Response) => {
    try {
      const { token } = req.body; // Google ID token
      const googleProvider = container.resolve<GoogleProvider>("GoogleProvider");

      const payload = await googleProvider.verifyToken(token);
      if (!payload) {
        return res.status(400).json({ message: "Token inválido" });
      }

      const { sub: googleId, email, name } = payload;

      const result = await this.service.googleLogin(googleId, email, name);
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(401).json({ message: error.message });
    }
  }

  /**
   * @swagger
   * /auth/verify-email:
   *   post:
   *     summary: Verificar email através de token JWT
   *     tags: [Authentication]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/VerifyEmailRequest'
   *     responses:
   *       200:
   *         description: Email verificado com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Email verificado com sucesso"
   *                 user:
   *                   $ref: '#/components/schemas/User'
   *       400:
   *         description: Token inválido ou expirado
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
  verifyEmail = async (req: Request, res: Response) => {
    try {
      const { token } = req.body;

      const decoded = jwt.verify(token, process.env.JWT_SECRET || "default_secret") as { email: string };
      const user = await this.service.confirmSignup(decoded.email);

      if (!user) {
        return res.status(400).json({ message: "Token inválido ou expirado" });
      }

      return res.status(200).json({ message: "Email verificado com sucesso", user });
    } catch (error: any) {
      return res.status(400).json({ message: "Token inválido ou expirado" });
    }
  }
}

export const authenticateController = new AuthenticateController();
