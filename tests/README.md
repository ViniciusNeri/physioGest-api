# Testes - PhysioGest API

Este documento descreve o sistema de testes unitários e de integração implementado no PhysioGest API.

## Estrutura dos Testes

```
tests/
├── setup.ts                    # Configuração global dos testes
├── unit/                       # Testes unitários
│   ├── domain/
│   │   └── entities/          # Testes das entidades
│   ├── application/
│   │   └── services/          # Testes dos serviços
│   ├── infrastructure/        # Testes da infraestrutura
│   └── presentation/          # Testes dos controllers (se necessário)
└── integration/               # Testes de integração
    └── controllers/           # Testes end-to-end dos controllers
```

## Tecnologias Utilizadas

- **Jest**: Framework de testes principal
- **ts-jest**: Suporte ao TypeScript no Jest
- **Supertest**: Testes de integração para APIs Express
- **Jest Mocks**: Para mockar dependências

## Scripts de Teste

```bash
# Executar todos os testes
npm test

# Executar testes em modo watch (re-executa automaticamente)
npm run test:watch

# Executar testes com relatório de cobertura
npm run test:coverage
```

## Tipos de Testes

### 1. Testes Unitários

Testam unidades individuais de código (funções, classes, métodos) de forma isolada.

**Características:**
- Mockam todas as dependências externas
- Focam na lógica de negócio
- Rápidos de executar
- Não dependem de recursos externos

**Exemplo:** `tests/unit/domain/entities/Patient.test.ts`

### 2. Testes de Integração

Testam a integração entre diferentes partes do sistema.

**Características:**
- Testam controllers com Express
- Usam mocks para serviços externos
- Verificam o fluxo completo de uma operação
- Mais lentos que testes unitários

**Exemplo:** `tests/integration/controllers/UserController.test.ts`

## Convenções de Nomenclatura

- Arquivos de teste: `*.test.ts` ou `*.spec.ts`
- Funções de teste: `describe()` para grupos, `it()` para casos individuais
- Mocks: Prefixo `mock` (ex: `mockUserRepository`)

## Padrões de Teste

### Estrutura Básica de um Teste

```typescript
describe('Nome do Componente', () => {
  beforeEach(() => {
    // Setup antes de cada teste
  });

  describe('Método ou Funcionalidade', () => {
    it('deve fazer algo específico', async () => {
      // Arrange
      const input = { /* dados de entrada */ };

      // Act
      const result = await component.method(input);

      // Assert
      expect(result).toBe(expectedValue);
    });
  });
});
```

### Mocking com Jest

```typescript
const mockRepository = {
  findById: jest.fn(),
  create: jest.fn(),
  // ...
} as jest.Mocked<IRepository>;

mockRepository.findById.mockResolvedValue(mockUser);
```

### Testes de API com Supertest

```typescript
const response = await request(app)
  .get('/users/123')
  .expect(200);

expect(response.body).toHaveProperty('id', '123');
```

## Cobertura de Testes

A cobertura de testes mede quantas linhas, funções e branches do código são testadas.

**Métricas importantes:**
- **Statements**: Linhas de código executadas
- **Branches**: Caminhos condicionais (if/else)
- **Functions**: Funções testadas
- **Lines**: Linhas individuais

**Meta recomendada:** > 80% de cobertura

## Boas Práticas

### 1. Testes Independentes
- Cada teste deve ser independente
- Não depender do estado de outros testes
- Usar `beforeEach()` para setup

### 2. Testes Legíveis
- Nomes descritivos para testes
- Arrange-Act-Assert pattern
- Comentários quando necessário

### 3. Mocks Apropriados
- Mockar dependências externas
- Não mockar o código que está sendo testado
- Verificar se mocks foram chamados corretamente

### 4. Cobertura Significativa
- Priorizar testes de lógica complexa
- Evitar testes triviais
- Focar em caminhos alternativos e edge cases

## Executando Testes

### Desenvolvimento
```bash
# Modo watch para desenvolvimento
npm run test:watch

# Testes específicos
npm test -- Patient.test.ts
npm test -- --testNamePattern="deve criar paciente"
```

### CI/CD
```bash
# Com cobertura
npm run test:coverage

# Modo verbose
npm test -- --verbose
```

## Debugging de Testes

### Comandos Úteis
```bash
# Executar apenas um teste
npm test -- --testNamePattern="nome do teste"

# Executar testes de um arquivo específico
npm test -- Patient.test.ts

# Modo debug
npm test -- --inspect-brk
```

### Debugging no VS Code
Adicione ao `.vscode/launch.json`:
```json
{
  "name": "Debug Jest Tests",
  "type": "node",
  "request": "launch",
  "program": "${workspaceFolder}/node_modules/.bin/jest",
  "args": ["--runInBand"],
  "console": "integratedTerminal",
  "internalConsoleOptions": "neverOpen"
}
```

## Próximos Passos

1. **Expandir Cobertura**: Adicionar testes para todos os serviços e controllers
2. **Testes E2E**: Adicionar testes end-to-end com banco real
3. **Testes de Performance**: Benchmarks para operações críticas
4. **Testes de Segurança**: Validação de autenticação e autorização
5. **CI/CD**: Integrar testes no pipeline de deployment

## Contribuição

- Sempre escrever testes para novas funcionalidades
- Manter cobertura acima de 80%
- Seguir padrões estabelecidos
- Revisar testes em code reviews