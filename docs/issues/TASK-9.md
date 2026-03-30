# TASK-9: Setup do Kubb — Geração Automática do API Client

| Campo        | Valor                  |
| ------------ | ---------------------- |
| **Prioridade** | 9 (Alta)             |
| **Tipo**       | Tooling / Frontend   |
| **Estimativa** | 3h                   |
| **Depende de** | TASK-1, TASK-2       |

---

## Descrição

Configurar o package `packages/api-client` com **Kubb** para geração automática de TypeScript types, React Query hooks e fetch wrappers a partir do arquivo `docs/openapi.json` gerado automaticamente pelo Fastify na TASK-2, conforme seção 4.5 do PRD.

## Critérios de Aceite

- [ ] `packages/api-client/package.json` configurado com dependências do Kubb
- [ ] `kubb.config.ts` criado com input apontando para o spec gerado pelo Fastify:
  ```ts
  input: {
    path: '../../docs/openapi.json',  // gerado por pnpm --filter backend openapi:export
  }
  ```
- [ ] Plugins configurados: `pluginOas`, `pluginTs`, `pluginReactQuery`
- [ ] React Query hooks gerados para todos os endpoints:
  - `useCreateProjectMutation` (POST /api/projects)
  - `useGetProjects` (GET /api/projects)
  - `useGetProjectById` (GET /api/projects/:id)
  - `useGetProjectVideo` (GET /api/projects/:id/video)
  - `useRetryProjectMutation` (POST /api/projects/:id/retry)
  - `useGetQueue` (GET /api/queue)
  - `useGetDashboardMetrics` (GET /api/dashboard/metrics)
  - `usePublishProjectMutation` (POST /api/projects/:id/publish)
- [ ] Hooks agrupados por tag conforme definido no `@fastify/swagger`: `ProjectsHooks`, `QueueHooks`, `DashboardHooks`
- [ ] TypeScript types gerados para request/response de todos os endpoints (derivados dos schemas Zod via JSON Schema via OpenAPI)
- [ ] Scripts no `package.json`:
  - `generate`: executa `kubb generate` (lê `docs/openapi.json`)
  - `build`: executa `kubb generate && tsc`
- [ ] Barrel export (`index.ts`) exportando todos os hooks e types gerados
- [ ] `pnpm --filter api-client generate` executa com sucesso após `pnpm --filter backend openapi:export`

## Detalhes Técnicos

### Dependência do Fluxo

Esta task depende da TASK-2 que, por sua vez, depende da TASK-3. O `docs/openapi.json` deve existir antes de executar `kubb generate`:

```
pnpm --filter backend openapi:export   # gera docs/openapi.json
pnpm --filter api-client generate      # gera packages/api-client/src/gen/
```

Ambos os passos devem ser encadeados no pipeline do Turborepo:

```json
// turbo.json
{
  "tasks": {
    "generate": {
      "dependsOn": ["^openapi:export"],
      "outputs": ["src/gen/**"]
    }
  }
}
```

### Estrutura Gerada

```
packages/api-client/
├── src/
│   ├── gen/
│   │   ├── types/          # TS interfaces derivadas dos schemas Zod
│   │   ├── hooks/          # React Query hooks por tag
│   │   └── clients/        # Fetch wrappers tipados
│   └── index.ts            # Barrel export
├── kubb.config.ts
├── package.json
└── tsconfig.json
```

### kubb.config.ts

```ts
import { defineConfig } from '@kubb/core'
import { pluginOas } from '@kubb/plugin-oas'
import { pluginTs } from '@kubb/plugin-ts'
import { pluginReactQuery } from '@kubb/plugin-react-query'

export default defineConfig({
  input: {
    path: '../../docs/openapi.json',
  },
  output: {
    path: './src/gen',
    clean: true,
  },
  plugins: [
    pluginOas(),
    pluginTs(),
    pluginReactQuery({
      output: { path: './hooks' },
      client: { dataReturnType: 'data' },
      query: { methods: ['get'], importPath: '@tanstack/react-query' },
      mutation: { methods: ['post', 'put', 'delete'] },
      group: { type: 'tag', name: ({ group }) => `${group}Hooks` },
    }),
  ],
})
```

### Dependências

- `@kubb/cli`
- `@kubb/core`
- `@kubb/plugin-oas`
- `@kubb/plugin-ts`
- `@kubb/plugin-react-query`
- `@tanstack/react-query` (peer dependency)

## Entregável

Package `api-client` que lê o `docs/openapi.json` gerado automaticamente pelo Fastify e produz hooks tipados e prontos para uso no frontend, garantindo type-safety end-to-end entre backend e frontend sem escrita manual de tipos.
