import express from "express";
import dotenv from "dotenv";
import "reflect-metadata";
import { connectMongo } from "./infrastructure/database/mongo.js";
import authRoutes from "./presentation/auth/routes.js";
import logger from "./infrastructure/logging/Logger.js";
import { setupSwagger } from "./config/swagger.js";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Swagger
setupSwagger(app);

// Rotas
app.use("/auth", authRoutes);

app.listen(PORT, async () => {
  await connectMongo();
  logger.info(`Servidor rodando na porta ${PORT}`);
  logger.info(`Swagger disponível em http://localhost:${PORT}/docs`);
});
