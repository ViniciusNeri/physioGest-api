export interface ILogger {
    info: (message: string, meta?: any) => void;
    error: (message: string, error?: any, meta?: any) => void;
    warn: (message: string, meta?: any) => void;
    debug: (message: string, meta?: any) => void;
    trace: (message: string, meta?: any) => void;
    fatal: (message: string, error?: any, meta?: any) => void;
    child: (bindings: Record<string, any>) => ILogger;
    level: string;
    setLevel: (level: string) => void;
}
//# sourceMappingURL=ILogger.d.ts.map