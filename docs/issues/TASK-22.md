# TASK-22: Frontend — Processing Queue Screen

| Campo        | Valor                  |
| ------------ | ---------------------- |
| **Prioridade** | 22 (Média)           |
| **Tipo**       | Frontend / UI        |
| **Estimativa** | 5h                   |
| **Depende de** | TASK-18, TASK-19     |

---

## Descrição

Implementar a tela de **Processing Queue** conforme Screen 4 da seção 2.3 e User Story US-06 do PRD. Esta tela mostra todos os jobs de geração de vídeo e seus status em tempo real.

## Critérios de Aceite

- [ ] Página implementada em `src/routes/queue.tsx`
- [ ] **Page Header**:
  - Label "Operational Feed"
  - Título "Processing Queue"
  - Counter "Active Tasks" (número de jobs em processamento)
  - Counter "Completed Today" (número de jobs concluídos hoje)
- [ ] **Queue List** — lista vertical de todos os jobs:
  - Cada item exibe: thumbnail, título, formato do vídeo, duração, status badge
  - **Processing**: progress bar com step label e porcentagem (ex: "Rendering Frames 65%")
  - **Completed**: botões "Download" e "Publish"
  - **Cancelled**: botão "Retry" + motivo da falha
  - **Waiting**: posição na fila
- [ ] Status badges com cores corretas:
  - Verde: Completed
  - Azul: Processing
  - Vermelho: Cancelled
  - Cinza: Waiting
- [ ] Clicar em item completed navega para `/projects/:id` (Video Viewer)
- [ ] Dados carregados via `useGetProjects` ou `useGetQueue`
- [ ] Atualização em tempo real via WebSocket (TASK-17) ou polling
- [ ] Loading state com skeleton
- [ ] Empty state quando não há jobs

## Detalhes Técnicos

### Hooks Utilizados

```typescript
const { data: projects } = useGetProjects()
const { data: queue } = useGetQueue()
```

### Componentes

- `QueueHeader` — header com counters
- `QueueItem` — item individual com status, progress e ações
- `ProgressBar` — barra de progresso animada com label
- `StatusBadge` — badge colorido por status

### Referência Figma

[Processing Queue](https://www.figma.com/design/MupzTsbp3eceYTly9twFbA/Untitled?node-id=1-180)

## Entregável

Tela de Processing Queue funcional mostrando todos os jobs com progresso em tempo real, ações contextuais por status, e navegação para o Video Viewer.
