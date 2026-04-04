
import { container } from "tsyringe";
import type { IAuthenticateRepository } from "../../domain/interfaces/IAuthenticateRepository.js";
import type { IUserRepository } from "../../domain/interfaces/IUserRepository.js";
import type { IAgendaRepository } from "../../domain/interfaces/IAgendaRepository.js";
import type { IFinancialRepository } from "../../domain/interfaces/IFinancialRepository.js";
import type { IPatientRepository } from "../../domain/interfaces/IPatientRepository.js";
import type { IDashboardRepository } from "../../domain/interfaces/IDashboardRepository.js";
import type { IPatientAnamnesisRepository, IPatientFinancialRepository, IPatientAttachmentRepository } from "../../domain/interfaces/IPatientSubdomainRepositories.js";
import type { ICategoryRepository } from "../../domain/interfaces/ICategoryRepository.js";
import type { IPaymentMethodRepository } from "../../domain/interfaces/IPaymentMethodRepository.js";
import type { ISettingRepository } from "../../domain/interfaces/ISettingRepository.js";
import type { IPatientActivityRepository } from "../../domain/interfaces/IPatientActivityRepository.js";
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
import type { IAuthenticateService } from "../../domain/services/IAuthenticateService.js";
import type { IUserService } from "../../domain/services/IUserService.js";
import type { IAgendaService } from "../../domain/services/IAgendaService.js";
import type { IFinancialService } from "../../domain/services/IFinancialService.js";
import type { IPatientService } from "../../domain/services/IPatientService.js";
import type { IDashboardService } from "../../domain/services/IDashboardService.js";
import type { IPatientAnamnesisService, IPatientFinancialService, IPatientAttachmentService } from "../../domain/services/IPatientSubdomainServices.js";
import type { ICategoryService } from "../../domain/services/ICategoryService.js";
import type { IPaymentMethodService } from "../../domain/services/IPaymentMethodService.js";
import type { ISettingService } from "../../domain/services/ISettingService.js";
import type { IPatientActivityService } from "../../domain/services/IPatientActivityService.js";
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

container.register<IPatientRepository>("IPatientRepository", {
  useClass: PatientRepository,
});

container.register<IDashboardRepository>("IDashboardRepository", {
  useClass: DashboardRepository,
});

container.register<IPatientAnamnesisRepository>("IPatientAnamnesisRepository", {
  useClass: PatientAnamnesisRepository,
});

container.register<IPatientFinancialRepository>("IPatientFinancialRepository", {
  useClass: PatientFinancialRepository,
});

container.register<IPatientAttachmentRepository>("IPatientAttachmentRepository", {
  useClass: PatientAttachmentRepository,
});

container.register<ICategoryRepository>("ICategoryRepository", {
  useClass: CategoryRepository,
});

container.register<IPaymentMethodRepository>("IPaymentMethodRepository", {
  useClass: PaymentMethodRepository,
});

container.register<ISettingRepository>("ISettingRepository", {
  useClass: SettingRepository,
});

container.register<IPatientActivityRepository>("IPatientActivityRepository", {
  useClass: PatientActivityRepository,
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

container.register<IPatientService>("IPatientService", {
  useClass: PatientService,
});

container.register<IDashboardService>("IDashboardService", {
  useClass: DashboardService,
});

container.register<ICategoryService>("ICategoryService", {
  useClass: CategoryService,
});

container.register<IPaymentMethodService>("IPaymentMethodService", {
  useClass: PaymentMethodService,
});

container.register<ISettingService>("ISettingService", {
  useClass: SettingService,
});

container.register<IPatientActivityService>("IPatientActivityService", {
  useClass: PatientActivityService,
});

container.register<IPatientAnamnesisService>("IPatientAnamnesisService", {
  useClass: PatientAnamnesisService,
});

container.register<IPatientFinancialService>("IPatientFinancialService", {
  useClass: PatientFinancialService,
});

container.register<IPatientAttachmentService>("IPatientAttachmentService", {
  useClass: PatientAttachmentService,
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
