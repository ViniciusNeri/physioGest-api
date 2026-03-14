import type { Request, Response, NextFunction } from "express";
export declare class JwtAuthService {
    static authenticateToken(req: Request, res: Response, next: NextFunction): Response<any, Record<string, any>> | undefined;
}
//# sourceMappingURL=JwtAuthService.d.ts.map