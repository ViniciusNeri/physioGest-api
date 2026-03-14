
import { container } from "tsyringe";
import type { IAuthenticateRepository } from "../../domain/interfaces/IAuthenticateRepository.js";
import type { IUserRepository } from "../../domain/interfaces/IUserRepository.js";
import type { IAgendaRepository } from "../../domain/interfaces/IAgendaRepository.js";
import type { IFinancialRepository } from "../../domain/interfaces/IFinancialRepository.js";
import { UserRepository } from "../../infrastructure/database/repositories/UserRepository.js";
import { AgendaRepository } from "../../infrastructure/database/repositories/AgendaRepository.js";
import { FinancialRepository } from "../../infrastructure/database/repositories/FinancialRepository.js";
import type { IAuthenticateService } from "../../domain/services/IAuthenticateService.js";
import type { IUserService } from "../../domain/services/IUserService.js";
import type { IAgendaService } from "../../domain/services/IAgendaService.js";
import type { IFinancialService } from "../../domain/services/IFinancialService.js";
import { AuthenticateService } from "../../application/services/AuthenticateService.js";
import { UserService } from "../../application/services/UserService.js";
import { AgendaService } from "../../application/services/AgendaService.js";
import { FinancialService } from "../../application/services/FinancialService.js";
import type { ILogger } from "../../infrastructure/logging/Logger.js";
import Logger from "../../infrastructure/logging/Logger.js";
import { GoogleProvider } from "../../infrastructure/external/GoogleProvider.js";
import { EmailProvider } from "../../infrastructure/external/EmailProvider.js";
import { RabbitMQService } from "../../infrastructure/messaging/RabbitMQService.js";

// Bindings
container.register<IAuthenticateRepository>("IAuthenticateRepository", {
  useClass: UserRepository,
});

container.register<IUserRepository>("IUserRepository", {
  useClass: UserRepository,
});

container.register<IAgendaRepository>("IAgendaRepository", {
  useClass: AgendaRepository,
});

container.register<IFinancialRepository>("IFinancialRepository", {
  useClass: FinancialRepository,
});

container.register<IAuthenticateService>("IAuthenticateService", {
  useClass: AuthenticateService,
});

container.register<IUserService>("IUserService", {
  useClass: UserService,
});

container.register<IAgendaService>("IAgendaService", {
  useClass: AgendaService,
});

container.register<IFinancialService>("IFinancialService", {
  useClass: FinancialService,
});

// Logger binding (assuming it's already implemented)
container.register<ILogger>("Logger", {
  useValue: Logger,
});

// External services
container.register("GoogleProvider", {
  useClass: GoogleProvider,
});

container.register("EmailProvider", {
  useClass: EmailProvider,
});

container.register("RabbitMQService", {
  useClass: RabbitMQService,
});
