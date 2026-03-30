# TASK-26: Retry de Job Falhado (API + Frontend)

| Campo        | Valor                  |
| ------------ | ---------------------- |
| **Prioridade** | 26 (Média)           |
| **Tipo**       | Full-stack           |
| **Estimativa** | 4h                   |
| **Depende de** | TASK-6, TASK-8, TASK-22 |

---

## Descrição

Implementar a funcionalidade de **retry** para jobs que falharam durante o processamento, conforme endpoint `POST /api/projects/:id/retry` (seção 4.8) e User Story US-03 do PRD.

## Critérios de Aceite

### Backend

- [ ] `RetryProjectUsecase` em `application/usecases/projects/retry-project-usecase.ts`:
  - Decorado com `@Injectable()`
  - Recebe `ProjectRepository`, `ProcessingJobRepository` e `QueueGateway` via constructor injection
  - Lança `NotFoundError` se o projeto não existir
  - Lança `BadRequestError` se status não for CANCELLED
- [ ] `RetryProjectController` em `application/controllers/projects/retry-project-controller.ts`:
  - Estende `Controller<'public', RetryProjectController.Response>`
  - Entry point `main/functions/projects/retry-project.ts` atualizado com controller real
- [ ] Ao executar retry:
  - `ProjectRepository.updateStatus()` → PROCESSING, errorMessage null
  - `ProcessingJobRepository` com `attempts` incrementado
  - `QueueGateway.enqueue()` com o job reconstituído
- [ ] Retorna `200 OK` com o projeto atualizado
- [ ] Use case e controller registrados no `kernel/di/registry.ts`

### Frontend

- [ ] Botão "Retry" visível em items com status CANCELLED na Queue screen
- [ ] Botão "Retry" visível em project cards com status CANCELLED no Dashboard
- [ ] Ao clicar, chama `useRetryProjectMutation`
- [ ] Loading state no botão durante a chamada
- [ ] Após sucesso, item atualiza para status PROCESSING (via invalidação do cache React Query)
- [ ] Mensagem de erro visível caso retry falhe
- [ ] Motivo da falha original exibido junto ao botão retry

## Detalhes Técnicos

### Use Case

```typescript
@Injectable()
export class RetryProjectUsecase {
  constructor(
    private readonly projectRepository: ProjectRepository,
    private readonly processingJobRepository: ProcessingJobRepository,
    private readonly queueGateway: QueueGateway,
  ) {}

  async execute(input: RetryProjectUsecase.Input): Promise<RetryProjectUsecase.Output> {
    const project = await this.projectRepository.findById(input.projectId)
    if (!project) throw new NotFoundError('Project not found')
    if (project.status !== 'CANCELLED') throw new BadRequestError('Only failed projects can be retried')

    await this.projectRepository.updateStatus(input.projectId, 'PROCESSING', null)
    await this.processingJobRepository.incrementAttempts(input.projectId)
    await this.queueGateway.enqueue({ projectId: input.projectId, type: 'video-generation', data: { ... } })

    return { project: await this.projectRepository.findById(input.projectId) }
  }
}
```

### Frontend Hook

```typescript
const retryProject = useRetryProjectMutation()

const handleRetry = (projectId: string) => {
  retryProject.mutate({ id: projectId }, {
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['projects'] })
  })
}
```

## Entregável

Funcionalidade completa de retry: endpoint backend que re-enfileira o job + botões no frontend que acionam o retry e atualizam a UI.
