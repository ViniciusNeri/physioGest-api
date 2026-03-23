import type { Request, Response } from "express";
export declare class AuthenticateController {
    private service;
    constructor();
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
    handle: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
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
    signup: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
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
    confirmSignup: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    /**
     * @swagger
     * /auth/forgot-password:
     *   post:
     *     summary: Solicitar redefinição de senha
     *     tags: [Authentication]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/ForgotPasswordRequest'
     *     responses:
     *       200:
     *         description: Email de redefinição enviado
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: "Se o email existir, você receberá instruções para redefinir sua senha"
     *       400:
     *         description: Erro na solicitação
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    forgotPassword: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    /**
     * @swagger
     * /auth/reset-password:
     *   post:
     *     summary: Redefinir senha com token
     *     tags: [Authentication]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/ResetPasswordRequest'
     *     responses:
     *       200:
     *         description: Senha redefinida com sucesso
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: "Senha redefinida com sucesso"
     *                 user:
     *                   $ref: '#/components/schemas/User'
     *       400:
     *         description: Token inválido ou expirado
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    resetPassword: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
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
    googleLogin: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
}
export declare const authenticateController: AuthenticateController;
//# sourceMappingURL=AuthController.d.ts.map