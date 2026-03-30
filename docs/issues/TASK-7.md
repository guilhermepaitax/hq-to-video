# TASK-7: Endpoints Listar e Buscar Projetos

| Campo        | Valor                  |
| ------------ | ---------------------- |
| **Prioridade** | 7 (Alta)             |
| **Tipo**       | Backend / API        |
| **Estimativa** | 4h                   |
| **Depende de** | TASK-2, TASK-4       |

---

## Descrição

Implementar os endpoints `GET /api/projects` e `GET /api/projects/:id` seguindo a Clean Architecture da skill `api-architecture`. As rotas já estão registradas com schemas na TASK-2 — esta task entrega as implementações reais de use cases e controllers.

## Critérios de Aceite

### GET /api/projects — ListProjects

- [ ] `ListProjectsUsecase` em `application/usecases/projects/list-projects-usecase.ts`:
  - Decorado com `@Injectable()`
  - Recebe `ProjectRepository` via constructor injection
  - Retorna projetos ordenados por `createdAt` decrescente (mais recente primeiro)
  - Cada projeto inclui `ProcessingJob` associado (com `currentStep`, `progress`, `stepLabel`)
- [ ] `ListProjectsController` em `application/controllers/projects/list-projects-controller.ts`:
  - Estende `Controller<'public', ListProjectsController.Response>`
  - Retorna `{ statusCode: 200, body: projects }`
- [ ] Entry point `main/functions/projects/list-projects.ts` atualizado com controller real
- [ ] Retorna `200 OK` com array (vazio se não houver projetos)

### GET /api/projects/:id — GetProjectById

- [ ] `GetProjectByIdUsecase` em `application/usecases/projects/get-project-by-id-usecase.ts`:
  - Decorado com `@Injectable()`
  - Lança `NotFoundError` se o projeto não existir
  - Retorna projeto completo incluindo `ProcessingJob`
- [ ] `GetProjectByIdController` em `application/controllers/projects/get-project-by-id-controller.ts`:
  - Estende `Controller<'public', GetProjectByIdController.Response>`
  - Extrai `id` de `request.params`
  - Retorna `{ statusCode: 200, body: project }`
  - `NotFoundError` do use case é traduzido para `404` pelo fastify adapter
- [ ] Entry point `main/functions/projects/get-project-by-id.ts` atualizado com controller real
- [ ] Retorna `200 OK` com o projeto ou `404 Not Found`

### Registro no DI

- [ ] Todos os use cases e controllers registrados no `kernel/di/registry.ts`

## Detalhes Técnicos

### Estrutura de Arquivos

```
apps/backend/src/
├── application/
│   ├── usecases/projects/
│   │   ├── list-projects-usecase.ts
│   │   └── get-project-by-id-usecase.ts
│   └── controllers/projects/
│       ├── list-projects-controller.ts
│       └── get-project-by-id-controller.ts
└── main/functions/projects/
    ├── list-projects.ts
    └── get-project-by-id.ts
```

### Response GET /api/projects

```json
[
  {
    "id": "uuid",
    "title": "Batman #1 Recap",
    "status": "COMPLETED",
    "videoStyle": "9:16 Cinematic HDR",
    "narrationStyle": "Classic Noir Monologue",
    "duration": 24,
    "format": "9:16 / 4K",
    "createdAt": "2026-03-29T00:00:00Z",
    "processingJob": {
      "currentStep": "render",
      "progress": 100,
      "stepLabel": "Completed"
    }
  }
]
```

### Response GET /api/projects/:id

Mesmo schema acima, com campos adicionais: `pdfUrl`, `creativeBrief`, `atmosphere`, `metadata` (scenes breakdown), `errorMessage`.

### Tratamento de Erros

O `fastify-http-adapter` mapeia erros de domínio para HTTP:

| Erro de domínio   | HTTP Status |
| ----------------- | ----------- |
| `NotFoundError`   | `404`       |
| `BadRequestError` | `400`       |
| Outros            | `500`       |

## Entregável

Dois endpoints funcionais que retornam projetos do banco de dados em conformidade com os schemas definidos na TASK-2, prontos para serem consumidos pelos hooks gerados pelo Kubb.
