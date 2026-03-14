import { Router } from "express";
import { userController } from "./controllers/UserController.js";
import { JwtAuthService } from "../../infrastructure/auth/JwtAuthService.js";

const userRoutes = Router();

// Aplica middleware de autenticação em todas as rotas
userRoutes.use(JwtAuthService.authenticateToken);

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
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
 *         password:
 *           type: string
 *           description: Senha do usuário (hash)
 *       example:
 *         id: 60d5ecb74b24c72b8c8b4567
 *         name: João Silva
 *         email: joao@example.com
 *         password: $2a$10$...
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

userRoutes.get("/", (req, res) => userController.getAll(req, res));
userRoutes.get("/:id", (req, res) => userController.getById(req, res));
userRoutes.post("/", (req, res) => userController.create(req, res));
userRoutes.put("/:id", (req, res) => userController.update(req, res));
userRoutes.delete("/:id", (req, res) => userController.delete(req, res));

export default userRoutes;