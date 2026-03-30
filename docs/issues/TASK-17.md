# TASK-17: WebSocket — Atualizações de Progresso em Tempo Real

| Campo        | Valor                  |
| ------------ | ---------------------- |
| **Prioridade** | 17 (Média)           |
| **Tipo**       | Backend / Frontend   |
| **Estimativa** | 5h                   |
| **Depende de** | TASK-3, TASK-16      |

---

## Descrição

Implementar comunicação **WebSocket** entre backend e frontend para enviar atualizações de progresso em tempo real durante o processamento de vídeos, conforme mencionado na seção 4.4 do PRD ("Frontend polls via useGetProjectById() or receives WebSocket update").

## Critérios de Aceite

- [ ] WebSocket server implementado no backend (via `@fastify/websocket` ou `ws`)
- [ ] Endpoint WebSocket: `ws://localhost:3001/ws`
- [ ] Eventos emitidos pelo backend:
  - `job:progress` — quando o progresso de um job atualiza
    ```json
    { "type": "job:progress", "projectId": "uuid", "currentStep": "vision_analysis", "progress": 35, "stepLabel": "Analyzing Panels 3/5" }
    ```
  - `job:completed` — quando um job finaliza com sucesso
    ```json
    { "type": "job:completed", "projectId": "uuid", "videoUrl": "..." }
    ```
  - `job:failed` — quando um job falha
    ```json
    { "type": "job:failed", "projectId": "uuid", "error": "..." }
    ```
- [ ] Worker emite eventos via interface `EventEmitterPort` ao atualizar progresso
- [ ] Frontend pode se conectar ao WebSocket e receber atualizações
- [ ] Fallback para polling via `useGetProjectById()` caso WebSocket não esteja disponível
- [ ] Reconexão automática no frontend em caso de desconexão
- [ ] Sem necessidade de autenticação (MVP single-user)

## Detalhes Técnicos

### EventEmitter Port

```typescript
interface EventEmitterPort {
  emit(event: string, data: unknown): void
  on(event: string, handler: (data: unknown) => void): void
}
```

### WebSocket Messages

```typescript
type WSMessage =
  | { type: 'job:progress'; projectId: string; currentStep: string; progress: number; stepLabel: string }
  | { type: 'job:completed'; projectId: string; videoUrl: string }
  | { type: 'job:failed'; projectId: string; error: string }
```

### Frontend Hook (Custom)

```typescript
function useProjectUpdates(projectId: string) {
  // Connect to WebSocket
  // Listen for messages matching projectId
  // Update React Query cache on receive
  // Fallback to polling if WS unavailable
}
```

### Dependências

- `@fastify/websocket` ou `ws`

## Entregável

Sistema de WebSocket funcional onde o frontend recebe atualizações em tempo real do progresso de processamento, com fallback para polling.
