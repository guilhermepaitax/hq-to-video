# TASK-27: Download de Vídeo (API + Frontend)

| Campo        | Valor                  |
| ------------ | ---------------------- |
| **Prioridade** | 27 (Média)           |
| **Tipo**       | Full-stack           |
| **Estimativa** | 3h                   |
| **Depende de** | TASK-5, TASK-7, TASK-23 |

---

## Descrição

Implementar a funcionalidade de **download do vídeo gerado** conforme endpoint `GET /api/projects/:id/video` (seção 4.8) e User Story US-05 do PRD.

## Critérios de Aceite

### Backend

- [ ] `GetProjectVideoUsecase` em `application/usecases/projects/get-project-video-usecase.ts`:
  - Decorado com `@Injectable()`
  - Recebe `ProjectRepository` e `StorageGateway` via constructor injection
  - Lança `NotFoundError` se projeto não existir ou vídeo não disponível
- [ ] `GetProjectVideoController` em `application/controllers/projects/get-project-video-controller.ts`:
  - Estende `Controller<'public', GetProjectVideoController.Response>`
  - Retorna stream — o Fastify adapter lida com o pipe do `ReadableStream` para o `reply`
  - Entry point `main/functions/projects/get-project-video.ts` com headers de streaming
- [ ] Headers corretos:
  - `Content-Type: video/mp4`
  - `Content-Disposition: attachment; filename="project-title.mp4"`
  - `Content-Length` com tamanho do arquivo
- [ ] Suporte a range requests para seeking no player de vídeo
- [ ] Use case e controller registrados no `kernel/di/registry.ts`

### Frontend

- [ ] Botão **"Download MP4"** na tela Video Viewer (TASK-23)
  - Aciona download do vídeo via link direto para `/api/projects/:id/video`
  - Abre download nativo do browser
- [ ] Botão **"Download"** nos items COMPLETED da Processing Queue (TASK-22)
- [ ] Indicador visual durante download (se aplicável)

## Detalhes Técnicos

### Use Case

```typescript
@Injectable()
export class GetProjectVideoUsecase {
  constructor(
    private readonly projectRepository: ProjectRepository,
    private readonly storageGateway: StorageGateway,
  ) {}

  async execute(input: GetProjectVideoUsecase.Input): Promise<GetProjectVideoUsecase.Output> {
    const project = await this.projectRepository.findById(input.projectId)
    if (!project?.videoUrl) throw new NotFoundError('Video not available')

    const stream = this.storageGateway.getFileStream(project.videoUrl)
    const filename = `${project.title.replace(/\s+/g, '-')}.mp4`

    return { stream, filename }
  }
}
```

### Frontend Download

```typescript
const handleDownload = () => {
  const link = document.createElement('a')
  link.href = `${API_URL}/api/projects/${project.id}/video`
  link.download = `${project.title}.mp4`
  link.click()
}
```

## Entregável

Funcionalidade completa de download: endpoint backend que faz stream do vídeo + botões no frontend que acionam o download nativo do browser.
