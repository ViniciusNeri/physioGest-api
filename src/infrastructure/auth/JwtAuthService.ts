import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";

export class JwtAuthService {
  static authenticateToken(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: "Token de acesso não fornecido" });
    }

    jwt.verify(token, process.env.JWT_SECRET || "default_secret", (err: any, user: any) => {
      if (err) {
        return res.status(403).json({ message: "Token inválido" });
      }
      (req as any).user = user;
      next();
    });
  }
}
