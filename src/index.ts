import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import "reflect-metadata";
import "./shared/container/container.js";
import { connectMongo } from "./infrastructure/database/mongo.js";
import authRoutes from "./presentation/auth/routes.js";
import userRoutes from "./presentation/user/routes.js";
import agendaRoutes from "./presentation/agenda/routes.js";
import financialRoutes from "./presentation/financial/routes.js";
import patientRoutes from "./presentation/patients/routes.js";
import settingsRoutes from "./presentation/settings/routes.js";
import categoriesRoutes from "./presentation/categories/routes.js";
import paymentMethodsRoutes from "./presentation/paymentMethods/routes.js";
import dashboardRoutes from "./presentation/dashboard/routes.js";
import logger from "./infrastructure/logging/Logger.js";
import { setupSwagger } from "./config/swagger.js";
import { container } from "tsyringe";
import type { RabbitMQService } from "./infrastructure/messaging/RabbitMQService.js";
import type { EmailProvider } from "./infrastructure/external/EmailProvider.js";
import { EmailConsumerService } from "./infrastructure/external/EmailConsumerService.js";
import { createRequestLogger } from "./infrastructure/logging/RequestLogger.js";
import swaggerJsdoc from "swagger-jsdoc";

dotenv.config();

logger.info("Iniciando aplicação PhysioGest API", {
  nodeEnv: process.env.NODE_ENV,
  port: process.env.PORT,
  logLevel: logger.level
});

const app = express();
const PORT = process.env.PORT || 3000;

// Configurar CORS
app.use(cors({
  origin: true,
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Authorization'],
}));

// Gerar especificação Swagger uma vez durante inicialização
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "PhysioGest API",
      version: "1.0.0",
      description: "Documentação da API PhysioGest",
    },
    servers: [
      {
        url: process.env.API_URL || 'http://localhost:3000/v1/',
        description: 'Servidor de Produção/Local',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./src/presentation/**/*.ts"],
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);

logger.debug("Especificação Swagger gerada com sucesso");

// Endpoint para acessar a especificação Swagger em JSON (antes de qualquer middleware)
app.get('/swagger.json', (req, res) => {
  logger.debug("Rota /swagger.json acessada");
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

logger.debug("Configurando middleware Express");
app.use(express.json({
  limit: '10mb',
  verify: (req, res, buf) => {
    logger.trace(`Requisição recebida: ${req.method} ${req.url}`, {
      contentLength: buf.length,
      userAgent: req.headers['user-agent']
    });
  }
}));

// Middleware de logging de requisições
const logRequestBody = process.env.LOG_REQUEST_BODY === 'true';
const logResponseBody = process.env.LOG_RESPONSE_BODY === 'true';
const logHeaders = process.env.LOG_HEADERS === 'true';

app.use(createRequestLogger({
  logRequestBody,
  logResponseBody,
  logHeaders,
  excludePaths: ['/health', '/favicon.ico', '/docs']
}));

// Swagger
logger.debug("Configurando Swagger");
setupSwagger(app);

// Rotas
logger.debug("Configurando rotas da aplicação");

// API v1
const v1Router = express.Router();
v1Router.use("/auth", authRoutes);
v1Router.use("/users", userRoutes);
v1Router.use("/agendas", agendaRoutes);
v1Router.use("/financials", financialRoutes);
v1Router.use("/patients", patientRoutes);
v1Router.use("/settings", settingsRoutes);
v1Router.use("/categories", categoriesRoutes);
v1Router.use("/payment-methods", paymentMethodsRoutes);
v1Router.use("/dashboard", dashboardRoutes);

app.use("/v1", v1Router);

// Middleware de tratamento de erros global
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error("Erro não tratado na aplicação", error, {
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  res.status(500).json({
    message: "Erro interno do servidor",
    ...(process.env.NODE_ENV === 'development' && { error: error.message })
  });
});

// Rota de health check
app.get('/health', (req, res) => {
  logger.debug("Health check solicitado");
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});

app.listen(PORT, async () => {
  logger.info(`Servidor iniciando na porta ${PORT}`);

  try {
    logger.debug("Conectando ao MongoDB");
    await connectMongo();
    logger.info("Conexão com MongoDB estabelecida com sucesso");
  } catch (error) {
    logger.fatal("Falha ao conectar ao MongoDB", error);
    process.exit(1);
  }

  // Initialize RabbitMQ and email consumer (optional)
  try {
    logger.debug("Tentando conectar ao RabbitMQ");
    const rabbitMQService = container.resolve<RabbitMQService>("RabbitMQService");
    await rabbitMQService.connect();

    const emailProvider = container.resolve<EmailProvider>("EmailProvider");
    const emailConsumerService = new EmailConsumerService(rabbitMQService, emailProvider);
    await emailConsumerService.startConsuming();

    logger.info("RabbitMQ conectado e consumidor de email iniciado");
  } catch (error) {
    logger.warn("RabbitMQ não disponível, funcionalidades de email funcionarão em modo fallback", {
      error: (error as Error).message
    });
  }

  logger.info(`🚀 Servidor rodando na porta ${PORT}`, {
    swaggerUrl: `http://localhost:${PORT}/docs`,
    environment: process.env.NODE_ENV,
    logLevel: logger.level
  });
});
