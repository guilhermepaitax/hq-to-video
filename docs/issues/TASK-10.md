# TASK-10: POC Remotion — Template de Vídeo Experimental

| Campo        | Valor                  |
| ------------ | ---------------------- |
| **Prioridade** | 10 (Alta)            |
| **Tipo**       | Render / POC         |
| **Estimativa** | 6h                   |
| **Depende de** | TASK-1               |

---

## Descrição

Criar um **Proof of Concept** no package `packages/poc-remotion` para validar a geração de vídeo com **Remotion** usando dados hardcoded de cenas. Este POC será a base para o template de produção na TASK-15.

## Critérios de Aceite

- [ ] Package `packages/poc-remotion` configurado com Remotion
- [ ] Composição Remotion criada para vídeo vertical 9:16 (1080x1920)
- [ ] Componente `ComicVideo` que aceita `VideoInputProps` conforme seção 4.10 do PRD
- [ ] Cenas implementadas com:
  - Imagem do painel como fundo (full-screen, cover)
  - Texto de narração como overlay na parte inferior
  - Efeito Ken Burns (pan & zoom lento) aplicado na imagem
  - Transição fade entre cenas
- [ ] Dados hardcoded com pelo menos 3 cenas de exemplo (usando imagens de placeholder)
- [ ] Vídeo renderizável via Remotion Studio (`pnpm --filter poc-remotion dev`)
- [ ] Vídeo exportável para MP4 via CLI (`pnpm --filter poc-remotion render`)
- [ ] FPS configurado em 30
- [ ] Duração total do vídeo calculada automaticamente a partir das cenas

## Detalhes Técnicos

### VideoInputProps (Seção 4.10)

```typescript
interface VideoInputProps {
  title: string;
  scenes: Scene[];
  masterAudioUrl: string;
  fps: number;
  width: number;
  height: number;
}

interface Scene {
  sceneIndex: number;
  startFrame: number;
  durationInFrames: number;
  imageUrl: string;
  audioUrl: string;
  narrationText: string;
  cameraEffect: "slow-zoom" | "ken-burns-pan" | "static" | "fade";
  mood: string;
}
```

### Efeitos de Câmera

- `slow-zoom`: zoom in lento de 1.0x para 1.15x durante a cena
- `ken-burns-pan`: combinação de pan horizontal + zoom sutil
- `static`: sem movimento
- `fade`: fade in no início e fade out no final da cena

### Dependências

- `remotion`
- `@remotion/cli`
- `@remotion/bundler`
- `@remotion/renderer`

## Entregável

POC funcional do Remotion que gera um vídeo vertical de 30 FPS com efeitos Ken Burns, texto overlay e transições, validando a viabilidade técnica do pipeline de renderização.
