# TASK-21: Frontend — New Video Project Screen

| Campo        | Valor                  |
| ------------ | ---------------------- |
| **Prioridade** | 21 (Alta)            |
| **Tipo**       | Frontend / UI        |
| **Estimativa** | 6h                   |
| **Depende de** | TASK-18, TASK-19     |

---

## Descrição

Implementar a tela de **New Video Project** conforme Screen 2 da seção 2.3 e User Stories US-01, US-02 e US-03 do PRD. Esta é a tela central onde o usuário faz upload do PDF e configura a geração do vídeo.

## Critérios de Aceite

### Upload de PDF (US-01)

- [ ] Zona de drag-and-drop para upload de PDF
- [ ] Botão "Browse Files" alternativo
- [ ] Label indicando máximo 150 MB
- [ ] Validação client-side do tipo de arquivo (apenas PDF)
- [ ] Barra de progresso durante upload
- [ ] Preview do PDF após upload (thumbnail da primeira página ou ícone)

### Configuração (US-02)

- [ ] **Start Page** — input numérico (min: 1)
- [ ] **End Page** — input numérico
- [ ] **Creative Brief** — textarea para descrição de pacing, mood, destaques
- [ ] Validação: startPage < endPage, ambos >= 1

### Geração (US-03)

- [ ] Botão "Generate Video" (coral/red CTA)
- [ ] Estimated build time exibido ao lado do botão
- [ ] Ao clicar, chama `useCreateProjectMutation` com FormData
- [ ] Após sucesso, redireciona para `/queue`
- [ ] Loading state no botão durante envio
- [ ] Tratamento de erro com mensagem visível ao usuário

### Layout

- [ ] **Page Header**: "New Video Project" com subtítulo
- [ ] **PDF Upload Zone** à esquerda
- [ ] **Configuration Panel** à direita
- [ ] **Project Preview** mostrando thumbnail do PDF
- [ ] **Feature Strip** no footer: "Lossless Conversion", "Smart Pan & Zoom", "Creative IP Protection"

## Detalhes Técnicos

### Hook Utilizado

```typescript
const createProject = useCreateProjectMutation()

const handleSubmit = () => {
  const formData = new FormData()
  formData.append('file', pdfFile)
  formData.append('title', title)
  formData.append('startPage', startPage.toString())
  formData.append('endPage', endPage.toString())
  if (creativeBrief) formData.append('creativeBrief', creativeBrief)

  createProject.mutate({ data: formData })
}
```

### Referência Figma

[New Video Project](https://www.figma.com/design/MupzTsbp3eceYTly9twFbA/Untitled?node-id=1-787)

## Entregável

Tela completa de criação de projeto com upload de PDF, formulário de configuração e botão de geração, tudo integrado com a API via mutation hook.
