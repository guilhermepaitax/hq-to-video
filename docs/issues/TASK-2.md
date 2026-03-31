# TASK-2: Geração Automática do OpenAPI com @fastify/swagger

| Campo        | Valor                  |
| ------------ | ---------------------- |
| **Prioridade** | 2 (Crítica)          |
| **Tipo**       | Backend / API        |
| **Estimativa** | 5h                   |
| **Depende de** | TASK-3               |

---

## Descrição

Definir os **schemas Zod** de request/response para todos os endpoints da aplicação e registrar as rotas no Fastify, fazendo com que o `@fastify/swagger` (já configurado na TASK-3) gere o **OpenAPI 3.1 automaticamente**. O spec resultante é exportado para `docs/openapi.json` via script e commitado no repositório — servindo como fonte de verdade para o Kubb na TASK-9.

> **Nota de ordem**: TASK-3 deve ser concluída antes desta task, pois o Fastify server e o plugin `@fastify/swagger` precisam estar configurados para que os schemas registrados nas rotas possam gerar o spec.

## Critérios de Aceite

### Schemas Zod (application layer)

- [ ] Schemas Zod criados em `application/controllers/<domain>/schemas/` para todos os 8 endpoints:
  - `POST /api/projects` — request multipart + response `Project`
  - `GET /api/projects` — response `Project[]` com `ProcessingJob` embutido
  - `GET /api/projects/:id` — params `{ id }` + response `Project` detalhado
  - `GET /api/projects/:id/video` — params `{ id }` (response é stream binário)
  - `POST /api/projects/:id/retry` — params `{ id }` + response `Project`
  - `GET /api/queue` — response `QueueStatus`
  - `GET /api/dashboard/metrics` — response `DashboardMetrics`
  - `POST /api/projects/:id/publish` — params `{ id }` + response `{ tikTokUrl }`
- [ ] Todos os schemas convertidos para JSON Schema via `zod-to-json-schema`
- [ ] Schemas de erro padronizados definidos e reutilizados nas respostas `4xx`/`5xx`:
  ```ts
  export const errorResponseSchema = z.object({
    error: z.string(),
    message: z.string(),
  })
  ```

### Enums e Modelos Compartilhados

- [ ] Enum de status do projeto: `PROCESSING | COMPLETED | CANCELLED`
- [ ] Enum de step do pipeline: `pdf_extraction | vision_analysis | script_gen | tts | render`
- [ ] Schema `Project` completo (todos os campos da seção 4.9 do PRD: `id`, `title`, `pdfUrl`, `startPage`, `endPage`, `creativeBrief`, `status`, `errorMessage`, `videoUrl`, `duration`, `formatSize`, `createdAt`, `updatedAt`)
- [ ] Schema `ProcessingJob` completo
- [ ] Schema `QueueStatus` com `activeTasks`, `completedToday`, `items[]`
- [ ] Schema `DashboardMetrics` com `totalVideosGenerated`, `activeJobs`, `conversionRate`, `completedToday`

### Registro das Rotas no Fastify (main layer)

- [ ] Cada endpoint registrado em `main/functions/<domain>/` com o schema Fastify completo:
  ```ts
  app.post('/projects', {
    schema: {
      tags: ['Projects'],
      summary: 'Create project with PDF upload',
      body: createProjectJsonSchema,
      response: {
        201: projectResponseSchema,
        400: errorResponseJsonSchema,
        500: errorResponseJsonSchema,
      },
    },
    handler: fastifyHttpAdapter(CreateProjectController),
  })
  ```
- [ ] Tags corretas em cada rota: `Projects`, `Queue`, `Dashboard`
- [ ] Descrições (`summary`) claras e objetivas em inglês
- [ ] Parâmetros de path (`:id`) documentados como `params` no schema

### Exportação e Validação do Spec

- [ ] `pnpm --filter backend openapi:export` executa com sucesso e gera `docs/openapi.json`
- [ ] `docs/openapi.json` contém todos os 8 endpoints corretamente documentados
- [ ] Spec validado com `@redocly/cli` (`redocly lint docs/openapi.json`) sem erros
- [ ] Swagger UI (`http://localhost:3001/docs`) exibe todos os endpoints com schemas corretos
- [ ] `docs/openapi.json` commitado no repositório (não no `.gitignore`)

## Detalhes Técnicos

### Workflow de Geração

```
1. Schemas Zod definidos em application/controllers/<domain>/schemas/
                    ↓
2. Convertidos para JSON Schema (zod-to-json-schema)
                    ↓
3. Registrados nas rotas Fastify em main/functions/<domain>/
                    ↓
4. @fastify/swagger lê os schemas registrados
                    ↓
5. pnpm openapi:export → app.swagger() → docs/openapi.json
                    ↓
6. Kubb lê docs/openapi.json → gera packages/api-client
```

### Estrutura dos Schemas

```
application/controllers/
├── projects/
│   └── schemas/
│       ├── create-project-schema.ts      # POST /projects
│       ├── list-projects-schema.ts       # GET /projects
│       ├── get-project-by-id-schema.ts   # GET /projects/:id
│       └── shared/
│           ├── project-schema.ts         # Schema Project reutilizável
│           └── processing-job-schema.ts  # Schema ProcessingJob reutilizável
├── queue/
│   └── schemas/
│       └── queue-status-schema.ts        # GET /queue
└── dashboard/
    └── schemas/
        └── dashboard-metrics-schema.ts   # GET /dashboard/metrics
```

### Rotas Registradas

```
main/functions/
├── projects/
│   ├── create-project.ts       # POST /api/projects
│   ├── list-projects.ts        # GET /api/projects
│   ├── get-project-by-id.ts    # GET /api/projects/:id
│   ├── get-project-video.ts    # GET /api/projects/:id/video
│   ├── retry-project.ts        # POST /api/projects/:id/retry
│   └── publish-project.ts      # POST /api/projects/:id/publish
├── queue/
│   └── get-queue.ts            # GET /api/queue
└── dashboard/
    └── get-metrics.ts          # GET /api/dashboard/metrics
```

> **Atenção**: Nesta task, as rotas são registradas com o schema completo, mas os **controllers ainda retornam `501 Not Implemented`** — as implementações reais são feitas nas tasks de domínio (TASK-6, TASK-7, etc.). O objetivo aqui é estabelecer o contrato da API e gerar o spec.

### Dependências

- `zod`
- `zod-to-json-schema`
- `@redocly/cli` (devDependency, para lint do spec)

## Entregável

Arquivo `docs/openapi.json` gerado automaticamente pelo Fastify a partir dos schemas Zod, contendo todos os 8 endpoints documentados, validado sem erros e commitado no repositório — pronto para ser consumido pelo Kubb na TASK-9.
