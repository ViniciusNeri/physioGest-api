# PhysioGest API Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-03-20

### Added
- **API Versioning**: All routes now use `/v1` prefix
- **Core Entities**: User, Patient, Agenda, Financial management
- **Authentication**: JWT-based authentication with Google OAuth integration
- **Category Management**: Create, read, update, delete categories with user linkage
- **Payment Methods**: Support for multiple payment types (cash, credit card, debit card, bank transfer, PIX, check, other)
- **Settings Entity**: User-specific dashboard configuration and system control settings
- **Database**: MongoDB integration with Mongoose schemas
- **Logging**: Pino logger with request/response tracking
- **Messaging**: RabbitMQ integration for async email notifications
- **External Services**: Brevo email provider integration, Google OAuth provider
- **API Documentation**: Swagger/OpenAPI 3.0 specification
- **Error Handling**: Global error middleware with structured logging
- **Request Logging**: Detailed request/response logging with configurable verbosity
- **Health Check**: `/health` endpoint for service monitoring

### Infrastructure
- Express.js server with middleware stack
- TypeScript with ESNext target and Node module resolution
- Dependency injection via tsyringe
- Repository pattern for data access layer
- Service layer for business logic
- Controller layer for HTTP handling
- Clean Architecture with domain, application, infrastructure, and presentation layers

### API Routes (v1)
- `POST /v1/auth/login` - User authentication
- `POST /v1/auth/google` - Google OAuth login
- `GET/POST /v1/users` - User management
- `GET/POST /v1/agendas` - Appointment scheduling
- `GET/POST /v1/financials` - Financial transactions
- `GET/POST /v1/patients` - Patient records
- `GET/POST /v1/categories` - Transaction categories
- `GET/POST /v1/payment-methods` - Payment method definitions
- `GET/POST /v1/settings` - User settings and preferences
- `GET /v1/dashboard` - Dashboard data aggregation
- `GET /health` - Health check
- `GET /swagger.json` - API specification

### Configuration
- Environment variables support via dotenv
- Configurable logging levels
- Request/response body logging toggle
- MongoDB connection string configuration
- JWT secret configuration
- Google OAuth credentials
- Brevo email API keys
- RabbitMQ connection URL
- Frontend CORS configuration

### Documentation
- Swagger/OpenAPI 3.0 specification
- JSDoc comments on all controllers
- Logging documentation (LOGGING.md)
- Environment configuration example (.env.example)

### Testing Infrastructure
- Jest test runner configured
- ts-jest TypeScript support
- Supertest HTTP testing library
- @types/jest type definitions
- Test coverage support

---

## Future Versions

### Planned for 1.1.0
- Unit test suite for services and repositories
- Integration tests for API endpoints
- E2E tests for critical workflows
- API rate limiting
- Request validation schemas (Joi/Zod)
- Comprehensive Swagger documentation for all endpoints

### Planned for 1.2.0
- Database migrations support
- Backup and restore utilities
- Performance monitoring and metrics
- Audit logging for sensitive operations
- Multi-tenancy support

### Planned for 2.0.0
- GraphQL API support alongside REST
- WebSocket support for real-time updates
- Advanced caching layer (Redis)
- Message queue improvements (Kafka support)
- Enhanced security (rate limiting, CORS refinement, CSP headers)
