# TASK-11: Pipeline Stage 1 — Extração PDF para Imagens

| Campo        | Valor                  |
| ------------ | ---------------------- |
| **Prioridade** | 11 (Alta)            |
| **Tipo**       | Backend / AI Pipeline |
| **Estimativa** | 4h                   |
| **Depende de** | TASK-5               |

---

## Descrição

Implementar o **Stage 1** do pipeline de IA conforme seção 3.2 do PRD: conversão de cada página do PDF (dentro do range especificado pelo usuário) em imagens de alta resolução.

## Critérios de Aceite

### Interface (application layer)

- [ ] Interface `PdfExtractorGateway` definida em `application/contracts/pdf-extractor-gateway.ts`:
  ```typescript
  export interface PdfExtractorGateway {
    extractPages(pdfPath: string, startPage: number, endPage: number): Promise<ExtractedPage[]>
  }
  ```

### Implementação Concreta (infra layer)

- [ ] `Pdf2PicExtractorGateway` em `infra/gateways/pdf/pdf2pic-extractor-gateway.ts`:
  - Implementa `PdfExtractorGateway`
  - Decorado com `@Injectable()`
  - Usa `pdf2pic` para conversão a 300 DPI
  - Usa `sharp` para otimização das imagens

### Serviço de Domínio (application layer)

- [ ] `PdfExtractionService` em `application/services/pdf-extraction-service.ts`:
  - Decorado com `@Injectable()`
  - Recebe `PdfExtractorGateway` e `StorageGateway` via constructor injection
  - Orquestra a extração e o salvamento das imagens no storage
  - Valida range de páginas (startPage/endPage dentro do total de páginas)
  - Loga progresso (página X de Y)

### Comportamento

- [ ] Cada página convertida para imagem PNG com resolução >= 300 DPI
- [ ] Output por página: `{ pageNumber: number, imagePath: string, width: number, height: number }`
- [ ] Imagens salvas via `StorageGateway` no diretório `images/` do projeto
- [ ] Tempo de processamento <= 2 segundos por página
- [ ] Suporta PDFs com orientações e tamanhos variados
- [ ] Tratamento de erro para PDFs corrompidos ou protegidos por senha

### Registro no DI

- [ ] `Pdf2PicExtractorGateway` e `PdfExtractionService` registrados no `kernel/di/registry.ts`

## Detalhes Técnicos

### Output Schema

```typescript
interface ExtractedPage {
  pageNumber: number
  imagePath: string   // path relativo no storage
  width: number       // pixels
  height: number      // pixels
}
```

### Ferramentas Candidatas (Seção 3.2)

- `pdf2pic` — converte páginas de PDF em imagens
- `sharp` — processamento de imagem (resize, otimização)
- `pdf-lib` — leitura de metadata do PDF
- Ghostscript — como alternativa robusta para PDFs complexos

### Estrutura de Arquivos

```
apps/backend/src/
├── application/
│   ├── contracts/
│   │   └── pdf-extractor-gateway.ts
│   └── services/
│       └── pdf-extraction-service.ts
└── infra/
    └── gateways/
        └── pdf/
            └── pdf2pic-extractor-gateway.ts
```

### Fluxo

```
PdfExtractionService.run(projectId, pdfPath, startPage, endPage)
  → PdfExtractorGateway.extractPages() [infra: pdf2pic @ 300 DPI + sharp]
  → StorageGateway.saveImage()         [salva PNGs no storage]
  → returns ExtractedPage[]
```

## Entregável

Serviço de domínio `PdfExtractionService` e gateway de infra `Pdf2PicExtractorGateway` que juntos convertem páginas de PDF em imagens PNG de alta resolução e as salvam no storage do projeto.
