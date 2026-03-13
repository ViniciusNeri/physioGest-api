
import { container } from "tsyringe";
import type { IAuthenticateRepository } from "../../domain/interfaces/IAuthenticateRepository.js";
import { UserRepository } from "../../infrastructure/database/repositories/UserRepository.js";
import type { IAuthenticateService } from "../../domain/services/IAuthenticateService.js";
import { AuthenticateService } from "../../application/services/AuthenticateService.js";

// Bindings
container.register<IAuthenticateRepository>("IAuthenticateRepository", {
  useClass: UserRepository,
});

container.register<IAuthenticateService>("IAuthenticateService", {
  useClass: AuthenticateService,
});
