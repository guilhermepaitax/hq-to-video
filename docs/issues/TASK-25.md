# TASK-25: API Endpoint — Queue Status

| Campo        | Valor                  |
| ------------ | ---------------------- |
| **Prioridade** | 25 (Média)           |
| **Tipo**       | Backend / API        |
| **Estimativa** | 3h                   |
| **Depende de** | TASK-4, TASK-8       |

---

## Descrição

Implementar o endpoint `GET /api/queue` que retorna o status completo da fila de processamento, conforme seção 4.8 do PRD e User Story US-06.

## Critérios de Aceite

### Use Case (application layer)

- [ ] `GetQueueStatusUsecase` em `application/usecases/queue/get-queue-status-usecase.ts`:
  - Decorado com `@Injectable()`
  - Recebe `ProjectRepository` e `QueueGateway` via constructor injection

### Controller (application layer)

- [ ] `GetQueueController` em `application/controllers/queue/get-queue-controller.ts`:
  - Estende `Controller<'public', GetQueueController.Response>`
  - Entry point `main/functions/queue/get-queue.ts` atualizado com controller real

### Response inclui:
  - `activeTasks` — número de jobs ativos
  - `completedToday` — número de jobs completados hoje
  - `items[]` — lista de todos os jobs com detalhes:
    - `projectId`, `title`, `status`, `videoFormat`, `duration`
    - Para PROCESSING: `currentStep`, `progress`, `stepLabel`
    - Para COMPLETED: `videoUrl`, `completedAt`
    - Para CANCELLED: `errorMessage`
    - Para WAITING: `queuePosition`
- [ ] Items ordenados: PROCESSING primeiro, depois WAITING, depois COMPLETED, depois CANCELLED
- [ ] Métricas obtidas combinando `ProjectRepository` (projetos) e `QueueGateway.getQueueMetrics()`
- [ ] Retorna `200 OK`
- [ ] Use case e controller registrados no `kernel/di/registry.ts`

## Detalhes Técnicos

### Response Schema

```json
{
  "activeTasks": 2,
  "completedToday": 5,
  "items": [
    {
      "projectId": "uuid",
      "title": "Batman #1 Recap",
      "status": "PROCESSING",
      "videoFormat": "9:16 / 4K",
      "duration": null,
      "currentStep": "vision_analysis",
      "progress": 35,
      "stepLabel": "Analyzing Panels 3/5"
    },
    {
      "projectId": "uuid",
      "title": "Spider-Man #5",
      "status": "COMPLETED",
      "videoFormat": "9:16 / 4K",
      "duration": 24,
      "videoUrl": "storage/uuid/video/final.mp4",
      "completedAt": "2026-03-29T14:30:00Z"
    }
  ]
}
```

## Entregável

Endpoint funcional que retorna o estado completo da fila com todos os jobs e suas informações contextuais por status.
