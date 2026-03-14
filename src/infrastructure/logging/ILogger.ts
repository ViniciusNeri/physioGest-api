export interface ILogger {
  // Níveis padrão
  info: (message: string, meta?: any) => void;
  error: (message: string, error?: any, meta?: any) => void;
  warn: (message: string, meta?: any) => void;
  debug: (message: string, meta?: any) => void;

  // Níveis adicionais
  trace: (message: string, meta?: any) => void;
  fatal: (message: string, error?: any, meta?: any) => void;

  // Métodos utilitários
  child: (bindings: Record<string, any>) => ILogger;
  level: string;
  setLevel: (level: string) => void;
}