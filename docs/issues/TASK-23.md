# TASK-23: Frontend — Video Viewer Screen

| Campo        | Valor                  |
| ------------ | ---------------------- |
| **Prioridade** | 23 (Média)           |
| **Tipo**       | Frontend / UI        |
| **Estimativa** | 6h                   |
| **Depende de** | TASK-18, TASK-19     |

---

## Descrição

Implementar a tela de **Video Viewer** conforme Screen 3 da seção 2.3 e User Story US-05 do PRD. Esta tela permite ao usuário visualizar, fazer download e exportar o vídeo gerado.

## Critérios de Aceite

### Video Player

- [ ] Player de vídeo com controles completos:
  - Play/pause
  - Seek bar
  - Skip forward/backward (10s)
  - Volume control
  - Fullscreen
- [ ] Texto de narração como overlay no vídeo (sincronizado)
- [ ] Player responsivo mantendo aspect ratio 9:16

### Informações do Projeto

- [ ] **Video Title**: nome do projeto + número do episódio
- [ ] Label "AI-Generated Comic Adaptation"
- [ ] **Metadata Grid** (2x2):
  - Format (ex: "9:16 / 4K")
  - Duration (ex: "0:24")
  - Style (ex: "Cinematic HDR")
  - BPM (ex: "120 BPM")

### Ações

- [ ] Botão **"Download MP4"** (coral/red, primário) — baixa o arquivo de vídeo
- [ ] Botão **"Export to TikTok"** (outlined) — inicia fluxo de publicação (placeholder, funcional na TASK-28)
- [ ] Link **"Edit Instructions"** — navega de volta para edição do creative brief (re-geração)

### Scene Breakdown

- [ ] Lista de cenas com:
  - Thumbnail da cena
  - Range de timestamp (ex: "0:00 - 0:08")
  - Descrição breve da cena
- [ ] Dados extraídos do campo `metadata` do projeto

### More Adaptations

- [ ] Carousel horizontal com outros vídeos gerados
- [ ] Cada item com: título, duração, resolução
- [ ] Dados via `useGetProjects`

### Dados

- [ ] Página implementada em `src/routes/projects.$id.tsx`
- [ ] Dados carregados via `useGetProjectById` com o `id` da rota
- [ ] Loading state enquanto dados carregam
- [ ] Error state se projeto não encontrado (404)
- [ ] Redirect para queue se projeto ainda está processando

## Detalhes Técnicos

### Hooks Utilizados

```typescript
const { id } = Route.useParams()
const { data: project } = useGetProjectById({ id })
const { data: projects } = useGetProjects()  // para "More Adaptations"
```

### Referência Figma

[Video Viewer](https://www.figma.com/design/MupzTsbp3eceYTly9twFbA/Untitled?node-id=1-1004)

## Entregável

Tela Video Viewer completa com player de vídeo, metadata, ações de download/export, scene breakdown e carousel de outros vídeos.
