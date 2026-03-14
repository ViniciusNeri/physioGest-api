import pino from "pino";
import type { ILogger } from "./ILogger.js";

// Configuração baseada no ambiente
const getLogLevel = (): string => {
  const env = process.env.NODE_ENV || 'development';
  const configuredLevel = process.env.LOG_LEVEL;

  if (configuredLevel) {
    return configuredLevel;
  }

  // Níveis padrão por ambiente
  switch (env) {
    case 'production':
      return 'info';
    case 'test':
      return 'error';
    case 'development':
    default:
      return 'debug';
  }
};

const getLogConfig = () => {
  const env = process.env.NODE_ENV || 'development';
  const isDevelopment = env === 'development';

  const config: any = {
    level: getLogLevel(),
    serializers: {
      error: pino.stdSerializers.err,
      req: pino.stdSerializers.req,
      res: pino.stdSerializers.res,
    },
    base: {
      env,
      service: 'physioGest-api',
    },
  };

  config.transport = {
    targets: [
      {
        target: "pino-pretty",
        options: {
          colorize: false,
          translateTime: 'SYS:standard',
          ignore: 'pid,hostname',
          destination: "./logs/app.log"
        },
        level: getLogLevel()
      }
    ]
  };

  if (isDevelopment) {
    config.transport.targets.push({
      target: "pino-pretty",
      options: {
        colorize: true,
        translateTime: 'SYS:standard',
        ignore: 'pid,hostname',
        destination: 1
      },
      level: getLogLevel()
    });
  }

  return config;
};

const loggerInstance = pino(getLogConfig());

class PinoLogger implements ILogger {
  private logger: pino.Logger;

  constructor(logger: pino.Logger) {
    this.logger = logger;
  }

  info(message: string, meta?: any): void {
    this.logger.info(meta || {}, message);
  }

  error(message: string, error?: any, meta?: any): void {
    const logData = meta || {};
    if (error) {
      logData.error = error;
    }
    this.logger.error(logData, message);
  }

  warn(message: string, meta?: any): void {
    this.logger.warn(meta || {}, message);
  }

  debug(message: string, meta?: any): void {
    this.logger.debug(meta || {}, message);
  }

  trace(message: string, meta?: any): void {
    this.logger.trace(meta || {}, message);
  }

  fatal(message: string, error?: any, meta?: any): void {
    const logData = meta || {};
    if (error) {
      logData.error = error;
    }
    this.logger.fatal(logData, message);
  }

  child(bindings: Record<string, any>): ILogger {
    return new PinoLogger(this.logger.child(bindings));
  }

  get level(): string {
    return this.logger.level;
  }

  setLevel(level: string): void {
    this.logger.level = level;
  }
}

const logger: ILogger = new PinoLogger(loggerInstance);

export default logger;
export type { ILogger };
