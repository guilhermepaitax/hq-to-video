# TASK-5: Serviço de File Storage (Local Filesystem)

| Campo        | Valor                        |
| ------------ | ---------------------------- |
| **Prioridade** | 5 (Alta)                   |
| **Tipo**       | Backend / Infraestrutura   |
| **Estimativa** | 3h                         |
| **Depende de** | TASK-3                     |

---

## Descrição

Implementar o serviço de **file storage** para armazenamento local de arquivos, seguindo a Clean Architecture definida na skill `api-architecture`. A interface (contract) vive em `application/contracts/`, e a implementação concreta em `infra/gateways/storage/`. O MVP usa filesystem local, mas a interface é suficientemente genérica para troca futura por S3-compatible storage.

## Critérios de Aceite

### Interface (application layer)

- [ ] Interface `StorageGateway` definida em `application/contracts/storage-gateway.ts`:
  ```ts
  export interface StorageGateway {
    savePdf(projectId: string, file: Buffer): Promise<string>
    saveImage(projectId: string, filename: string, data: Buffer): Promise<string>
    saveAudio(projectId: string, filename: string, data: Buffer): Promise<string>
    saveVideo(projectId: string, filename: string, data: Buffer): Promise<string>
    getFilePath(relativePath: string): string
    getFileStream(relativePath: string): NodeJS.ReadableStream
    deleteProjectFiles(projectId: string): Promise<void>
  }
  ```

### Implementação Concreta (infra layer)

- [ ] `LocalStorageGateway` implementado em `infra/gateways/storage/local-storage-gateway.ts`:
  - Implementa `StorageGateway`
  - Decorado com `@Injectable()`
  - Diretório base configurável via variável de ambiente `STORAGE_PATH` (default: `./storage`)
- [ ] Métodos implementados:
  - `savePdf` — valida MIME type (rejeitar não-PDF), valida tamanho <= 150MB, salva em `{STORAGE_PATH}/{projectId}/pdfs/original.pdf`
  - `saveImage` — salva em `{STORAGE_PATH}/{projectId}/images/{filename}`
  - `saveAudio` — salva em `{STORAGE_PATH}/{projectId}/audio/{filename}`
  - `saveVideo` — salva em `{STORAGE_PATH}/{projectId}/video/{filename}`
  - `getFilePath` — retorna path absoluto do arquivo
  - `getFileStream` — retorna `ReadableStream` do arquivo (para streaming de downloads)
  - `deleteProjectFiles` — remove recursivamente `{STORAGE_PATH}/{projectId}/`

### Validações

- [ ] MIME type validation para PDFs: verifica cabeçalho `%PDF-` no buffer (magic bytes), não apenas a extensão
- [ ] Tamanho máximo de 150 MB por arquivo (erro descritivo ao exceder)
- [ ] Erro `NotFoundError` quando arquivo não existe no `getFileStream` / `getFilePath`

### Registro no DI

- [ ] `LocalStorageGateway` registrado no `kernel/di/registry.ts` durante o bootstrap
- [ ] Diretório base de storage criado automaticamente no bootstrap se não existir

## Detalhes Técnicos

### Estrutura de Diretórios (infra)

```
apps/backend/src/
├── application/
│   └── contracts/
│       └── storage-gateway.ts      # Interface StorageGateway
└── infra/
    └── gateways/
        └── storage/
            └── local-storage-gateway.ts  # Implementação com fs/promises
```

### Estrutura de Armazenamento em Disco

```
storage/
└── {projectId}/
    ├── pdfs/
    │   └── original.pdf
    ├── images/
    │   ├── page-1.png
    │   ├── page-2.png
    │   └── panel-1-1.png
    ├── audio/
    │   ├── scene-1.mp3
    │   └── master.mp3
    └── video/
        └── final.mp4
```

### Dependências

- `node:fs/promises` (nativo)
- `node:stream` (nativo)

## Entregável

Gateway de storage funcional em `infra/gateways/storage/`, com interface em `application/contracts/`, capaz de salvar, ler e deletar arquivos organizados por projeto, com validação de PDF e limite de tamanho.
