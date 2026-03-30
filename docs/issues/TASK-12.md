# TASK-12: Pipeline Stage 2 — Vision AI (Análise de Painéis)

| Campo        | Valor                  |
| ------------ | ---------------------- |
| **Prioridade** | 12 (Alta)            |
| **Tipo**       | Backend / AI Pipeline |
| **Estimativa** | 6h                   |
| **Depende de** | TASK-11              |

---

## Descrição

Implementar o **Stage 2** do pipeline de IA conforme seção 3.3 do PRD: análise de cada imagem de página usando **Vision AI** para detectar painéis individuais e extrair metadados estruturados (descrição, emoção, diálogos, bounding box).

## Critérios de Aceite

### Interface (application layer)

- [ ] Interface `VisionAIGateway` definida em `application/contracts/vision-ai-gateway.ts`:
  ```typescript
  export interface VisionAIGateway {
    analyzePage(imagePath: string): Promise<PanelAnalysis[]>
  }
  ```

### Prompt (infra layer)

- [ ] Template de prompt em `infra/ai/prompts/panel-analysis-prompt.ts`:
  - Instrui o modelo a identificar cada painel separadamente
  - Retornar JSON estruturado para cada painel
  - Transcrever texto exato dos balões de fala
  - Classificar emoção dominante

### Implementação Concreta (infra layer)

- [ ] `OpenAIVisionGateway` em `infra/ai/gateways/openai-vision-gateway.ts`:
  - Implementa `VisionAIGateway`
  - Decorado com `@Injectable()`
  - Usa OpenAI GPT-4o Vision como provider primário
  - API key via variável de ambiente `OPENAI_API_KEY`
  - Rate limiting e retry com exponential backoff para chamadas à API
  - Tratamento de erro para resposta inválida (JSON malformado)

### Serviço de Domínio (application layer)

- [ ] `PanelAnalysisService` em `application/services/panel-analysis-service.ts`:
  - Decorado com `@Injectable()`
  - Recebe `VisionAIGateway` e `StorageGateway` via constructor injection
  - Para cada imagem: chama `VisionAIGateway.analyzePage()` e recorta painéis com bounding box via `sharp`
  - Salva crops dos painéis no storage

### Comportamento

- [ ] Output por painel conforme schema da seção 3.3: `panelIndex`, `description`, `emotion`, `dialogues[]`, `boundingBox`
- [ ] Acurácia de detecção >= 90% dos painéis por página (meta do PRD)
- [ ] Acurácia de extração de diálogos >= 85%
- [ ] Imagens dos painéis recortadas (crop) e salvas no storage

### Registro no DI

- [ ] `OpenAIVisionGateway` e `PanelAnalysisService` registrados no `kernel/di/registry.ts`

## Detalhes Técnicos

### Output Schema (Seção 3.3)

```json
{
  "panelIndex": 1,
  "description": "Batman stands on a rooftop overlooking Gotham...",
  "emotion": "tension",
  "dialogues": [
    { "character": "Batman", "text": "The city screams for justice..." },
    { "character": "Commissioner Gordon", "text": "We need you tonight." }
  ],
  "boundingBox": { "x": 0, "y": 0, "width": 500, "height": 400 }
}
```

### Prompt Strategy

O prompt deve instruir o modelo Vision a:
1. Identificar cada painel separadamente (bordas, gutters)
2. Retornar JSON estruturado para cada painel
3. Usar contexto da página inteira para entender a narrativa
4. Transcrever texto exato dos balões de fala

### Estrutura de Arquivos

```
apps/backend/src/
├── application/
│   ├── contracts/
│   │   └── vision-ai-gateway.ts
│   └── services/
│       └── panel-analysis-service.ts
└── infra/
    └── ai/
        ├── prompts/
        │   └── panel-analysis-prompt.ts
        └── gateways/
            └── openai-vision-gateway.ts
```

### Dependências

- `openai` (SDK Node.js)
- `sharp` (para crop dos painéis)

## Entregável

Serviço `PanelAnalysisService` e gateway `OpenAIVisionGateway` que juntos analisam imagens de páginas de HQ via Vision AI e retornam metadados estruturados de cada painel, seguindo a Clean Architecture.
