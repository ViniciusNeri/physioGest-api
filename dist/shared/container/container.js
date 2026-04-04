import { container } from "tsyringe";
import { UserRepository } from "../../infrastructure/database/repositories/UserRepository.js";
import { AgendaRepository } from "../../infrastructure/database/repositories/AgendaRepository.js";
import { FinancialRepository } from "../../infrastructure/database/repositories/FinancialRepository.js";
import { PatientRepository } from "../../infrastructure/database/repositories/PatientRepository.js";
import { DashboardRepository } from "../../infrastructure/database/repositories/DashboardRepository.js";
import { PatientAnamnesisRepository } from "../../infrastructure/database/repositories/PatientAnamnesisRepository.js";
import { PatientFinancialRepository } from "../../infrastructure/database/repositories/PatientFinancialRepository.js";
import { PatientAttachmentRepository } from "../../infrastructure/database/repositories/PatientAttachmentRepository.js";
import { CategoryRepository } from "../../infrastructure/database/repositories/CategoryRepository.js";
import { PaymentMethodRepository } from "../../infrastructure/database/repositories/PaymentMethodRepository.js";
import { SettingRepository } from "../../infrastructure/database/repositories/SettingRepository.js";
import { PatientActivityRepository } from "../../infrastructure/database/repositories/PatientActivityRepository.js";
import { AuthenticateService } from "../../application/services/AuthenticateService.js";
import { UserService } from "../../application/services/UserService.js";
import { AgendaService } from "../../application/services/AgendaService.js";
import { FinancialService } from "../../application/services/FinancialService.js";
import { PatientService } from "../../application/services/PatientService.js";
import { DashboardService } from "../../application/services/DashboardService.js";
import { PatientAnamnesisService } from "../../application/services/PatientAnamnesisService.js";
import { PatientFinancialService } from "../../application/services/PatientFinancialService.js";
import { PatientAttachmentService } from "../../application/services/PatientAttachmentService.js";
import { CategoryService } from "../../application/services/CategoryService.js";
import { PaymentMethodService } from "../../application/services/PaymentMethodService.js";
import { SettingService } from "../../application/services/SettingService.js";
import { PatientActivityService } from "../../application/services/PatientActivityService.js";
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
container.register("IPatientRepository", {
    useClass: PatientRepository,
});
container.register("IDashboardRepository", {
    useClass: DashboardRepository,
});
container.register("IPatientAnamnesisRepository", {
    useClass: PatientAnamnesisRepository,
});
container.register("IPatientFinancialRepository", {
    useClass: PatientFinancialRepository,
});
container.register("IPatientAttachmentRepository", {
    useClass: PatientAttachmentRepository,
});
container.register("ICategoryRepository", {
    useClass: CategoryRepository,
});
container.register("IPaymentMethodRepository", {
    useClass: PaymentMethodRepository,
});
container.register("ISettingRepository", {
    useClass: SettingRepository,
});
container.register("IPatientActivityRepository", {
    useClass: PatientActivityRepository,
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
container.register("IPatientService", {
    useClass: PatientService,
});
container.register("IDashboardService", {
    useClass: DashboardService,
});
container.register("ICategoryService", {
    useClass: CategoryService,
});
container.register("IPaymentMethodService", {
    useClass: PaymentMethodService,
});
container.register("ISettingService", {
    useClass: SettingService,
});
container.register("IPatientActivityService", {
    useClass: PatientActivityService,
});
container.register("IPatientAnamnesisService", {
    useClass: PatientAnamnesisService,
});
container.register("IPatientFinancialService", {
    useClass: PatientFinancialService,
});
container.register("IPatientAttachmentService", {
    useClass: PatientAttachmentService,
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