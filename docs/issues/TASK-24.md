# TASK-24: API Endpoint — Dashboard Metrics

| Campo        | Valor                  |
| ------------ | ---------------------- |
| **Prioridade** | 24 (Média)           |
| **Tipo**       | Backend / API        |
| **Estimativa** | 3h                   |
| **Depende de** | TASK-4, TASK-8       |

---

## Descrição

Implementar o endpoint `GET /api/dashboard/metrics` que retorna as métricas agregadas do dashboard, conforme seção 4.8 do PRD e User Story US-04.

## Critérios de Aceite

### Use Case (application layer)

- [ ] `GetDashboardMetricsUsecase` em `application/usecases/dashboard/get-dashboard-metrics-usecase.ts`:
  - Decorado com `@Injectable()`
  - Recebe `ProjectRepository` e `QueueGateway` via constructor injection
  - Calcula métricas combinando queries ao repositório e métricas da fila

### Query (application layer)

- [ ] `DashboardMetricsQuery` em `application/query/dashboard-metrics-query.ts` (alternativa se preferir separar reads complexos):
  - Métodos: `countByStatus()`, `countCompletedToday()`, `countTotal()`

### Controller (application layer)

- [ ] `GetDashboardMetricsController` em `application/controllers/dashboard/get-dashboard-metrics-controller.ts`:
  - Estende `Controller<'public', GetDashboardMetricsController.Response>`
  - Decorado com `@Injectable()`
  - Retorna `{ statusCode: 200, body: metrics }`

### Entry Point (main layer)

- [ ] `main/functions/dashboard/get-metrics.ts` atualizado com o controller real (substituindo placeholder da TASK-2)

### Comportamento

- [ ] Métricas retornadas:
  - `totalVideosGenerated` — count de projetos COMPLETED
  - `activeJobs` — count de projetos PROCESSING
  - `conversionRate` — `(COMPLETED / total) * 100`
  - `completedToday` — COMPLETED com `completedAt >= start_of_day`
  - `totalProjects` — count total
- [ ] Retorna `200 OK`
- [ ] Response cacheável (cache de 30s via Fastify reply cache header)

### Registro no DI

- [ ] Use case e controller registrados no `kernel/di/registry.ts`

## Detalhes Técnicos

### Response Schema

```json
{
  "totalVideosGenerated": 42,
  "activeJobs": 3,
  "conversionRate": 94.2,
  "completedToday": 7,
  "totalProjects": 45
}
```

### Query Example (Drizzle)

```typescript
const totalCompleted = await db
  .select({ count: count() })
  .from(projects)
  .where(eq(projects.status, 'COMPLETED'))

const completedToday = await db
  .select({ count: count() })
  .from(projects)
  .where(
    and(
      eq(projects.status, 'COMPLETED'),
      gte(projects.completedAt, startOfDay)
    )
  )
```

## Entregável

Endpoint funcional que retorna métricas agregadas do dashboard, pronto para ser consumido pelo hook `useGetDashboardMetrics` no frontend.
