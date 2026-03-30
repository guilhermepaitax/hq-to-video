# TASK-28: Integração TikTok Publish (API + Frontend)

| Campo        | Valor                  |
| ------------ | ---------------------- |
| **Prioridade** | 28 (Baixa — Phase 2) |
| **Tipo**       | Full-stack / Integração |
| **Estimativa** | 8h                   |
| **Depende de** | TASK-27              |

---

## Descrição

Implementar a integração de **publicação no TikTok** usando a TikTok Content Posting API com OAuth 2.0, conforme endpoint `POST /api/projects/:id/publish` (seção 4.8) e User Story US-05 do PRD. Esta task é parte da Phase 2 (v1.1).

## Critérios de Aceite

### Backend — OAuth Flow

- [ ] Endpoint `GET /api/auth/tiktok` que inicia o fluxo OAuth 2.0 do TikTok
- [ ] Endpoint `GET /api/auth/tiktok/callback` que recebe o callback e armazena o access token
- [ ] Tokens armazenados de forma segura (environment variable ou encrypted storage)
- [ ] Refresh token handling para renovação automática

### Backend — Publishing

- [ ] Use case `PublishToTikTok` implementado em `src/core/use-cases/publish-to-tiktok.ts`
- [ ] Rota `POST /api/projects/:id/publish` registrada no Fastify adapter
- [ ] Validações:
  - Projeto existe e tem status COMPLETED
  - Vídeo disponível no storage
  - Token TikTok válido (401 se não autenticado)
- [ ] Upload do vídeo via TikTok Content Posting API
- [ ] Metadata do vídeo enviada: título, descrição, hashtags
- [ ] Retorna `200 OK` com link do vídeo no TikTok (quando disponível)

### Frontend

- [ ] Botão **"Export to TikTok"** na tela Video Viewer
- [ ] Se não autenticado no TikTok:
  - Exibe modal/flow para conectar conta TikTok (OAuth)
  - Redireciona para autorização TikTok
  - Após callback, retorna ao Video Viewer
- [ ] Se autenticado:
  - Loading state durante upload
  - Sucesso: mensagem com link para o vídeo publicado
  - Erro: mensagem com opção de retry
- [ ] Indicador de que a conta TikTok está conectada (na sidebar ou settings)

## Detalhes Técnicos

### TikTok API

- **Auth endpoint**: `https://www.tiktok.com/v2/auth/authorize/`
- **Token endpoint**: `https://open.tiktokapis.com/v2/oauth/token/`
- **Content Posting**: `https://open.tiktokapis.com/v2/post/publish/video/init/`

### Scopes Necessários

- `video.upload`
- `video.publish`

### Fluxo

```
User clicks "Export to TikTok"
  → Check if TikTok token exists
    → No: Redirect to TikTok OAuth
      → User authorizes
      → Callback saves token
      → Redirect back to Video Viewer
    → Yes: POST /api/projects/:id/publish
      → Upload video to TikTok
      → Return TikTok video URL
```

### Dependências

- TikTok Developer Account
- App registrado no TikTok for Developers

## Entregável

Fluxo completo de publicação no TikTok: autenticação OAuth, upload do vídeo via API, e botão no frontend com feedback visual de todo o processo.
