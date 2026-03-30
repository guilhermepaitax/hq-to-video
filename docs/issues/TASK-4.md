# TASK-4: Database Schema com Drizzle ORM + PostgreSQL

| Campo        | Valor                  |
| ------------ | ---------------------- |
| **Prioridade** | 4 (Crítica)          |
| **Tipo**       | Backend / Database   |
| **Estimativa** | 4h                   |
| **Depende de** | TASK-3               |

---

## Descrição

Implementar o **database adapter** com Drizzle ORM e PostgreSQL conforme seções 4.6 e 4.9 do PRD, seguindo a Clean Architecture definida na skill `api-architecture`. O schema das tabelas vive em `infra/database/drizzle/`, as interfaces de repositório vivem em `application/contracts/`, e as implementações concretas em `infra/database/drizzle/repositories/`.

## Critérios de Aceite

### Interfaces (application layer)

- [ ] Interface `ProjectRepository` definida em `application/contracts/project-repository.ts`:
  ```ts
  export interface ProjectRepository {
    create(data: CreateProjectInput): Promise<Project>
    findById(id: string): Promise<Project | null>
    findAll(): Promise<Project[]>
    updateStatus(id: string, status: ProjectStatus, errorMessage?: string): Promise<void>
    updateVideo(id: string, videoUrl: string, duration: number, format: string): Promise<void>
  }
  ```
- [ ] Interface `ProcessingJobRepository` definida em `application/contracts/processing-job-repository.ts`

### Entidade de Domínio (application layer)

- [ ] Entidade `Project` implementada em `application/entities/project.ts` com todos os campos da seção 4.9 do PRD:
  - `id`, `title`, `pdfUrl`, `startPage`, `endPage`, `videoStyle`, `narrationStyle`
  - `creativeBrief` (nullable), `atmosphere` (typed object), `status` (enum), `errorMessage` (nullable)
  - `videoUrl` (nullable), `duration` (nullable), `format` (nullable), `metadata` (nullable)
  - `createdAt`, `updatedAt`
- [ ] Entidade `ProcessingJob` implementada em `application/entities/processing-job.ts`
- [ ] Enums declarados nas entidades:
  - `ProjectStatus`: `PROCESSING | COMPLETED | CANCELLED`
  - `PipelineStep`: `pdf_extraction | vision_analysis | script_gen | tts | render`

### Schema Drizzle (infra layer)

- [ ] Estrutura de diretórios:
  - `infra/database/drizzle/schema.ts` — definições das tabelas
  - `infra/database/drizzle/migrations/` — migrations SQL geradas pelo drizzle-kit
  - `infra/database/drizzle/items/` — mappers entity ↔ drizzle record
  - `infra/database/drizzle/repositories/` — implementações concretas
  - `infra/database/drizzle/client.ts` — instância do cliente Drizzle
- [ ] Schema Drizzle para tabela `projects`:
  - `id` (UUID, PK), `title`, `pdf_url`, `start_page`, `end_page`, `video_style`, `narration_style`
  - `creative_brief` (nullable text), `atmosphere` (JSON), `status` (pgEnum), `error_message` (nullable text)
  - `video_url` (nullable), `duration` (nullable int), `format` (nullable), `metadata` (JSON nullable)
  - `created_at`, `updated_at`
- [ ] Schema Drizzle para tabela `processing_jobs`:
  - `id` (UUID, PK), `project_id` (FK → projects), `current_step`, `progress`, `step_label`
  - `started_at` (nullable), `completed_at` (nullable), `error_details` (nullable text), `attempts` (int, default 0)
- [ ] Mappers em `infra/database/drizzle/items/`:
  - `project-item.ts`: `fromDrizzle(record) → Project` e `toDrizzle(entity) → DrizzleRecord`
  - `processing-job-item.ts`: idem

### Implementações Concretas (infra layer)

- [ ] `DrizzleProjectRepository` em `infra/database/drizzle/repositories/project-repository.ts` implementando `ProjectRepository`
- [ ] `DrizzleProcessingJobRepository` em `infra/database/drizzle/repositories/processing-job-repository.ts` implementando `ProcessingJobRepository`
- [ ] Repositórios decorados com `@Injectable()`

### Infraestrutura

- [ ] `drizzle.config.ts` configurado na raiz do backend apontando para `infra/database/drizzle/schema.ts`
- [ ] Migration inicial gerada com `pnpm --filter backend db:generate` e executável com `pnpm --filter backend db:migrate`
- [ ] `docker-compose.yml` na raiz do monorepo com serviço PostgreSQL
- [ ] Conexão com PostgreSQL via variáveis de ambiente (`DATABASE_URL`)
- [ ] Scripts no `package.json`:
  - `db:generate` — `drizzle-kit generate`
  - `db:migrate` — `drizzle-kit migrate`
  - `db:studio` — `drizzle-kit studio`

### Registro no DI

- [ ] Repositórios registrados no `kernel/di/registry.ts` durante o bootstrap em `index.ts`

## Detalhes Técnicos

### Estrutura de Diretórios

```
apps/backend/src/
├── application/
│   ├── contracts/
│   │   ├── project-repository.ts
│   │   └── processing-job-repository.ts
│   └── entities/
│       ├── project.ts
│       └── processing-job.ts
└── infra/
    └── database/
        └── drizzle/
            ├── client.ts
            ├── schema.ts
            ├── migrations/
            ├── items/
            │   ├── project-item.ts
            │   └── processing-job-item.ts
            └── repositories/
                ├── project-repository.ts
                └── processing-job-repository.ts
```

### Dependências

- `drizzle-orm`
- `drizzle-kit`
- `postgres` (driver pg)
- `docker` + `docker-compose` (PostgreSQL local)

## Entregável

Schema do banco de dados criado em `infra/`, entidades e interfaces de repositório em `application/contracts/`, migrations executáveis, e PostgreSQL rodando via Docker com as tabelas `projects` e `processing_jobs` criadas.
