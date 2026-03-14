# Sistema de Logging - PhysioGest API

## Visão Geral

A aplicação PhysioGest API possui um sistema de logging abrangente e configurável baseado no Pino, com níveis parametrizáveis e logging estruturado em toda a aplicação.

## Níveis de Log

- **TRACE**: Informações muito detalhadas para debugging profundo
- **DEBUG**: Informações de debugging úteis durante desenvolvimento
- **INFO**: Informações gerais sobre operações normais
- **WARN**: Avisos sobre situações potencialmente problemáticas
- **ERROR**: Erros que não impedem a continuação da aplicação
- **FATAL**: Erros críticos que podem causar falha da aplicação

## Configuração

### Variáveis de Ambiente

```env
# Nível de log (trace, debug, info, warn, error, fatal)
LOG_LEVEL=info

# Ambiente (development, production, test)
NODE_ENV=development

# Logging de requisições/respostas HTTP
LOG_REQUEST_BODY=false    # Log do corpo das requisições
LOG_RESPONSE_BODY=false   # Log do corpo das respostas
LOG_HEADERS=false         # Log dos headers HTTP
```

### Níveis por Ambiente

- **Development**: `debug` (mais verboso)
- **Production**: `info` (moderado)
- **Test**: `error` (apenas erros)

## Uso nos Serviços

### Importação

```typescript
import logger from '../infrastructure/logging/Logger.js';
```

### Exemplos de Uso

```typescript
// Log simples
logger.info("Usuário logado com sucesso", { userId: "123", email: "user@example.com" });

// Log com erro
logger.error("Falha ao processar pagamento", error, { orderId: "456", amount: 99.99 });

// Log de debug
logger.debug("Iniciando processamento", { items: 150, batchSize: 50 });

// Log de warning
logger.warn("Limite de tentativas excedido", { userId: "123", attempts: 5 });

// Log estruturado
logger.info("Pedido criado", {
  orderId: "789",
  customerId: "123",
  items: ["item1", "item2"],
  total: 199.99,
  timestamp: new Date().toISOString()
});
```

## Logging HTTP

### Middleware Automático

O middleware `createRequestLogger` automaticamente loga todas as requisições HTTP com:

- Método e URL
- Status code da resposta
- Tempo de duração
- IP do cliente
- User-Agent
- Tamanho do conteúdo (opcional)

### Configuração Avançada

```typescript
app.use(createRequestLogger({
  logRequestBody: true,      // Log do corpo das requisições
  logResponseBody: false,    // Log do corpo das respostas
  logHeaders: true,          // Log dos headers
  excludePaths: ['/health'], // Caminhos a excluir do log
  maskFields: ['password', 'token'] // Campos a mascarar
}));
```

## Campos Sensíveis

O sistema automaticamente mascara campos sensíveis nos logs:

- `password`
- `token`
- `authorization`
- `api-key`
- `credit_card`
- `ssn`

## Estrutura dos Logs

### Formato Development

```
[2024-01-15 10:30:45.123] INFO  (12345): Usuário logado com sucesso
    userId: "123"
    email: "user@example.com"
    duration: "150ms"
```

### Formato Production

```json
{
  "level": 30,
  "time": 1705312245123,
  "pid": 12345,
  "hostname": "server-01",
  "env": "production",
  "service": "physioGest-api",
  "msg": "Usuário logado com sucesso",
  "userId": "123",
  "email": "user@example.com",
  "duration": "150ms"
}
```

## Monitoramento

### Health Check

A aplicação inclui um endpoint `/health` que retorna informações sobre:

- Status da aplicação
- Timestamp
- Uptime
- Uso de memória
- Status das conexões

### Métricas de Performance

Os logs incluem medições de performance:

- Tempo de resposta das requisições
- Tempo de conexão com banco de dados
- Tempo de envio de emails
- Tempo de verificação de tokens

## Boas Práticas

1. **Use o nível apropriado**: Não use `error` para situações normais
2. **Inclua contexto**: Sempre adicione metadados relevantes
3. **Evite dados sensíveis**: Use mascaramento automático
4. **Seja consistente**: Use padrões similares em toda a aplicação
5. **Performance**: Considere o impacto no performance em produção

## Troubleshooting

### Logs não aparecem

- Verifique `LOG_LEVEL` - pode estar muito restritivo
- Verifique `NODE_ENV` - afeta o nível padrão

### Logs muito verbosos

- Ajuste `LOG_LEVEL` para um nível menos verboso
- Use `excludePaths` para reduzir logs de endpoints específicos

### Problemas de performance

- Desative `LOG_REQUEST_BODY` e `LOG_RESPONSE_BODY` em produção
- Use `excludePaths` para endpoints de alta frequência