# Backend — AI Agent Instructions

When making **any** change inside `apps/backend/`, you **must** follow the architecture rules defined in the skill file:

```
.agents/skills/api-architecture/SKILL.md
```

Read that file before adding or modifying any of the following:

- Entities (`application/entities/`)
- Repository / Gateway contracts (`application/contracts/`)
- Use cases (`application/usecases/`)
- Controllers and schemas (`application/controllers/`)
- Infra implementations (`infra/database/`, `infra/gateways/`, `infra/ai/`)
- Entry points (`main/functions/`)

## Quick Reference

| What you are adding        | Where it lives                                      |
| -------------------------- | --------------------------------------------------- |
| Domain entity              | `application/entities/<domain>.ts`                  |
| Repository interface       | `application/contracts/<domain>-repository.ts`      |
| Use case                   | `application/usecases/<domain>/<action>-usecase.ts` |
| Request/response schema    | `application/controllers/<domain>/schemas/`         |
| Controller                 | `application/controllers/<domain>/<action>-controller.ts` |
| Drizzle repository         | `infra/database/drizzle/repositories/<domain>-repository.ts` |
| Drizzle item mapper        | `infra/database/drizzle/items/<domain>-item.ts`     |
| External gateway           | `infra/gateways/<domain>/`                          |
| AI gateway                 | `infra/ai/gateways/`                                |
| Route entry point          | `main/functions/<domain>/<action>.ts`               |

## Key Rules

- **Entities** use the `Attributes` constructor pattern and declare enums + `Attributes` type inside a namespace on the same file.
- **Repository contracts** declare method-specific input types in a namespace on the same file.
- **Drizzle repositories** implement contracts, are decorated with `@Injectable()`, and delegate DB ↔ entity mapping to item mapper functions in `items/`.
- **Controllers** extend `Controller<TType, TResponse>` and are framework-agnostic.
- **No framework imports** in `application/` — only `shared/` and `kernel/`.
- After any schema change, run `pnpm --filter backend openapi:export` and then `pnpm --filter api-client generate`.
