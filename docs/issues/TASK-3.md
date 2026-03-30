# TASK-3: Setup do Backend com Fastify + Clean Architecture

| Campo          | Valor                    |
| -------------- | ------------------------ |
| **Prioridade** | 3 (Crítica)              |
| **Tipo**       | Backend / Infraestrutura |
| **Estimativa** | 8h                       |
| **Depende de** | TASK-1                   |

---

## Descrição

Configurar o projeto `apps/backend` seguindo a **Clean Architecture** definida na skill `api-architecture`, com Fastify como framework HTTP. A arquitetura separa estritamente business logic (framework-agnostic) de infraestrutura e framework, garantindo que trocar de framework exija mudanças apenas na camada `main/`.

Esta task também configura o `@fastify/swagger` para **geração automática do OpenAPI 3.1** a partir dos schemas Zod registrados nas rotas — eliminando a necessidade de escrever o spec manualmente.

Faça todas as instalações de setup usando o pnpm, via comandos.

## Critérios de Aceite

### Estrutura de Diretórios

- [ ] Estrutura de diretórios criada conforme a skill `api-architecture`:

```
apps/backend/
├── src/
│   ├── application/
│   │   ├── contracts/           # Interfaces (repositories, gateways)
│   │   ├── controllers/         # Controllers framework-agnostic
│   │   │   └── health/
│   │   │       └── get-health-controller.ts
│   │   ├── entities/            # Entidades de domínio
│   │   ├── errors/
│   │   │   ├── application/     # Erros de domínio
│   │   │   └── http/            # Erros HTTP (BadRequest, NotFound, etc.)
│   │   ├── events/              # Event handlers
│   │   ├── query/               # Read-only queries
│   │   ├── queues/              # Queue message consumers
│   │   ├── services/            # Serviços de domínio stateless
│   │   └── usecases/            # Use cases por domínio
│   │
│   ├── infra/
│   │   ├── ai/
│   │   │   ├── gateways/        # Integrações com providers de AI
│   │   │   └── prompts/         # Templates de prompt
│   │   ├── clients/             # Clientes HTTP/SDK raw
│   │   ├── database/
│   │   │   └── drizzle/
│   │   │       ├── schema.ts    # Definições das tabelas Drizzle
│   │   │       ├── migrations/  # Migrations SQL
│   │   │       ├── items/       # Mappers entity ↔ drizzle record
│   │   │       └── repositories/ # Implementações concretas dos repositories
│   │   └── gateways/            # Gateways externos (storage, queue, etc.)
│   │
│   ├── kernel/
│   │   ├── di/
│   │   │   └── registry.ts      # IoC container singleton
│   │   └── decorators/
│   │       ├── injectable.ts    # @Injectable() decorator
│   │       └── schema.ts        # @Schema(zod) decorator
│   │
│   ├── main/
│   │   ├── adapters/
│   │   │   └── fastify-http-adapter.ts  # Traduz Fastify ↔ Controller.Request
│   │   ├── functions/           # Entry points por rota
│   │   │   └── health/
│   │   │       └── get-health.ts
│   │   ├── server.ts            # Bootstrap do Fastify + plugins + registro de rotas
│   │   └── utils/               # Helpers do adapter (error formatting, etc.)
│   │
│   ├── shared/
│   │   ├── config/              # Leitura de variáveis de ambiente
│   │   ├── types/               # Utility types TypeScript
│   │   └── utils/               # Funções utilitárias puras
│   │
│   └── index.ts                 # Composition root: resolve DI e inicia o servidor
│
├── scripts/
│   └── export-openapi.ts        # Script para exportar o spec gerado pelo Fastify
├── package.json
└── tsconfig.json
```

### Kernel DI

- [ ] `@Injectable()` decorator implementado em `kernel/decorators/injectable.ts`
- [ ] `@Schema(zodSchema)` decorator implementado em `kernel/decorators/schema.ts`
- [ ] `Registry` (IoC container singleton) implementado em `kernel/di/registry.ts` com métodos `register()` e `resolve()`

### Application Layer Base

- [ ] Classe abstrata `Controller<TType, TResponse>` implementada em `application/contracts/Controller.ts`:
  - `TType`: `'public'` | `'private'`
  - Método `execute(req: Controller.Request): Promise<Controller.Response>`
  - Método abstrato protegido `handle(req: Controller.Request): Promise<Controller.Response>`
- [ ] `ApplicationError` base class em `application/errors/application/`
- [ ] Erros HTTP em `application/errors/http/`: `BadRequestError`, `NotFoundError`, `UnprocessableEntityError`

### Fastify + Plugins

- [ ] `main/server.ts` criado com bootstrap do Fastify e registro dos plugins:
  - `@fastify/cors` — CORS para comunicação com frontend
  - `@fastify/multipart` — upload de arquivos
  - `@fastify/swagger` — geração automática de OpenAPI 3.1
  - `@fastify/swagger-ui` — UI interativo em `/docs`
- [ ] `@fastify/swagger` configurado conforme a skill `api-architecture`:
  ```ts
  await app.register(fastifySwagger, {
    openapi: {
      openapi: '3.1.0',
      info: { title: 'Heroic Vision API', version: '1.0.0' },
      tags: [{ name: 'Projects' }, { name: 'Queue' }, { name: 'Dashboard' }],
    },
  });
  ```

### Fastify HTTP Adapter

- [ ] `main/adapters/fastify-http-adapter.ts` implementado:
  - Aceita `Constructor<Controller>` e retorna um Fastify handler
  - Traduz `FastifyRequest` → `Controller.Request`
  - Traduz `Controller.Response` → `reply.status().send()`
  - Formata erros de domínio (`ApplicationError`) em respostas HTTP padronizadas
- [ ] Formato de erro padrão para `4xx/5xx`:
  ```json
  { "error": "BadRequest", "message": "startPage must be less than endPage" }
  ```

### Exportação do Spec OpenAPI

- [ ] `scripts/export-openapi.ts` implementado:
  - Inicia o servidor, aguarda `app.ready()`
  - Chama `app.swagger()` para obter o spec gerado
  - Escreve em `docs/openapi.json`
  - Fecha o servidor
- [ ] Script adicionado ao `package.json`:
  ```json
  { "scripts": { "openapi:export": "tsx scripts/export-openapi.ts" } }
  ```

### Validação

- [ ] `GetHealthController` implementado em `application/controllers/health/` usando `Controller<'public'>`
- [ ] Rota `GET /health` registrada em `main/functions/health/get-health.ts` com schema Zod + tag `Health`
- [ ] Servidor inicia com `pnpm --filter backend dev` e responde em `http://localhost:3001/health`
- [ ] Swagger UI disponível em `http://localhost:3001/docs`
- [ ] `pnpm --filter backend openapi:export` escreve `docs/openapi.json` com a rota `/health` documentada

## Detalhes Técnicos

### Regra de Dependência

```
main → application ← infra
         ↑
       kernel (DI)
         ↑
       shared
```

### Dependências

- `fastify`
- `@fastify/cors`
- `@fastify/multipart`
- `@fastify/swagger`
- `@fastify/swagger-ui`
- `zod`
- `zod-to-json-schema`
- `zod-to-json-schema`
- `reflect-metadata` (para usar decorators no typescript/ lembre de adicionar a importação no entry point da aplicação)
- `tsx` (para dev com hot-reload e execução de scripts)

## Entregável

Backend funcional com Fastify respondendo em `/health`, Swagger UI em `/docs`, estrutura Clean Architecture completa, e script de exportação do OpenAPI funcionando — pronto para receber as tasks de domínio (TASK-4 em diante).
