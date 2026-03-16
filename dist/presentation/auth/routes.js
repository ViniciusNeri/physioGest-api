import { Router } from "express";
import { authenticateController } from "./controllers/AuthController.js";
const authRoutes = Router();
/**
 * @swagger
 * components:
 *   schemas:
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: Email do usuário
 *         password:
 *           type: string
 *           description: Senha do usuário
 *       example:
 *         email: "usuario@example.com"
 *         password: "senha123"
 *
 *     LoginResponse:
 *       type: object
 *       properties:
 *         user:
 *           $ref: '#/components/schemas/User'
 *         token:
 *           type: string
 *           description: Token JWT de autenticação
 *       example:
 *         user:
 *           id: "60d5ecb74b24c72b8c8b4567"
 *           name: "João Silva"
 *           email: "usuario@example.com"
 *         token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *
 *     SignupRequest:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         name:
 *           type: string
 *           description: Nome completo do usuário
 *         email:
 *           type: string
 *           format: email
 *           description: Email do usuário
 *         password:
 *           type: string
 *           minLength: 6
 *           description: Senha do usuário (mínimo 6 caracteres)
 *       example:
 *         name: "João Silva"
 *         email: "usuario@example.com"
 *         password: "senha123"
 *
 *     SignupResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Mensagem de confirmação
 *         user:
 *           $ref: '#/components/schemas/User'
 *       example:
 *         message: "Usuário criado com sucesso. Verifique seu email para confirmar o cadastro."
 *         user:
 *           id: "60d5ecb74b24c72b8c8b4567"
 *           name: "João Silva"
 *           email: "usuario@example.com"
 *
 *     ConfirmSignupRequest:
 *       type: object
 *       required:
 *         - email
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: Email do usuário para confirmar cadastro
 *       example:
 *         email: "usuario@example.com"
 *
 *     GoogleLoginRequest:
 *       type: object
 *       required:
 *         - token
 *       properties:
 *         token:
 *           type: string
 *           description: Token ID do Google OAuth
 *       example:
 *         token: "eyJhbGciOiJSUzI1NiIsImtpZCI6..."
 *
 *     VerifyEmailRequest:
 *       type: object
 *       required:
 *         - token
 *       properties:
 *         token:
 *           type: string
 *           description: Token JWT de verificação de email
 *       example:
 *         token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Mensagem de erro
 *       example:
 *         message: "Credenciais inválidas"
 *
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: ID único do usuário
 *         name:
 *           type: string
 *           description: Nome do usuário
 *         email:
 *           type: string
 *           format: email
 *           description: Email do usuário
 *       example:
 *         id: "60d5ecb74b24c72b8c8b4567"
 *         name: "João Silva"
 *         email: "usuario@example.com"
 *
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
authRoutes.post("/sessions", (req, res) => authenticateController.handle(req, res));
authRoutes.post("/signup", authenticateController.signup);
authRoutes.post("/signup/confirm", (req, res) => authenticateController.confirmSignup(req, res));
authRoutes.post("/google", (req, res) => authenticateController.googleLogin(req, res));
authRoutes.post("/verify-email", (req, res) => authenticateController.verifyEmail(req, res));
export default authRoutes;
//# sourceMappingURL=routes.js.map