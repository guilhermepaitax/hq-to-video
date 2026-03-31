---
name: project-architecture
description: Guides the implementation of new features in the api project following its Clean Architecture pattern. Use when adding a new endpoint, use case, entity, repository, gateway, or any feature to this project. Covers folder structure, layering rules, dependency injection, framework-agnostic conventions, and OpenAPI generation with Fastify.
---

# API — Architecture Guide

This project follows **Clean Architecture** with a strict dependency rule: inner layers never depend on outer layers. The only framework-dependent code lives in `src/main`.

## Layer Overview

```
src/
├── application/   # Business logic (framework-agnostic)
├── infra/         # Infrastructure implementations
├── kernel/        # DI container and decorators
├── main/          # Entry points / composition root (framework-specific)
└── shared/        # Cross-cutting utilities and types
```

---

## `src/application/`

Pure business logic. No framework imports. No infrastructure imports.

| Folder                          | Purpose                                                                  |
| ------------------------------- | ------------------------------------------------------------------------ |
| `contracts/`                    | Abstract base classes and interfaces consumed across layers              |
| `controllers/`                  | HTTP controllers grouped by domain; each extends `Controller` base class |
| `controllers/<domain>/schemas/` | Zod schemas for request body validation                                  |
| `entities/`                     | Domain entities with business rules and value objects                    |
| `errors/application/`           | Domain errors extending `ApplicationError`                               |
| `errors/http/`                  | HTTP-level errors (e.g. `HttpError`, `BadRequest`)                       |
| `events/`                       | Event handlers for async integration events (e.g. file uploaded)         |
| `query/`                        | Read-only query objects for complex cross-entity reads                   |
| `queues/`                       | Queue message consumers                                                  |
| `services/`                     | Stateless domain services with logic that doesn't belong to an entity    |
| `usecases/`                     | Business use cases grouped by domain                                     |

### Controller

Controllers extend the abstract `Controller<TType, TResponse>` base class from `contracts/Controller.ts`. They are **framework-agnostic** — they receive a normalised `Controller.Request` and return a `Controller.Response` with `statusCode` and `body`.

```
application/controllers/<domain>/
├── create-<domain>-controller.ts
├── get-<domain>-by-id-controller.ts
└── schemas/
    └── create-<domain>-schema.ts
```

### Repository / Gateway Contract

Repository interfaces live in `application/contracts/`. Method-specific input types are declared in a **namespace** on the same file to keep parameter shapes co-located with the interface.

```ts
// application/contracts/project-repository.ts
export interface ProjectRepository {
  create(project: Project): Promise<Project>;

  findById(id: string): Promise<Project | null>;

  findAll(): Promise<Project[]>;

  updateStatus(input: ProjectRepository.UpdateStatusInput): Promise<void>;
}

export namespace ProjectRepository {
  export type UpdateStatusInput = {
    id: string;
    status: Project.Status;
    errorMessage?: string | null;
  };
}
```

### Use Case

Use cases are plain classes decorated with `@Injectable()`. They receive dependencies via constructor injection and expose an `execute(input): Promise<output>` method. Input/Output types are declared in a namespace on the same file.

```
application/usecases/<domain>/
└── create-<domain>-usecase.ts
```

### Entity

Entities are plain TypeScript classes. They hold identity, invariants, and enumerations. The constructor always receives an `Attributes` object. Enums and the `Attributes` type are declared inside a **namespace** on the same file.

```
application/entities/
└── <domain>.ts
```

**Pattern:**

```ts
export class Project {
  readonly id: string;
  readonly title: string;
  readonly status: Project.Status;
  readonly formatSize: Project.FormatSize;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;

  constructor(attributes: Project.Attributes) {
    this.id = attributes.id;
    this.title = attributes.title;
    this.status = attributes.status ?? Project.Status.PROCESSING;
    this.formatSize = attributes.formatSize ?? Project.FormatSize.VERTICAL;
    this.createdAt = attributes.createdAt ?? new Date();
    this.updatedAt = attributes.updatedAt;
  }
}

export namespace Project {
  export enum Status {
    PROCESSING = 'PROCESSING',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED',
  }

  export enum FormatSize {
    VERTICAL = 'VERTICAL',
    HORIZONTAL = 'HORIZONTAL',
  }

  export enum PipelineStep {
    PdfExtraction = 'PDF_EXTRACTION',
    VisionAnalysis = 'VISION_ANALYSIS',
    ScriptGen = 'SCRIPT_GEN',
    Tts = 'TTS',
    Render = 'RENDER',
  }

  export type Attributes = {
    id: string;
    title: string;
    status?: Status;
    formatSize?: FormatSize;
    createdAt?: Date;
    updatedAt?: Date;
  };
}
```

---

## `src/infra/`

Concrete implementations of contracts defined in `application/`. Can import infrastructure SDKs (AWS SDK, Drizzle, etc.).

| Folder                           | Purpose                                                                                                    |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `ai/gateways/`                   | AI provider integrations                                                                                   |
| `ai/prompts/`                    | Prompt templates                                                                                           |
| `clients/`                       | Raw HTTP/SDK clients                                                                                       |
| `database/drizzle/repositories/` | Drizzle repository implementations (implement contracts, decorated with `@Injectable()`)                   |
| `database/drizzle/items/`        | Drizzle item mappers — pure functions `<domain>FromDrizzle(row)` converting a DB record to a domain entity |
| `database/drizzle/schema.ts`     | Drizzle table definitions (`pgTable`, `pgEnum`, etc.)                                                      |
| `database/drizzle/migrations/`   | SQL migrations                                                                                             |
| `database/drizzle/uow/`          | Unit of Work for drizzle transactions                                                                      |
| `gateways/`                      | External service gateways (storage, queues, auth, etc.)                                                    |

---

## `src/kernel/`

Internal DI framework. **Do not add business logic here.**

| Folder           | Purpose                                                                                    |
| ---------------- | ------------------------------------------------------------------------------------------ |
| `di/registry.ts` | Singleton IoC container — registers and resolves dependencies                              |
| `decorators/`    | `@Injectable()` marks a class for DI; `@Schema(zod)` attaches a Zod schema to a controller |

Every class that participates in DI **must** be decorated with `@Injectable()`.

---

## `src/main/`

The only framework-dependent layer. Swap this layer to migrate frameworks.

| Folder       | Purpose                                                                                                      |
| ------------ | ------------------------------------------------------------------------------------------------------------ |
| `adapters/`  | Framework adapters that translate HTTP/event input into `Controller.Request` and call `controller.execute()` |
| `functions/` | Entry point files per route/event — each file imports an adapter and a controller                            |
| `server.ts`  | Fastify server bootstrap, plugin registration, and OpenAPI generation                                        |
| `utils/`     | Helpers for the current adapter (body parsing, error response formatting, etc.)                              |

**When migrating frameworks**, only `adapters/` and `functions/` change. Controllers, use cases, entities, and infra remain untouched.

---

## `src/shared/`

No business logic. No framework imports.

| Folder    | Purpose                                                   |
| --------- | --------------------------------------------------------- |
| `config/` | App-wide environment config (read from `process.env`)     |
| `saga/`   | Saga orchestration utilities for complex multi-step flows |
| `types/`  | Shared TypeScript utility types (e.g. `Constructor<T>`)   |
| `utils/`  | Pure utility functions reused across layers               |

---

## Dependency Rule

```
main → application ← infra
         ↑
       kernel (DI)
         ↑
       shared
```

- `application` imports from `shared` and `kernel` only
- `infra` imports from `application` (contracts/entities) and `shared`
- `main` imports from `application`, `kernel`, and `infra`
- `shared` imports nothing from the project

---

## OpenAPI Generation with `@fastify/swagger`

This project generates the OpenAPI 3.1 specification **automatically** from the Fastify route schemas registered at runtime, using `@fastify/swagger`. The spec is **not authored manually** — it is derived from the Zod schemas attached to each controller.

### How It Works

1. Each controller defines a **Zod schema** for its request body, params, query, and response.
2. The schema is attached to the controller via `@Schema(zodSchema)` and converted to JSON Schema using `zod-to-json-schema`.
3. When a route is registered in `main/functions/<domain>/`, the JSON Schema is passed as the Fastify route `schema` option.
4. `@fastify/swagger` reads all registered route schemas and assembles the OpenAPI spec automatically.
5. A dedicated script (`pnpm openapi:export`) starts the server and dumps the generated spec to `docs/openapi.json`.
6. `docs/openapi.json` is committed to the repo and serves as the **source of truth** for Kubb code generation.

### Plugin Setup (`main/server.ts`)

```ts
import Fastify from 'fastify';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';

export async function buildServer() {
  const app = Fastify({ logger: true });

  await app.register(fastifySwagger, {
    openapi: {
      openapi: '3.1.0',
      info: { title: 'Heroic Vision API', version: '1.0.0' },
      tags: [
        { name: 'Projects', description: 'Project management' },
        { name: 'Queue', description: 'Processing queue' },
        { name: 'Dashboard', description: 'Dashboard metrics' },
      ],
    },
  });

  await app.register(fastifySwaggerUi, {
    routePrefix: '/docs',
  });

  // Register all routes
  await app.register(projectsRoutes, { prefix: '/api' });
  await app.register(queueRoutes, { prefix: '/api' });
  await app.register(dashboardRoutes, { prefix: '/api' });

  return app;
}
```

### Exporting the Spec (`scripts/export-openapi.ts`)

```ts
import { buildServer } from '../src/main/server';
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

async function main() {
  const app = await buildServer();
  await app.ready();

  const spec = app.swagger();
  const outPath = resolve(__dirname, '../../docs/openapi.json');
  writeFileSync(outPath, JSON.stringify(spec, null, 2));
  console.log(`OpenAPI spec exported to ${outPath}`);
  await app.close();
}

main();
```

Add to `package.json` in `apps/backend`:

```json
{
  "scripts": {
    "openapi:export": "tsx scripts/export-openapi.ts"
  }
}
```

### Route Registration with Fastify Adapter

Each route in `main/functions/<domain>/` registers the controller with its JSON Schema:

```ts
// main/functions/projects/create-project.ts
import { CreateProjectController } from '@application/controllers/projects/create-project-controller';
import { fastifyHttpAdapter } from '@main/adapters/fastify-http-adapter';

export async function createProjectRoute(app: FastifyInstance) {
  app.post('/projects', {
    schema: {
      tags: ['Projects'],
      summary: 'Create project with PDF upload',
      consumes: ['multipart/form-data'],
      body: createProjectJsonSchema, // from Zod schema via zod-to-json-schema
      response: { 201: projectResponseSchema },
    },
    handler: fastifyHttpAdapter(CreateProjectController),
  });
}
```

### Zod Schema to JSON Schema (`application/controllers/projects/schemas/`)

```ts
// application/controllers/projects/schemas/create-project-schema.ts
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

export const createProjectFormFieldsSchema = z.object({
  title: z.string().min(1),
  startPage: z.number().int().min(1),
  endPage: z.number().int().min(1),
  creativeBrief: z.string().optional(),
});

export const createProjectMultipartBodyJsonSchema = {
  type: 'object',
  required: ['file', 'title', 'startPage', 'endPage'],
  properties: {
    file: {
      type: 'string',
      contentEncoding: 'binary',
      description: 'Comic book PDF file',
    },
    // ...spread formFields properties
  },
} as const;
```

### Kubb Consumes the Exported Spec

After `pnpm openapi:export`, the `packages/api-client` Kubb config reads the committed `docs/openapi.json`:

```ts
// packages/api-client/kubb.config.ts
export default defineConfig({
  input: {
    path: '../../docs/openapi.json', // auto-generated, not hand-written
  },
  // ...
});
```

### Re-generation Workflow

```
1. Developer adds/modifies a Zod schema on a controller
2. Route is registered in main/functions/ with the updated schema
3. Run: pnpm --filter backend openapi:export
4. docs/openapi.json is updated
5. Run: pnpm --filter api-client generate
6. Typed hooks in packages/api-client are regenerated
7. Commit both docs/openapi.json and the generated api-client
```

---

## Adding a New Feature — Checklist

When adding a new domain or endpoint, follow this order:

1. **Entity** → `application/entities/<domain>.ts`
2. **Application errors** (if needed) → `application/errors/application/<error>.ts`
3. **Use case** → `application/usecases/<domain>/<action>-usecase.ts`
4. **Repository/Gateway interface** (if needed) → `application/contracts/<domain>-repository.ts`
5. **Controller schema** → `application/controllers/<domain>/schemas/<action>-schema.ts`
6. **Controller** → `application/controllers/<domain>/<action>-controller.ts`
7. **Infra implementations** → `infra/database/drizzle/repositories/`, `infra/gateways/`, `infra/ai/gateways/`, etc.
8. **Entry point** → `main/functions/<domain>/<action>.ts` (registers route + schema in Fastify)
9. **Export spec** → `pnpm --filter backend openapi:export`
10. **Regenerate client** → `pnpm --filter api-client generate`

---

## Examples

### Example 1 — New private endpoint: `POST /workouts`

**`application/entities/workout.ts`**

```ts
export class Workout {
  readonly id: string;
  readonly accountId: string;
  readonly name: string;
  readonly status: Workout.Status;
  readonly createdAt?: Date;

  constructor(attributes: Workout.Attributes) {
    this.id = attributes.id;
    this.accountId = attributes.accountId;
    this.name = attributes.name;
    this.status = attributes.status ?? Workout.Status.ACTIVE;
    this.createdAt = attributes.createdAt ?? new Date();
  }
}

export namespace Workout {
  export enum Status {
    ACTIVE = 'ACTIVE',
    COMPLETED = 'COMPLETED',
  }

  export type Attributes = {
    id: string;
    accountId: string;
    name: string;
    status?: Status;
    createdAt?: Date;
  };
}
```

**`application/usecases/workouts/create-workout-usecase.ts`**

```ts
@Injectable()
export class CreateWorkoutUsecase {
  constructor(private readonly workoutRepository: WorkoutRepository) {}

  async execute(
    input: CreateWorkoutUsecase.Input,
  ): Promise<CreateWorkoutUsecase.Output> {
    const workout = new Workout({ accountId: input.accountId });
    await this.workoutRepository.create(workout);
    return { workoutId: workout.id };
  }
}

export namespace CreateWorkoutUsecase {
  export type Input = { accountId: string };
  export type Output = { workoutId: string };
}
```

**`application/controllers/workouts/create-workout-controller.ts`**

```ts
@Injectable()
@Schema(createWorkoutSchema)
export class CreateWorkoutController extends Controller<
  'private',
  CreateWorkoutController.Response
> {
  constructor(private readonly createWorkoutUsecase: CreateWorkoutUsecase) {
    super();
  }

  protected override async handle({
    accountId,
    body,
  }: Controller.Request<'private', CreateWorkoutBody>) {
    const { workoutId } = await this.createWorkoutUsecase.execute({
      accountId,
    });
    return { statusCode: 201, body: { workoutId } };
  }
}
```

**`main/functions/workouts/create-workout.ts`**

```ts
import { CreateWorkoutController } from '@application/controllers/workouts/create-workout-controller';
import { fastifyHttpAdapter } from '@main/adapters/fastify-http-adapter';
import { createWorkoutJsonSchema } from '@application/controllers/workouts/schemas/create-workout-schema';

export async function createWorkoutRoute(app: FastifyInstance) {
  app.post('/workouts', {
    schema: {
      tags: ['Workouts'],
      summary: 'Create a new workout',
      body: createWorkoutJsonSchema,
      response: { 201: workoutResponseSchema },
    },
    handler: fastifyHttpAdapter(CreateWorkoutController),
  });
}
```

---

### Example 2 — Public endpoint (no auth)

Use `Controller<'public'>` — `accountId` will be typed as `null`.

```ts
@Injectable()
export class GetHealthController extends Controller<
  'public',
  { status: string }
> {
  protected override async handle(_request: Controller.Request<'public'>) {
    return { statusCode: 200, body: { status: 'ok' } };
  }
}
```

---

### Example 3 — Fastify HTTP Adapter (`main/adapters/fastify-http-adapter.ts`)

Translates Fastify's `Request`/`Reply` into `Controller.Request` and calls `controller.execute()`. No other layer changes when swapping frameworks.

```ts
export function fastifyHttpAdapter(
  controllerImpl: Constructor<Controller<any, unknown>>,
) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const controller = Registry.getInstance().resolve(controllerImpl);
    const response = await controller.execute({
      body: request.body,
      params: request.params as Record<string, string>,
      queryParams: request.query as Record<string, string>,
      accountId: request.user?.internalId ?? null,
    });
    reply.status(response.statusCode).send(response.body);
  };
}
```
