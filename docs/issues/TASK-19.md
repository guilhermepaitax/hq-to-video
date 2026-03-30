# TASK-19: Frontend — Sidebar Navigation

| Campo        | Valor                  |
| ------------ | ---------------------- |
| **Prioridade** | 19 (Média)           |
| **Tipo**       | Frontend / UI        |
| **Estimativa** | 3h                   |
| **Depende de** | TASK-18              |

---

## Descrição

Implementar o componente de **Sidebar Navigation** que é compartilhado por todas as telas da aplicação, conforme a especificação da seção 2.3 do PRD e o design do Figma.

## Critérios de Aceite

- [ ] Componente `Sidebar` implementado em `src/components/Sidebar.tsx`
- [ ] Sidebar fixo à esquerda com largura fixa
- [ ] Elementos da sidebar conforme PRD:
  - **Logo** "Heroic Vision" no topo
  - **User profile** — avatar e nome (placeholder para MVP single-user)
  - **Links de navegação**:
    - Projects (ícone + label) — link para `/`
    - Queue (ícone + label) — link para `/queue`
    - Settings (ícone + label) — placeholder (não funcional no MVP)
    - Support (ícone + label) — placeholder (não funcional no MVP)
  - **Sign Out** no rodapé — placeholder (não funcional no MVP)
- [ ] Link ativo destacado com estilo diferenciado (accent secondary)
- [ ] Sidebar integrado no root layout (`__root.tsx`) para todas as rotas
- [ ] Estilo dark theme consistente com design tokens (background surface, texto claro)
- [ ] Botão "Create New Video" no rodapé da sidebar (link para `/projects/new`)
- [ ] Ícones usando biblioteca de ícones (Lucide React ou similar)

## Detalhes Técnicos

### Layout Structure

```
┌──────────┬────────────────────────────────────┐
│          │                                     │
│  Sidebar │         Main Content Area           │
│  (fixed) │         (route outlet)              │
│          │                                     │
│  Logo    │                                     │
│  Profile │                                     │
│  ─────── │                                     │
│  Projects│                                     │
│  Queue   │                                     │
│  Settings│                                     │
│  Support │                                     │
│  ─────── │                                     │
│  Sign Out│                                     │
│          │                                     │
│  [+ New] │                                     │
└──────────┴────────────────────────────────────┘
```

### Dependências

- `lucide-react` (ícones)

## Entregável

Componente Sidebar funcional com navegação entre páginas, integrado no layout raiz da aplicação, seguindo o design system dark theme do Heroic Vision.
