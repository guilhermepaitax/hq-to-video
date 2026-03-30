# TASK-16: Worker Pipeline — Orquestração End-to-End

| Campo        | Valor                  |
| ------------ | ---------------------- |
| **Prioridade** | 16 (Crítica)         |
| **Tipo**       | Backend / Worker     |
| **Estimativa** | 8h                   |
| **Depende de** | TASK-8, TASK-11, TASK-12, TASK-13, TASK-14, TASK-15 |

---

## Descrição

Implementar o **worker process** que consome jobs da fila e orquestra os 5 stages do pipeline de IA de forma sequencial, conforme seções 3.1 e 4.4 do PRD. Este é o componente que conecta todos os stages em um fluxo end-to-end.

## Critérios de Aceite

### Consumer (application layer)

- [ ] `VideoGenerationQueueConsumer` em `application/queues/video-generation-queue-consumer.ts` implementado com a lógica completa do pipeline (substituindo o placeholder da TASK-8):
  - Decorado com `@Injectable()`
  - Recebe todos os serviços de domínio via constructor injection:
    - `PdfExtractionService` (Stage 1)
    - `PanelAnalysisService` (Stage 2)
    - `ScriptGenerationService` (Stage 3)
    - `NarrationGenerationService` (Stage 4)
    - `VideoRenderGateway` (Stage 5)
    - `ProjectRepository` e `ProcessingJobRepository` (para atualizar progresso)
  - Método `handle(job: JobPayload): Promise<void>` executa os 5 stages em sequência

### Lógica do Pipeline

- [ ] Ao receber um job, executa os 5 stages em sequência:
  1. **PDF Extraction** — `PdfExtractionService.run()`
  2. **Vision AI** — `PanelAnalysisService.run()` para cada página extraída
  3. **Script Generation** — `ScriptGenerationService.run()`
  4. **TTS Narration** — `NarrationGenerationService.run()` para cada cena
  5. **Video Render** — `VideoRenderGateway.render()` do package `render`
- [ ] Status do `ProcessingJob` atualizado no banco a cada stage via `ProcessingJobRepository`:
  - `currentStep`: nome do stage atual
  - `progress`: percentual calculado (0-100)
  - `stepLabel`: label legível (ex: "Analyzing Panels 3/5", "Rendering Frames 65%")
- [ ] Ao completar com sucesso:
  - `ProjectRepository.updateStatus()` → `COMPLETED`
  - `ProjectRepository.updateVideo()` com `videoUrl`, `duration`, `format`
- [ ] Ao falhar:
  - `ProjectRepository.updateStatus()` → `CANCELLED` com `errorMessage`
  - `ProcessingJobRepository` atualizado com `errorDetails` e `attempts` incrementado
- [ ] Timeout global configurável por job (default: 5 minutos)
- [ ] Logging estruturado de cada step com tempos de execução

## Detalhes Técnicos

### Fluxo do Pipeline (Seção 4.4)

```
Job received from queue
  │
  ├─ Update status → "processing", step: "pdf_extraction"
  ├─ Stage 1: Extract PDF pages to images
  │
  ├─ Update step → "vision_analysis"
  ├─ Stage 2: Analyze each page with Vision AI
  │
  ├─ Update step → "script_gen"
  ├─ Stage 3: Generate narration script
  │
  ├─ Update step → "tts"
  ├─ Stage 4: Generate audio for each scene
  │
  ├─ Update step → "render"
  ├─ Stage 5: Render video with Remotion
  │
  ├─ Update status → "completed"
  └─ Save video URL + metadata
```

### Cálculo de Progresso

| Stage           | Weight | Progress Range |
| --------------- | ------ | -------------- |
| PDF Extraction  | 10%    | 0-10%          |
| Vision Analysis | 25%    | 10-35%         |
| Script Gen      | 15%    | 35-50%         |
| TTS             | 20%    | 50-70%         |
| Render          | 30%    | 70-100%        |

## Entregável

Worker funcional que processa um job completo do início ao fim: recebe PDF, executa todos os 5 stages, e produz um vídeo MP4 finalizado, atualizando progresso em tempo real no banco de dados.
