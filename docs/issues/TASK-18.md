# TASK-18: Frontend — Setup do Projeto + Design System

| Campo          | Valor                     |
| -------------- | ------------------------- |
| **Prioridade** | 18 (Alta)                 |
| **Tipo**       | Frontend / Infraestrutura |
| **Estimativa** | 6h                        |
| **Depende de** | TASK-1, TASK-9            |

---

## Descrição

Configurar o projeto `apps/frontend` com **React**, **TanStack Router**, **TailwindCSS** e os design tokens definidos no Appendix A do PRD. Integrar o package `api-client` para consumo dos hooks gerados. Estabelecer a base visual do "Heroic Vision".

## Critérios de Aceite

- [ ] Projeto React criado em `apps/frontend` com Vite como bundler
- [ ] TanStack Router configurado com rotas:
  - `/` — Dashboard
  - `/projects/new` — New Video Project
  - `/projects/:id` — Video Viewer
  - `/queue` — Processing Queue
- [ ] TailwindCSS configurado com design tokens do Appendix A:
  - **Background**: `#0A0A0F` range (dark)
  - **Surfaces**: `#1A1A2E` range (card backgrounds)
  - **Primary accent**: `#FF6B6B` (coral/red para CTAs)
  - **Secondary accent**: blue/purple para active states
  - **Status colors**: Green (Success), Blue (Processing), Red (Cancelled), Gray (Waiting)
- [ ] Fonte configurada: bold uppercase para headings, clean sans-serif para body
- [ ] React Query Provider configurado com `QueryClient`
- [ ] Package `@heroic-vision/api-client` importado e funcionando
- [ ] Base URL da API configurável via variável de ambiente `VITE_API_URL`
- [ ] Layout base criado com área de sidebar + conteúdo principal
- [ ] Script `dev` funcional: `pnpm --filter frontend dev` serve a aplicação
- [ ] Dark theme aplicado globalmente

## Detalhes Técnicos

### Design Tokens (Appendix A)

```css
:root {
  --bg-primary: #0a0a0f;
  --bg-surface: #1a1a2e;
  --accent-primary: #ff6b6b;
  --accent-secondary: #6b7bff;
  --status-success: #4ade80;
  --status-processing: #60a5fa;
  --status-cancelled: #f87171;
  --status-waiting: #9ca3af;
}
```

### Estrutura de Diretórios

```
apps/frontend/
├── src/
│   ├── routes/
│   │   ├── __root.tsx        # Root layout com sidebar
│   │   ├── index.tsx          # Dashboard
│   │   ├── projects.new.tsx   # New Video Project
│   │   ├── projects.$id.tsx   # Video Viewer
│   │   └── queue.tsx          # Processing Queue
│   ├── components/
│   │   └── ui/                # Componentes base (Button, Card, Badge, etc.)
│   ├── lib/
│   │   └── api.ts             # Configuração do API client
│   ├── styles/
│   │   └── globals.css        # TailwindCSS base + design tokens
│   └── main.tsx
├── tailwind.config.ts
├── vite.config.ts
├── package.json
└── tsconfig.json
```

### Dependências

- `react`, `react-dom`
- `@tanstack/react-router`
- `@tanstack/react-query`
- `tailwindcss`, `postcss`, `autoprefixer`
- `@heroic-vision/api-client` (workspace dependency)
- `vite`

## Entregável

Projeto frontend funcional com roteamento, design system dark theme, React Query configurado e api-client integrado — pronto para receber os componentes das telas.
