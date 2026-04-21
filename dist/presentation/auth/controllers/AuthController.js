import { container } from "tsyringe";
export class AuthenticateController {
    service;
    constructor() {
        this.service = container.resolve("IAuthenticateService");
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
    handle = async (req, res) => {
        try {
            const { email, password } = req.body;
            const result = await this.service.login(email, password);
            return res.status(200).json(result);
        }
        catch (error) {
            return res.status(401).json({ message: error.message });
        }
    };
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
    signup = async (req, res) => {
        try {
            const { name, email, password, phone } = req.body;
            const user = await this.service.signup(name, email, password, phone);
            return res.status(201).json({
                message: "Usuário criado com sucesso. Verifique seu email para confirmar o cadastro.",
                user
            });
        }
        catch (error) {
            return res.status(400).json({ message: error.message });
        }
    };
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
    confirmSignup = async (req, res) => {
        try {
            const { email, code } = req.body;
            const user = await this.service.confirmSignup(email, code);
            return res.status(200).json({ message: "Cadastro confirmado", user });
        }
        catch (error) {
            return res.status(400).json({ message: error.message });
        }
    };
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
    forgotPassword = async (req, res) => {
        try {
            const { email } = req.body;
            await this.service.forgotPassword(email);
            // Sempre retornar sucesso para não expor se o email existe
            return res.status(200).json({ message: "Se o email existir, você receberá instruções para redefinir sua senha" });
        }
        catch (error) {
            return res.status(400).json({ message: error.message });
        }
    };
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
    resetPassword = async (req, res) => {
        try {
            const { token, newPassword } = req.body;
            const user = await this.service.resetPassword(token, newPassword);
            return res.status(200).json({ message: "Senha redefinida com sucesso", user });
        }
        catch (error) {
            return res.status(400).json({ message: error.message });
        }
    };
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
    googleLogin = async (req, res) => {
        try {
            const { token } = req.body; // Google ID token
            const result = await this.service.loginWithGoogle(token);
            return res.status(200).json(result);
        }
        catch (error) {
            return res.status(401).json({ message: error.message });
        }
    };
}
export const authenticateController = new AuthenticateController();
//# sourceMappingURL=AuthController.js.map