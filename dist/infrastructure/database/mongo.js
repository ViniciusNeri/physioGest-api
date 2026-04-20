import mongoose from 'mongoose';
import logger from '../logging/Logger.js';
export const connectMongo = async () => {
    const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/physioGest';
    logger.debug("Tentando conectar ao MongoDB", {
        uri: uri.replace(/\/\/.*@/, '//***:***@'), // Oculta credenciais no log
        hasCredentials: uri.includes('@')
    });
    try {
        const startTime = Date.now();
        await mongoose.connect(uri);
        const duration = Date.now() - startTime;
        logger.info("Conectado ao MongoDB com sucesso", {
            duration: `${duration}ms`,
            database: mongoose.connection.db?.databaseName,
            host: mongoose.connection.host,
            port: mongoose.connection.port
        });
        // Configurar listeners de eventos do mongoose
        mongoose.connection.on('error', (error) => {
            logger.error("Erro na conexão do MongoDB", error);
        });
        mongoose.connection.on('disconnected', () => {
            logger.warn("Conexão com MongoDB perdida");
        });
        mongoose.connection.on('reconnected', () => {
            logger.info("Reconectado ao MongoDB");
        });
    }
    catch (error) {
        logger.fatal("Falha ao conectar ao MongoDB", error, {
            uri: uri.replace(/\/\/.*@/, '//***:***@')
        });
        process.exit(1);
    }
};
//# sourceMappingURL=mongo.js.map
