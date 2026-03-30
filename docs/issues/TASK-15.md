# TASK-15: Production Remotion Render Package (Stage 5)

| Campo        | Valor                  |
| ------------ | ---------------------- |
| **Prioridade** | 15 (Alta)            |
| **Tipo**       | Render / Produção    |
| **Estimativa** | 6h                   |
| **Depende de** | TASK-10              |

---

## Descrição

Migrar o template validado no POC (TASK-10) para o package de produção `packages/render`, criando uma composição Remotion robusta que será usada pelos workers para renderizar os vídeos finais. Conforme seção 3.6 do PRD.

## Critérios de Aceite

- [ ] Package `packages/render` configurado com Remotion para uso programático
- [ ] Composição `ComicVideoComposition` que aceita `VideoInputProps` (seção 4.10)
- [ ] Efeitos de câmera implementados e polidos:
  - `slow-zoom`: zoom suave de 1.0x para 1.15x
  - `ken-burns-pan`: pan horizontal + zoom, alternando direção entre cenas
  - `static`: imagem estática (sem movimento)
  - `fade`: fade-in (0.5s) e fade-out (0.5s) na cena
- [ ] Texto de narração como overlay:
  - Posicionado na parte inferior (safe area)
  - Background semi-transparente para legibilidade
  - Animação de entrada (fade-in por palavra ou por frase)
- [ ] Transição entre cenas (crossfade de 0.5s)
- [ ] Suporte a áudio:
  - Áudio de narração por cena sincronizado com os frames
  - Master audio como trilha de fundo (quando fornecido)
- [ ] Resolução: 1080x1920 (9:16 vertical) — 4K opcional
- [ ] Frame rate: 30 FPS
- [ ] API de renderização programática exportada:
  ```typescript
  export async function renderVideo(props: VideoInputProps): Promise<string>
  ```
- [ ] Render time <= 2 minutos para vídeo de 60 segundos
- [ ] Output: arquivo MP4

## Detalhes Técnicos

### API de Renderização

```typescript
import { bundle } from '@remotion/bundler'
import { renderMedia } from '@remotion/renderer'

export async function renderVideo(props: VideoInputProps): Promise<string> {
  const bundled = await bundle(compositionPath)
  const outputPath = await renderMedia({
    composition: 'ComicVideo',
    serveUrl: bundled,
    codec: 'h264',
    outputLocation: outputPath,
    inputProps: props,
  })
  return outputPath
}
```

### Estrutura do Package

```
packages/render/
├── src/
│   ├── compositions/
│   │   └── ComicVideo.tsx        # Composição principal
│   ├── components/
│   │   ├── SceneRenderer.tsx     # Renderiza uma cena individual
│   │   ├── NarrationOverlay.tsx  # Texto de narração overlay
│   │   ├── CameraEffect.tsx     # Efeitos Ken Burns / zoom / pan
│   │   └── Transition.tsx       # Crossfade entre cenas
│   ├── render.ts                 # API programática de render
│   └── types.ts                  # VideoInputProps, Scene
├── package.json
└── tsconfig.json
```

### Dependências

- `remotion`
- `@remotion/bundler`
- `@remotion/renderer`
- `@remotion/cli` (dev)

## Entregável

Package de render pronto para produção que exporta uma função `renderVideo()` capaz de gerar um MP4 vertical a partir de dados de cenas, imagens e áudio.
