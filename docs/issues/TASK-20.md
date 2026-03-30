# TASK-20: Frontend — Dashboard Screen

| Campo        | Valor                  |
| ------------ | ---------------------- |
| **Prioridade** | 20 (Média)           |
| **Tipo**       | Frontend / UI        |
| **Estimativa** | 5h                   |
| **Depende de** | TASK-18, TASK-19     |

---

## Descrição

Implementar a tela de **Dashboard** conforme Screen 1 da seção 2.3 e User Story US-04 do PRD. Esta é a tela principal que o usuário vê ao acessar a aplicação.

## Critérios de Aceite

- [ ] Página implementada em `src/routes/index.tsx`
- [ ] **Hero Banner** no topo:
  - Título "Transform Panels Into Motion"
  - Subtítulo descritivo
  - Botão CTA "Create New Project" (coral/red) que navega para `/projects/new`
- [ ] **Metrics Row** com 3 cards:
  - "Total Videos Generated" — contador + badge "+12%" (usando `useGetDashboardMetrics`)
  - "Active Jobs" — contador + badge "Active"
  - "Conversion Rate" — porcentagem + badge "High"
- [ ] **Recent Projects** section:
  - Grid de até 4 project cards
  - Cada card com: thumbnail (placeholder se não houver), título, timestamp relativo, status badge
  - Status badge colorido: Verde (Completed), Azul (Processing), Vermelho (Cancelled), Cinza (Waiting)
  - Botão de ação: "Open" para completed, "Retry" para cancelled
  - Usando `useGetProjects` hook do api-client
- [ ] **FAB (Floating Action Button)** no canto inferior direito (+) para criação rápida
- [ ] Loading states com skeletons/placeholders enquanto dados carregam
- [ ] Empty state quando não há projetos ("No projects yet. Create your first video!")
- [ ] Dados carregados via React Query hooks do api-client

## Detalhes Técnicos

### Hooks Utilizados

```typescript
const { data: metrics } = useGetDashboardMetrics()
const { data: projects } = useGetProjects()
```

### Componentes

- `HeroBanner` — banner com CTA
- `MetricCard` — card de métrica individual
- `ProjectCard` — card de projeto com thumbnail, status e ação
- `FloatingActionButton` — FAB de criação

### Referência Figma

[Dashboard](https://www.figma.com/design/MupzTsbp3eceYTly9twFbA/Untitled?node-id=1-2)

## Entregável

Tela Dashboard completa com hero banner, métricas, projetos recentes e FAB, consumindo dados reais da API via hooks gerados.
