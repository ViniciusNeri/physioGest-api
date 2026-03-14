import pino from "pino";
// Configuração baseada no ambiente
const getLogLevel = () => {
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
    const config = {
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
class PinoLogger {
    logger;
    constructor(logger) {
        this.logger = logger;
    }
    info(message, meta) {
        this.logger.info(meta || {}, message);
    }
    error(message, error, meta) {
        const logData = meta || {};
        if (error) {
            logData.error = error;
        }
        this.logger.error(logData, message);
    }
    warn(message, meta) {
        this.logger.warn(meta || {}, message);
    }
    debug(message, meta) {
        this.logger.debug(meta || {}, message);
    }
    trace(message, meta) {
        this.logger.trace(meta || {}, message);
    }
    fatal(message, error, meta) {
        const logData = meta || {};
        if (error) {
            logData.error = error;
        }
        this.logger.fatal(logData, message);
    }
    child(bindings) {
        return new PinoLogger(this.logger.child(bindings));
    }
    get level() {
        return this.logger.level;
    }
    setLevel(level) {
        this.logger.level = level;
    }
}
const logger = new PinoLogger(loggerInstance);
export default logger;
//# sourceMappingURL=Logger.js.map