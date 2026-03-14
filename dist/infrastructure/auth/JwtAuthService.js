import jwt from "jsonwebtoken";
export class JwtAuthService {
    static authenticateToken(req, res, next) {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: "Token de acesso não fornecido" });
        }
        jwt.verify(token, process.env.JWT_SECRET || "default_secret", (err, user) => {
            if (err) {
                return res.status(403).json({ message: "Token inválido" });
            }
            req.user = user;
            next();
        });
    }
}
//# sourceMappingURL=JwtAuthService.js.map