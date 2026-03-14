import { container } from "tsyringe";
import { UserRepository } from "../../infrastructure/database/repositories/UserRepository.js";
import { AgendaRepository } from "../../infrastructure/database/repositories/AgendaRepository.js";
import { FinancialRepository } from "../../infrastructure/database/repositories/FinancialRepository.js";
import { AuthenticateService } from "../../application/services/AuthenticateService.js";
import { UserService } from "../../application/services/UserService.js";
import { AgendaService } from "../../application/services/AgendaService.js";
import { FinancialService } from "../../application/services/FinancialService.js";
import Logger from "../../infrastructure/logging/Logger.js";
import { GoogleProvider } from "../../infrastructure/external/GoogleProvider.js";
import { EmailProvider } from "../../infrastructure/external/EmailProvider.js";
import { RabbitMQService } from "../../infrastructure/messaging/RabbitMQService.js";
// Bindings
container.register("IAuthenticateRepository", {
    useClass: UserRepository,
});
container.register("IUserRepository", {
    useClass: UserRepository,
});
container.register("IAgendaRepository", {
    useClass: AgendaRepository,
});
container.register("IFinancialRepository", {
    useClass: FinancialRepository,
});
container.register("IAuthenticateService", {
    useClass: AuthenticateService,
});
container.register("IUserService", {
    useClass: UserService,
});
container.register("IAgendaService", {
    useClass: AgendaService,
});
container.register("IFinancialService", {
    useClass: FinancialService,
});
// Logger binding (assuming it's already implemented)
container.register("Logger", {
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
//# sourceMappingURL=container.js.map