# TASK-5: Serviço de File Storage (Cloudflare R2)

| Campo        | Valor                        |
| ------------ | ---------------------------- |
| **Prioridade** | 5 (Alta)                   |
| **Tipo**       | Backend / Infraestrutura   |
| **Estimativa** | 4h                         |
| **Depende de** | TASK-3                     |

---

## Descrição

Implementar o serviço de **file storage** com integração ao **Cloudflare R2**, seguindo a Clean Architecture definida na skill `api-architecture`. A interface (contract) vive em `application/contracts/`, e a implementação concreta em `infra/gateways/storage/`. O R2 expõe uma API S3-compatible, portanto usamos o `@aws-sdk/client-s3` apontando para o endpoint do R2. A abstração via `StorageGateway` permite troca futura para outro provider S3-compatible (AWS S3, MinIO, etc.) sem alterar o código de aplicação.

**Por que R2?** Zero egress fees — ideal para servir PDFs, imagens e vídeos gerados sem custo de bandwidth.

## Critérios de Aceite

### Variáveis de Ambiente

- [ ] Novas variáveis adicionadas ao schema Zod em `shared/config/env.ts`:
  ```ts
  r2AccountId: z.string().min(1),
  r2AccessKeyId: z.string().min(1),
  r2SecretAccessKey: z.string().min(1),
  r2Bucket: z.string().min(1),
  r2Endpoint: z.string().url().optional(),  // override para dev local com MinIO
  ```
- [ ] `.env.example` atualizado com as novas variáveis:
  ```env
  # Cloudflare R2 Storage
  R2_ACCOUNT_ID=
  R2_ACCESS_KEY_ID=
  R2_SECRET_ACCESS_KEY=
  R2_BUCKET=heroic-vision-storage
  R2_ENDPOINT=                # opcional: override para MinIO local (http://localhost:9000)
  ```

### Dependências

- [ ] Instalar pacotes do AWS SDK (R2 é S3-compatible):
  ```bash
  pnpm --filter backend add @aws-sdk/client-s3 @aws-sdk/lib-storage @aws-sdk/s3-request-presigner
  ```

### Interface (application layer)

- [ ] Interface `StorageGateway` definida em `application/contracts/storage-gateway.ts`:
  ```ts
  export interface StorageGateway {
    savePdf(projectId: string, file: Buffer): Promise<string>
    saveImage(projectId: string, filename: string, data: Buffer): Promise<string>
    saveAudio(projectId: string, filename: string, data: Buffer): Promise<string>
    saveVideo(projectId: string, filename: string, data: Buffer): Promise<string>
    getFileUrl(key: string): Promise<string>
    getFileStream(key: string): Promise<NodeJS.ReadableStream>
    deleteProjectFiles(projectId: string): Promise<void>
  }

  export namespace StorageGateway {
    export type Config = {
      accountId: string
      bucket: string
      accessKeyId: string
      secretAccessKey: string
      endpoint?: string
    }
  }
  ```

### Implementação Concreta (infra layer)

- [ ] `R2StorageGateway` implementado em `infra/gateways/storage/r2-storage-gateway.ts`:
  - Implementa `StorageGateway`
  - Decorado com `@Injectable()`
  - Recebe configuração via `StorageGateway.Config` (injetado a partir de `env`)
  - Cria instância `S3Client` do `@aws-sdk/client-s3` no construtor com:
    ```ts
    new S3Client({
      region: 'auto',
      endpoint: config.endpoint ?? `https://${config.accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
    })
    ```
  - Suporta `endpoint` customizado para dev local com MinIO
- [ ] Métodos implementados:
  - `savePdf` — valida MIME type (rejeitar não-PDF), valida tamanho <= 150MB, faz upload para `{projectId}/pdfs/original.pdf` no bucket R2. Usa `Upload` do `@aws-sdk/lib-storage` para multipart upload.
  - `saveImage` — faz upload para `{projectId}/images/{filename}` no bucket R2
  - `saveAudio` — faz upload para `{projectId}/audio/{filename}` no bucket R2
  - `saveVideo` — faz upload para `{projectId}/video/{filename}` no bucket R2. Usa `Upload` do `@aws-sdk/lib-storage` para multipart upload (vídeos podem ser grandes).
  - `getFileUrl` — retorna presigned URL com expiração configurável (default: 1h) usando `GetObjectCommand` + `getSignedUrl` do `@aws-sdk/s3-request-presigner`
  - `getFileStream` — retorna `ReadableStream` do objeto R2 via `GetObjectCommand`
  - `deleteProjectFiles` — lista e deleta todos os objetos com prefix `{projectId}/` usando `ListObjectsV2Command` + `DeleteObjectsCommand`
- [ ] Cada método de upload retorna a **key** do objeto no R2 (ex: `{projectId}/pdfs/original.pdf`), que será armazenada no banco de dados

### Presigned URL

- [ ] `getFileUrl` gera uma presigned URL para download seguro sem expor o bucket publicamente
- [ ] Expiração padrão de 3600 segundos (1h), configurável via parâmetro opcional

### Validações

- [ ] MIME type validation para PDFs: verifica cabeçalho `%PDF-` no buffer (magic bytes), não apenas a extensão
- [ ] Tamanho máximo de 150 MB por arquivo (erro descritivo ao exceder)
- [ ] Erro `NotFoundError` quando objeto não existe no `getFileStream` / `getFileUrl` (capturar `NoSuchKey`)
- [ ] Content-Type correto definido no upload (`application/pdf`, `image/png`, `audio/mpeg`, `video/mp4`, etc.)

### Registro no DI

- [ ] `R2StorageGateway` registrado no `kernel/di/registry.ts` durante o bootstrap
- [ ] `StorageGateway.Config` construído a partir das variáveis de ambiente (`env.r2AccountId`, `env.r2Bucket`, etc.)

## Detalhes Técnicos

### Estrutura de Diretórios (infra)

```
apps/backend/src/
├── application/
│   └── contracts/
│       └── storage-gateway.ts           # Interface StorageGateway
├── infra/
│   └── gateways/
│       └── storage/
│           └── r2-storage-gateway.ts    # Implementação com @aws-sdk/client-s3 → R2
└── shared/
    └── config/
        └── env.ts                       # + R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET, R2_ENDPOINT
```

### Estrutura de Objetos no R2 (key pattern)

```
{bucket}/
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

- `@aws-sdk/client-s3` — cliente S3-compatible (PutObject, GetObject, DeleteObjects, ListObjectsV2)
- `@aws-sdk/lib-storage` — multipart upload gerenciado (Upload class)
- `@aws-sdk/s3-request-presigner` — geração de presigned URLs

### Como obter credenciais do R2

1. Acesse o [Cloudflare Dashboard](https://dash.cloudflare.com/) → R2 Object Storage
2. Crie um bucket (ex: `heroic-vision-storage`)
3. Vá em **Manage R2 API Tokens** → **Create API Token**
4. Copie o `Access Key ID` e `Secret Access Key` gerados
5. O `Account ID` está visível na URL do dashboard ou na página inicial do R2

### Desenvolvimento Local

Para testar localmente sem Cloudflare, usar **MinIO** (S3-compatible):

```yaml
# docker-compose.yml (adicionar serviço)
minio:
  image: minio/minio
  ports:
    - "9000:9000"
    - "9001:9001"
  environment:
    MINIO_ROOT_USER: minioadmin
    MINIO_ROOT_PASSWORD: minioadmin
  command: server /data --console-address ":9001"
  volumes:
    - minio_data:/data
```

Variáveis de ambiente para dev local:
```env
R2_ACCOUNT_ID=local
R2_ACCESS_KEY_ID=minioadmin
R2_SECRET_ACCESS_KEY=minioadmin
R2_BUCKET=heroic-vision-storage
R2_ENDPOINT=http://localhost:9000
```

Criar bucket no MinIO (via console em `http://localhost:9001` ou via CLI):
```bash
aws --endpoint-url=http://localhost:9000 s3 mb s3://heroic-vision-storage
```

## Entregável

Gateway de storage funcional em `infra/gateways/storage/`, com interface em `application/contracts/`, integrado ao Cloudflare R2 via `@aws-sdk/client-s3` (S3-compatible API). Capaz de fazer upload, gerar presigned URLs para download, e deletar arquivos organizados por projeto, com validação de PDF, limite de tamanho, e suporte a MinIO para desenvolvimento local.
