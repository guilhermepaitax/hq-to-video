# TASK-1: Monorepo Setup com pnpm Workspaces + Turborepo

| Campo        | Valor                  |
| ------------ | ---------------------- |
| **Prioridade** | 1 (Crítica)          |
| **Tipo**       | Infraestrutura       |
| **Estimativa** | 4h                   |
| **Depende de** | —                    |

---

## Descrição

Configurar a estrutura base do monorepo usando **pnpm workspaces** e **Turborepo** conforme definido na seção 4.2 do PRD. Essa task é o alicerce de todo o projeto — nenhuma outra task pode ser iniciada antes desta.

## Critérios de Aceite

- [ ] Repositório inicializado com `pnpm` como package manager
- [ ] `pnpm-workspace.yaml` configurado com os workspaces: `apps/*`, `packages/*`
- [ ] `turbo.json` configurado com pipelines para `build`, `dev`, `lint` e `test`
- [ ] Diretórios criados: `apps/frontend`, `apps/backend`, `packages/api-client`, `packages/poc-remotion`, `packages/render`
- [ ] Cada workspace possui um `package.json` mínimo com `name` e `version`
- [ ] `package.json` raiz com scripts `dev`, `build`, `lint` e `test` delegando ao Turbo
- [ ] TypeScript configurado com `tsconfig.json` base na raiz e `tsconfig.json` por workspace estendendo o base
- [ ] ESLint e Prettier configurados na raiz com regras compartilhadas
- [ ] `.gitignore` configurado para Node.js, `node_modules`, `dist`, `.env`
- [ ] Executar `pnpm install` e `pnpm build` com sucesso (sem erros)

## Detalhes Técnicos

### Estrutura de Diretórios

```
hq-to-video/
├── apps/
│   ├── frontend/package.json
│   └── backend/package.json
├── packages/
│   ├── api-client/package.json
│   ├── poc-remotion/package.json
│   └── render/package.json
├── docs/
├── package.json
├── pnpm-workspace.yaml
├── turbo.json
├── tsconfig.base.json
├── .eslintrc.js
├── .prettierrc
└── .gitignore
```

### Dependências Raiz

- `turbo`
- `typescript`
- `eslint`
- `prettier`

## Entregável

Monorepo funcional onde `pnpm install`, `pnpm build` e `pnpm lint` executam com sucesso em todos os workspaces.
