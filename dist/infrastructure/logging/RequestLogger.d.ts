import type { Request, Response, NextFunction } from 'express';
export interface RequestLoggingOptions {
    logRequestBody?: boolean;
    logResponseBody?: boolean;
    logHeaders?: boolean;
    excludePaths?: string[];
    maskFields?: string[];
}
export declare const createRequestLogger: (options?: RequestLoggingOptions) => (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=RequestLogger.d.ts.map