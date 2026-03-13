import { Router } from "express";
import { authenticateController } from "./controllers/AuthController.js";

const authRoutes = Router();

authRoutes.post("/sessions", (req, res) => authenticateController.handle(req, res));
authRoutes.post("/signup", (req, res) => authenticateController.signup(req, res));
authRoutes.post("/signup/confirm", (req, res) => authenticateController.confirmSignup(req, res));

export default authRoutes;
