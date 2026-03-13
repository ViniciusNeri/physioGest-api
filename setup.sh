#!/bin/bash

# Criar estrutura Clean Architecture + SOLID com separação de interfaces e services
mkdir -p src/{domain/{auth/{entities,interfaces,services},user/{entities,interfaces,services},financial/{entities,interfaces,services},patients/{entities,interfaces,services},dashboard/{entities,interfaces,services},agenda/{entities,interfaces,services}},application/{auth,user,financial,patients,dashboard,agenda},infrastructure/{database/models,auth,messaging,external,logging,config},presentation/{auth,user,financial,patients,dashboard,agenda},utils,tests}

# Arquivos principais
touch src/index.ts
touch src/infrastructure/config/env.ts
touch src/infrastructure/database/UserRepositoryMongo.ts
touch src/infrastructure/auth/JwtAuthService.ts
touch src/infrastructure/messaging/RabbitMQService.ts
touch src/infrastructure/external/GoogleProvider.ts
touch src/infrastructure/external/EmailProvider.ts
touch src/infrastructure/logging/Logger.ts

# Domain - Auth
touch src/domain/auth/entities/User.ts
touch src/domain/auth/interfaces/IUserRepository.ts
touch src/domain/auth/interfaces/IAuthService.ts
touch src/domain/auth/services/AuthDomainService.ts

# Application - Auth
touch src/application/auth/LoginUseCase.ts

# Presentation - Auth
touch src/presentation/auth/AuthController.ts
touch src/presentation/auth/routes.ts

echo "Estrutura completa com interfaces e services criada com sucesso 🚀"
