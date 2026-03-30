# TASK-13: Pipeline Stage 3 — LLM Script Generation (Geração de Roteiro)

| Campo        | Valor                  |
| ------------ | ---------------------- |
| **Prioridade** | 13 (Alta)            |
| **Tipo**       | Backend / AI Pipeline |
| **Estimativa** | 5h                   |
| **Depende de** | TASK-12              |

---

## Descrição

Implementar o **Stage 3** do pipeline de IA conforme seção 3.4 do PRD: transformar a análise estruturada dos painéis em um **roteiro narrado** otimizado para vídeos curtos virais (TikTok/Reels).

## Critérios de Aceite

### Interface (application layer)

- [ ] Interface `ScriptGeneratorGateway` definida em `application/contracts/script-generator-gateway.ts`:
  ```typescript
  export interface ScriptGeneratorGateway {
    generateScript(input: ScriptGeneratorGateway.Input): Promise<VideoScript>
  }
  export namespace ScriptGeneratorGateway {
    export type Input = {
      panels: PanelAnalysis[]
      creativeBrief?: string
      narrationStyle: string
    }
  }
  ```

### Prompt (infra layer)

- [ ] Template de prompt em `infra/ai/prompts/script-generation-prompt.ts`:
  - Instrui estrutura narrativa: Hook (0-3s), Rising action, Climax, Cliffhanger/CTA
  - Duração total entre 15-60 segundos
  - Narração em PT-BR
  - Referências corretas aos painéis e efeitos de câmera

### Implementação Concreta (infra layer)

- [ ] `OpenAIScriptGeneratorGateway` em `infra/ai/gateways/openai-script-generator-gateway.ts`:
  - Implementa `ScriptGeneratorGateway`
  - Decorado com `@Injectable()`
  - Usa OpenAI GPT-4o como provider primário
  - API key via variável de ambiente `OPENAI_API_KEY`

### Serviço de Domínio (application layer)

- [ ] `ScriptGenerationService` em `application/services/script-generation-service.ts`:
  - Decorado com `@Injectable()`
  - Recebe `ScriptGeneratorGateway` via constructor injection
  - Incorpora `creativeBrief` e `narrationStyle` no input
  - Valida output: duração coerente, referências de painéis válidas

### Comportamento

- [ ] Input: array de `PanelAnalysis[]`, creative brief, narration style
- [ ] Output: `title`, `totalDuration`, `scenes[]` conforme schema seção 3.4
- [ ] Tom e estilo alinhados com `narrationStyle` (Classic Noir, Epic Narrator, Casual Storyteller)
- [ ] Creative brief incorporado ao prompt quando fornecido

### Registro no DI

- [ ] `OpenAIScriptGeneratorGateway` e `ScriptGenerationService` registrados no `kernel/di/registry.ts`

## Detalhes Técnicos

### Output Schema (Seção 3.4)

```json
{
  "title": "Neon Knight — Episode 04",
  "totalDuration": 24,
  "scenes": [
    {
      "sceneIndex": 1,
      "startTime": 0,
      "endTime": 8,
      "narration": "A cidade clama por justiça... e eu sou a resposta.",
      "panelReferences": [1, 2],
      "mood": "dark-heroic",
      "cameraEffect": "slow-zoom"
    }
  ]
}
```

### Narration Styles

- **Classic Noir Monologue**: tom sombrio, introspectivo, frases curtas
- **Epic Narrator**: tom grandioso, épico, voz de trailer
- **Casual Storyteller**: tom conversacional, como quem conta uma história para amigos

### Estrutura de Arquivos

```
apps/backend/src/
├── application/
│   ├── contracts/
│   │   └── script-generator-gateway.ts
│   └── services/
│       └── script-generation-service.ts
└── infra/
    └── ai/
        ├── prompts/
        │   └── script-generation-prompt.ts
        └── gateways/
            └── openai-script-generator-gateway.ts
```

### Dependências

- `openai` (SDK Node.js)

## Entregável

Serviço `ScriptGenerationService` e gateway `OpenAIScriptGeneratorGateway` que juntos produzem um roteiro timestamped a partir da análise de painéis, pronto para narração TTS e renderização de vídeo.
