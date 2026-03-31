# TASK-8: Queue Gateway com BullMQ + Redis

| Campo        | Valor                        |
| ------------ | ---------------------------- |
| **Prioridade** | 8 (Alta)                   |
| **Tipo**       | Backend / Infraestrutura   |
| **Estimativa** | 5h                         |
| **Depende de** | TASK-3                     |

---

## Descrição

Implementar o **queue gateway** com BullMQ e Redis, seguindo a Clean Architecture da skill `api-architecture`. A interface (contract) vive em `application/contracts/`, e a implementação concreta em `infra/gateways/queue/`. Os consumers de queue ficam em `application/queues/`. Conforme seções 4.7 e 4.11 do PRD.

## Critérios de Aceite

### Interface (application layer)

- [ ] Interface `QueueGateway` definida em `application/contracts/queue-gateway.ts`:
  ```ts
  export interface QueueGateway {
    enqueue(job: JobPayload): Promise<string>
    getJobStatus(jobId: string): Promise<JobStatus>
    retry(jobId: string): Promise<void>
    getQueueMetrics(): Promise<QueueMetrics>
  }
  ```
- [ ] Tipos `JobPayload`, `JobStatus`, `QueueMetrics` definidos no mesmo arquivo ou em `shared/types/queue.ts`

### Implementação Concreta (infra layer)

- [ ] `BullMQQueueGateway` em `infra/gateways/queue/bullmq-queue-gateway.ts`:
  - Implementa `QueueGateway`
  - Decorado com `@Injectable()`
  - Cria um `Queue` BullMQ para o nome `video-generation`
  - Implementa `enqueue()`, `getJobStatus()`, `retry()`, `getQueueMetrics()`
  - Conexão Redis configurável via variáveis de ambiente (`REDIS_HOST`, `REDIS_PORT`)
- [ ] `BullMQWorker` em `infra/gateways/queue/bullmq-worker.ts`:
  - Cria um `Worker` BullMQ que consome jobs da fila `video-generation`
  - Expõe método `onProcess(handler)` para registrar o handler de processamento
  - Iniciado no bootstrap da aplicação

### Consumer (application layer)

- [ ] `VideoGenerationQueueConsumer` em `application/queues/video-generation-queue-consumer.ts`:
  - Decorado com `@Injectable()`
  - Método `handle(job: JobPayload): Promise<void>` — será implementado na TASK-16 (Worker Pipeline)
  - Por enquanto loga o job e lança `NotImplementedError`
  - É este consumer que o `BullMQWorker` chama via `onProcess()`

### Infraestrutura

- [ ] Redis adicionado ao `docker-compose.yml` (serviço `redis`, porta 6379)
- [ ] Configuração de conexão Redis via `shared/config/` (lê `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD`)
- [ ] Gateway selecionável via `QUEUE_PROVIDER` env var no composition root (`index.ts`)

### Registro no DI

- [ ] `BullMQQueueGateway` registrado no `kernel/di/registry.ts`
- [ ] `VideoGenerationQueueConsumer` registrado no `kernel/di/registry.ts`
- [ ] Worker iniciado no `index.ts` após o servidor estar pronto

## Detalhes Técnicos

### Estrutura de Arquivos

```
apps/backend/src/
├── application/
│   ├── contracts/
│   │   └── queue-gateway.ts
│   └── queues/
│       └── video-generation-queue-consumer.ts
└── infra/
    └── gateways/
        └── queue/
            ├── bullmq-queue-gateway.ts
            └── bullmq-worker.ts
```

### JobPayload (Seção 4.7 do PRD)

```ts
export interface JobPayload {
  id: string
  projectId: string
  type: 'video-generation'
  data: {
    pdfUrl: string
    startPage: number
    endPage: number
    creativeBrief?: string
  }
}
```

### QueueMetrics

```ts
export interface QueueMetrics {
  activeJobs: number
  waitingJobs: number
  completedToday: number
  failedToday: number
}
```

### Dependências

- `bullmq`
- `ioredis`
- Redis (via docker-compose)

## Entregável

Queue gateway funcional com BullMQ onde jobs podem ser enfileirados, consultados e monitorados, com consumer structure pronto para receber a implementação do worker pipeline na TASK-16.
