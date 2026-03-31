# TASK-6: Endpoint Criar Projeto (POST /api/projects)

| Campo        | Valor                  |
| ------------ | ---------------------- |
| **Prioridade** | 6 (Alta)             |
| **Tipo**       | Backend / API        |
| **Estimativa** | 5h                   |
| **Depende de** | TASK-2, TASK-4, TASK-5 |

---

## Descrição

Implementar o endpoint `POST /api/projects` que permite o upload de um PDF e a criação de um novo projeto de vídeo. Segue a Clean Architecture da skill `api-architecture`: use case em `application/usecases/`, controller em `application/controllers/`, e entry point em `main/functions/`. O schema Zod da rota foi definido na TASK-2 e a rota já está registrada (com `501`) — esta task substitui o handler pelo controller real.

## Critérios de Aceite

### Use Case (application layer)

- [ ] `CreateProjectUsecase` em `application/usecases/projects/create-project-usecase.ts`:
  - Decorado com `@Injectable()`
  - Recebe `ProjectRepository` e `StorageGateway` via constructor injection
  - Método `execute(input: CreateProjectUsecase.Input): Promise<CreateProjectUsecase.Output>`
  - Input/Output tipados em namespace na mesma classe
- [ ] Lógica do use case:
  1. Salva PDF via `StorageGateway.savePdf()`
  2. Cria registro do projeto via `ProjectRepository.create()` com status `PROCESSING`
  3. Retorna o projeto criado
- [ ] Erro `BadRequestError` para inputs inválidos

### Controller (application layer)

- [ ] `CreateProjectController` em `application/controllers/projects/create-project-controller.ts`:
  - Estende `Controller<'public', CreateProjectController.Response>`
  - Decorado com `@Injectable()` e `@Schema(createProjectSchema)`
  - Extrai arquivo PDF e campos do body (multipart)
  - Delega ao `CreateProjectUsecase`
  - Retorna `{ statusCode: 201, body: projectData }`

### Entry Point (main layer)

- [ ] `main/functions/projects/create-project.ts` atualizado para usar o `CreateProjectController` real (substituindo o `501` placeholder da TASK-2):
  ```ts
  app.post('/projects', {
    schema: { /* definido na TASK-2 */ },
    handler: fastifyHttpAdapter(CreateProjectController),
  })
  ```

### Validações

- [ ] Arquivo é um PDF válido (via magic bytes — delegado ao `StorageGateway`)
- [ ] Tamanho <= 150MB (delegado ao `StorageGateway`)
- [ ] `startPage` >= 1 e `startPage` < `endPage` (validado no schema Zod / use case)
- [ ] Erros retornam formato padronizado:
  ```json
  { "error": "BadRequest", "message": "startPage must be less than endPage" }
  ```
- [ ] `201 Created` com o objeto `Project` completo em caso de sucesso

### Registro no DI

- [ ] `CreateProjectUsecase` e `CreateProjectController` registrados no `kernel/di/registry.ts`

## Detalhes Técnicos

### Estrutura de Arquivos

```
apps/backend/src/
├── application/
│   ├── usecases/
│   │   └── projects/
│   │       └── create-project-usecase.ts
│   └── controllers/
│       └── projects/
│           └── create-project-controller.ts
└── main/
    └── functions/
        └── projects/
            └── create-project.ts  # substitui o placeholder da TASK-2
```

### Use Case

```ts
@Injectable()
export class CreateProjectUsecase {
  constructor(
    private readonly projectRepository: ProjectRepository,
    private readonly storageGateway: StorageGateway,
  ) {}

  async execute(input: CreateProjectUsecase.Input): Promise<CreateProjectUsecase.Output> {
    const pdfUrl = await this.storageGateway.savePdf(input.projectId, input.file)
    const project = new Project({
      id: input.projectId,
      title: input.title,
      pdfUrl,
      startPage: input.startPage,
      endPage: input.endPage,
      creativeBrief: input.creativeBrief,
      status: Project.Status.PROCESSING,
    })
    await this.projectRepository.create(project)
    return { project }
  }
}

export namespace CreateProjectUsecase {
  export type Input = {
    projectId: string
    file: Buffer
    title: string
    startPage: number
    endPage: number
    creativeBrief?: string
  }
  export type Output = { project: Project }
}
```

### Response

```json
{
  "id": "uuid",
  "title": "Batman #1 Recap",
  "status": "PROCESSING",
  "pdfUrl": "storage/uuid/pdfs/original.pdf",
  "createdAt": "2026-03-29T00:00:00Z"
}
```

## Entregável

Endpoint funcional `POST /api/projects` que aceita upload de PDF via multipart, cria o projeto no banco com status PROCESSING, e retorna `201` com os dados do projeto criado.
