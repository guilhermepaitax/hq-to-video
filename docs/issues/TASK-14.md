# TASK-14: Pipeline Stage 4 — TTS Narration (Geração de Áudio)

| Campo        | Valor                  |
| ------------ | ---------------------- |
| **Prioridade** | 14 (Alta)            |
| **Tipo**       | Backend / AI Pipeline |
| **Estimativa** | 4h                   |
| **Depende de** | TASK-13              |

---

## Descrição

Implementar o **Stage 4** do pipeline de IA conforme seção 3.5 do PRD: conversão do roteiro narrado em áudio usando **Text-to-Speech** com entonação emocional correspondente ao mood de cada cena.

## Critérios de Aceite

### Interface (application layer)

- [ ] Interface `TTSGateway` definida em `application/contracts/tts-gateway.ts`:
  ```typescript
  export interface TTSGateway {
    generateAudio(text: string, options: TTSGateway.Options): Promise<TTSGateway.Result>
  }
  export namespace TTSGateway {
    export type Options = {
      voice: string
      mood: string
      format: 'mp3' | 'wav'
    }
    export type Result = {
      audioBuffer: Buffer
      durationMs: number
    }
  }
  ```

### Implementação Concreta (infra layer)

- [ ] `ElevenLabsTTSGateway` em `infra/ai/gateways/elevenlabs-tts-gateway.ts`:
  - Implementa `TTSGateway`
  - Decorado com `@Injectable()`
  - Usa ElevenLabs API como provider primário
  - API key via variável de ambiente `ELEVENLABS_API_KEY`
  - Retry com backoff para falhas de API

### Serviço de Domínio (application layer)

- [ ] `NarrationGenerationService` em `application/services/narration-generation-service.ts`:
  - Decorado com `@Injectable()`
  - Recebe `TTSGateway` e `StorageGateway` via constructor injection
  - Para cada cena: chama `TTSGateway.generateAudio()` e salva via `StorageGateway.saveAudio()`
  - Concatena áudios individuais em master audio (via `fluent-ffmpeg`)
  - Salva master audio no storage
  - Retorna array de `AudioResult` + master audio path

### Comportamento

- [ ] Áudio gerado em 44.1 kHz, 16-bit, mono conforme PRD
- [ ] Latência <= 3 segundos por cena
- [ ] Duração real do áudio retornada (para ajustar timestamps no render)
- [ ] Output: `AudioResult[]` com `sceneIndex`, `audioPath`, `durationMs` + `masterAudioPath`

### Registro no DI

- [ ] `ElevenLabsTTSGateway` e `NarrationGenerationService` registrados no `kernel/di/registry.ts`

## Detalhes Técnicos

### TTSOptions

```typescript
interface TTSOptions {
  voice: string           // ID da voz no ElevenLabs
  mood: string            // "dark-heroic", "suspense", "epic", etc.
  format: 'mp3' | 'wav'
}

interface AudioResult {
  scenIndex: number
  audioPath: string       // path relativo no storage
  durationMs: number      // duração real do áudio em ms
}
```

### Fluxo

```
Script (scenes[]) → ElevenLabs TTS (per scene) → Audio files (storage)
                                                 → Master audio (concatenação)
```

### Ajuste de Timestamps

A duração real do áudio pode diferir da duração planejada no script. O output deste stage deve incluir as durações reais para que o Stage 5 (Render) ajuste os frames corretamente.

### Estrutura de Arquivos

```
apps/backend/src/
├── application/
│   ├── contracts/
│   │   └── tts-gateway.ts
│   └── services/
│       └── narration-generation-service.ts
└── infra/
    └── ai/
        └── gateways/
            └── elevenlabs-tts-gateway.ts
```

### Dependências

- `elevenlabs` (SDK) ou chamadas HTTP diretas à API
- `fluent-ffmpeg` (para concatenação do master audio)

## Entregável

Serviço `NarrationGenerationService` e gateway `ElevenLabsTTSGateway` que convertem texto de narração em áudio expressivo, salvam arquivos por cena e master audio, retornando durações reais para sincronização com o vídeo.
