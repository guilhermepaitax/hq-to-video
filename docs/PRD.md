# Product Requirements Document (PRD)

## Heroic Vision — AI-Powered Comic-to-Video Generator

| Field       | Value         |
| ----------- | ------------- |
| **Product** | Heroic Vision |
| **Version** | 1.0 (MVP)     |
| **Created** | 2026-03-29    |
| **Status**  | Draft         |

---

## 1. Executive Summary

### Problem Statement

Content creators who want to produce short-form video content (TikTok / Reels) from superhero comic books face a labor-intensive, multi-hour manual process: scanning panels, writing scripts, recording narration, and editing video. There is no end-to-end tool that automates this pipeline from a raw PDF to a publish-ready vertical video.

### Proposed Solution

**Heroic Vision** is a web application that accepts a superhero comic book PDF, processes it through a multi-stage AI pipeline (vision analysis, script generation, text-to-speech narration), and renders a fully edited short-form video using Remotion — ready for download or direct publishing to TikTok.

### Success Criteria

| KPI                          | Target (MVP)                                        |
| ---------------------------- | --------------------------------------------------- |
| PDF-to-video turnaround      | <= 5 minutes for a 10-page comic segment            |
| Panel detection accuracy     | >= 90% of panels correctly identified and extracted |
| Video render success rate    | >= 94% of jobs complete without error               |
| User satisfaction (NPS)      | >= 40 within first 30 days of launch                |
| Avg. processing queue length | <= 10 concurrent jobs per worker node               |

---

## 2. User Experience & Functionality

### 2.1 User Personas

#### Primary Persona — Comic Content Creator

- **Demographics**: 18-35 years old, active on TikTok/Instagram Reels.
- **Behavior**: Regularly posts short-form video content about comics, superheroes, and pop culture.
- **Pain Point**: Spends 2-4 hours manually creating a single comic recap video.
- **Goal**: Reduce production time to under 5 minutes while maintaining cinematic quality.

#### Secondary Persona — Comic Publisher / Marketing Team

- **Demographics**: Marketing professionals at comic book publishers.
- **Behavior**: Needs to produce promotional clips for upcoming releases at scale.
- **Pain Point**: High cost of video production teams for social media content.
- **Goal**: Generate multiple video variants from a single issue to A/B test engagement.

### 2.2 User Stories

#### US-01: Upload Comic PDF

> As a content creator, I want to upload a superhero comic PDF so that the system can process it into a video.

**Acceptance Criteria:**

- User can drag-and-drop or browse to select a PDF file.
- Maximum file size is 150 MB.
- System validates the file is a valid PDF before proceeding.
- A preview of the uploaded PDF is displayed in the "Project Preview" section.
- Upload progress is shown to the user.

#### US-02: Configure Video Generation

> As a content creator, I want to specify the page range and creative direction so that the generated video matches my vision.

**Acceptance Criteria:**

- User can set a start page and end page to define which panels to process.
- User can provide a creative brief describing pacing, mood, and specific scenes to highlight.
- System displays an estimated build time before generation begins.

#### US-03: Generate Video

> As a content creator, I want to click "Generate Video" and have the system automatically produce a narrated short-form video from my comic PDF.

**Acceptance Criteria:**

- Clicking "Generate Video" creates a processing job and redirects to the Queue screen.
- The job appears in the queue with a "Processing" status.
- Progress is reported in real-time with a percentage and current step label (e.g., "Rendering Frames 65%", "Parsing Metadata 12%").
- Upon completion, status changes to "Completed".
- If the job fails, status changes to "Cancelled" with an error reason displayed and a "Retry" button available.

#### US-04: View Dashboard Metrics

> As a content creator, I want to see an overview of my video generation activity so that I can track my output.

**Acceptance Criteria:**

- Dashboard displays: Total Videos Generated (count), Active Jobs (count), Conversion Rate (percentage).
- A "Recent Projects" section shows the last 4 projects with thumbnail, title, timestamp, status badge, and an action button ("Open" or "Retry").
- A hero banner with "Create New Project" button is displayed at the top.

#### US-05: View and Download Generated Video

> As a content creator, I want to preview the generated video and download it so that I can publish it on social media.

**Acceptance Criteria:**

- Video player renders the generated video with playback controls (play/pause, seek, skip forward/backward).
- Video metadata is displayed: Format Size (e.g., "Vertical 9:16"), Duration.
- "Download MP4" button downloads the video file to the user's device.
- "Export to TikTok" button initiates a publish flow to TikTok.
- A "Scene Breakdown" section lists each scene with a thumbnail and timestamp range.
- An "Edit Instructions" link allows the user to refine the creative brief and re-generate.

#### US-06: Browse Processing Queue

> As a content creator, I want to see all my video generation jobs and their statuses so that I can manage my projects.

**Acceptance Criteria:**

- Queue displays all projects in a vertical list.
- Each item shows: thumbnail, title, video format, duration, status (Processing, Completed, Cancelled, Waiting).
- Processing items show a progress bar with step label and percentage.
- Completed items show "Download" and "Publish" action buttons.
- Cancelled items show a "Retry" button and the failure reason.
- Waiting items show their queue position.
- Header displays Active Tasks and Completed Today counters.
- Clicking a completed item navigates to the Video Viewer screen.

### 2.3 Screen Specifications

#### Screen 1: Dashboard

| Element            | Description                                                                                                |
| ------------------ | ---------------------------------------------------------------------------------------------------------- |
| Sidebar Navigation | Logo ("Heroic Vision"), user profile, links: Projects (active), Queue, Settings, Support, Sign Out         |
| Hero Banner        | Title "Transform Panels Into Motion", subtitle, "Create New Project" CTA button (coral/red)                |
| Metrics Row        | Three cards: Total Videos Generated (+12% badge), Active Jobs (Active badge), Conversion Rate (High badge) |
| Recent Projects    | Grid of 4 project cards with thumbnail, status badge, title, timestamp, "Open"/"Retry" action              |
| FAB                | Floating action button (+) in bottom-right corner for quick project creation                               |

#### Screen 2: New Video Project

| Element                | Description                                                                              |
| ---------------------- | ---------------------------------------------------------------------------------------- |
| Sidebar Navigation     | Same as Dashboard                                                                        |
| Page Header            | Title "New Video Project", subtitle describing the workflow                              |
| PDF Upload Zone        | Drag-and-drop area with icon, "Browse Files" button, max 150MB label                    |
| Configuration Panel    | Start Page / End Page number inputs, Creative Brief textarea                             |
| Project Preview        | Thumbnail preview of the uploaded PDF                                                    |
| Generate Button        | "Generate Video" CTA (coral/red) with estimated build time display                      |
| Feature Strip (footer) | Three feature badges: Lossless Conversion, Smart Pan & Zoom, Creative IP Protection      |

#### Screen 3: Video Viewer

| Element            | Description                                                                    |
| ------------------ | ------------------------------------------------------------------------------ |
| Sidebar Navigation | Same as Dashboard                                                              |
| Video Player       | Full video player with narration text overlay, seek bar, playback controls     |
| Video Title        | Project name with episode number and "AI-Generated Comic Adaptation" label     |
| Metadata Grid      | 2x2 grid: Format Size, Duration                                         |
| Action Buttons     | "Download MP4" (coral/red), "Export to TikTok" (outlined)                      |
| Edit Instructions  | Link to modify creative brief and re-generate                                  |
| Scene Breakdown    | List of scenes with thumbnail and timestamp range                              |
| More Adaptations   | Horizontal carousel of other generated videos with title, duration, resolution |

#### Screen 4: Processing Queue

| Element            | Description                                                                                                                         |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| Top Navigation     | Logo, links: Dashboard, Queue (active), Assets                                                                                      |
| Sidebar Navigation | Same as Dashboard                                                                                                                   |
| Page Header        | "Operational Feed" label, "Processing Queue" title, Active Tasks counter, Completed Today counter                                   |
| Queue List         | Vertical list of job items, each with: thumbnail, title, format, duration, status badge, conditional progress bar or action buttons |
| Create New Video   | CTA button at the bottom of the sidebar                                                                                             |

### 2.4 Non-Goals (MVP)

- **User authentication and multi-tenancy**: MVP will run as a single-user local application.
- **Real-time collaborative editing**: No multi-user editing of projects.
- **Custom video template editor**: Users cannot modify the Remotion template visually.
- **Mobile-native application**: Web only (responsive not required for MVP).
- **Multi-language narration**: MVP supports PT-BR narration only.
- **Direct Instagram/YouTube publishing**: MVP supports TikTok export only.
- **Billing and subscription management**: No payment processing in MVP.

---

## 3. AI System Requirements

### 3.1 Pipeline Overview

The AI processing pipeline consists of four sequential stages executed by asynchronous workers:

```
PDF Upload
    |
    v
[Stage 1] PDF-to-Image Extraction
    |
    v
[Stage 2] Vision AI — Panel Analysis
    |
    v
[Stage 3] LLM — Script Generation
    |
    v
[Stage 4] TTS — Narration Audio Generation
    |
    v
[Stage 5] Remotion — Video Rendering
    |
    v
Final Video (MP4)
```

### 3.2 Stage 1: PDF-to-Image Extraction

**Purpose**: Convert each page of the PDF (within the user-specified page range) into high-resolution images.

| Requirement     | Specification                                |
| --------------- | -------------------------------------------- |
| Input           | PDF file, start page number, end page number |
| Output          | Array of PNG/JPEG images, one per page       |
| Resolution      | >= 300 DPI for quality panel extraction      |
| Processing time | <= 2 seconds per page                        |
| Tool candidates | `pdf-lib`, `pdf2pic`, `sharp`, Ghostscript   |

### 3.3 Stage 2: Vision AI — Panel Analysis

**Purpose**: Analyze each page image to detect individual panels and extract structured metadata from each.

| Requirement         | Specification                                                                                                               |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Input               | Page image (PNG/JPEG)                                                                                                       |
| Output per panel    | Panel image crop, scene description, emotion classification, dialogue transcription (character + text), panel reading order |
| Detection accuracy  | >= 90% of panels correctly identified per page                                                                              |
| Dialogue extraction | >= 85% accuracy on speech bubble text                                                                                       |
| Model candidates    | OpenAI GPT-4o Vision, Google Gemini Pro Vision, Anthropic Claude Vision                                                     |
| Fallback strategy   | If primary model fails, retry with secondary model                                                                          |

**Output Schema (per panel):**

```json
{
  "panelIndex": 1,
  "description": "Batman stands on a rooftop overlooking Gotham. Rain pours down. The Bat-Signal glows in the sky.",
  "emotion": "tension",
  "dialogues": [
    {
      "character": "Batman",
      "text": "The city screams for justice..."
    },
    {
      "character": "Commissioner Gordon",
      "text": "We need you tonight."
    }
  ],
  "boundingBox": { "x": 0, "y": 0, "width": 500, "height": 400 }
}
```

### 3.4 Stage 3: LLM — Script Generation

**Purpose**: Transform the structured panel analysis into a narrated video script optimized for short-form viral content.

| Requirement         | Specification                                            |
| ------------------- | -------------------------------------------------------- |
| Input               | Array of panel analyses, creative brief                  |
| Output              | Timestamped narration script with image references       |
| Script duration     | 15-60 seconds (optimized for TikTok/Reels)               |
| Narrative structure | Hook (0-3s), Rising action, Climax, Cliffhanger/CTA      |
| Model candidates    | OpenAI GPT-4o, Anthropic Claude 3.5 Sonnet               |

**Output Schema:**

```json
{
  "title": "Neon Knight — Episode 04",
  "totalDuration": 24,
  "scenes": [
    {
      "sceneIndex": 1,
      "startTime": 0,
      "endTime": 8,
      "narration": "The city screams for justice... and I am the answer.",
      "panelReferences": [1, 2],
      "mood": "dark-heroic",
      "cameraEffect": "slow-zoom"
    },
    {
      "sceneIndex": 2,
      "startTime": 8,
      "endTime": 18,
      "narration": "But tonight, the shadows have teeth.",
      "panelReferences": [3, 4, 5],
      "mood": "suspense",
      "cameraEffect": "ken-burns-pan"
    }
  ]
}
```

### 3.5 Stage 4: TTS — Narration Audio Generation

**Purpose**: Convert the narration script into emotionally expressive audio.

| Requirement     | Specification                                            |
| --------------- | -------------------------------------------------------- |
| Input           | Narration text per scene, mood                           |
| Output          | Audio files (MP3/WAV) per scene + combined master audio  |
| Voice quality   | Human-like with emotional intonation matching scene mood |
| Latency         | <= 3 seconds per scene                                   |
| Audio format    | 44.1 kHz, 16-bit, mono                                   |
| Tool candidates | ElevenLabs API, OpenAI TTS, Google Cloud TTS             |

### 3.6 Stage 5: Remotion — Video Rendering

**Purpose**: Combine panel images, narration audio, and scene metadata into a final MP4 video.

| Requirement       | Specification                                             |
| ----------------- | --------------------------------------------------------- |
| Input             | Scene data structure (images, audio, timestamps, effects) |
| Output            | MP4 video file                                            |
| Resolution        | 1080x1920 (9:16 vertical) at minimum; 4K option           |
| Frame rate        | 30 FPS                                                    |
| Animation effects | Ken Burns (pan & zoom), fade transitions, text overlays   |
| Render time       | <= 2 minutes for a 60-second video                        |
| Tools             | `@remotion/bundler`, `@remotion/renderer`                 |

### 3.7 Evaluation Strategy

| What to Measure          | Method                                                     | Target                              |
| ------------------------ | ---------------------------------------------------------- | ----------------------------------- |
| Panel detection accuracy | Manual review of 50 pages across 5 different comic styles  | >= 90%                              |
| Dialogue extraction      | Compare extracted text against ground truth for 100 panels | >= 85%                              |
| Script quality           | Human rating (1-5) on engagement, coherence, hook strength | >= 3.8 avg                          |
| Audio naturalness        | MOS (Mean Opinion Score) survey with 20 evaluators         | >= 3.5                              |
| End-to-end success rate  | % of jobs that produce a playable video without errors     | >= 94%                              |
| Video engagement proxy   | A/B test against manually-produced videos on TikTok        | >= 80% of manual baseline retention |

---

## 4. Technical Specifications

### 4.1 Architecture Overview

```
┌──────────────────────────────────────────────────────────────────┐
│                           Frontend                                │
│                      (React / Next.js)                            │
│                                                                   │
│  Dashboard ─── New Project ─── Queue ─── Video Viewer             │
│                        │                                          │
│               ┌────────┴─────────┐                                │
│               │   api-client     │  (auto-generated by Kubb)      │
│               │  React Query     │  Types, hooks, client          │
│               │  hooks + types   │  from OpenAPI spec             │
│               └────────┬─────────┘                                │
└────────────────────────┼─────────────────────────────────────────┘
                         │ REST API / WebSocket (status updates)
                         v
┌──────────────────────────────────────────────────────────────────┐
│                        Backend API                                │
│             (Framework-Agnostic Core + Adapter)                   │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                    Application Core                          │ │
│  │  Use Cases ─── Domain Logic ─── Repository Interfaces       │ │
│  └──────────────────────┬──────────────────────────────────────┘ │
│                         │                                        │
│  ┌──────────┐  ┌────────┴──────┐  ┌────────────────────────┐    │
│  │  HTTP     │  │  Queue        │  │  Database               │    │
│  │  Adapter  │  │  Adapter      │  │  Adapter                │    │
│  │ (Fastify) │  │ (BullMQ /    │  │  (Drizzle ORM +         │    │
│  │           │  │  SQS /       │  │   PostgreSQL)            │    │
│  │           │  │  RabbitMQ)   │  │                          │    │
│  └──────────┘  └──────┬───────┘  └────────────────────────┘    │
│                        │                                        │
│  OpenAPI Spec (source of truth for all route contracts)         │
└────────────────────────┼────────────────────────────────────────┘
                         │
                         v
┌──────────────────────────────────────────────────────────────────┐
│                     Worker Process(es)                             │
│                                                                   │
│  [PDF Extract] → [Vision AI] → [Script Gen] → [TTS] → [Render]   │
│                                                                   │
│  Uses: render package (Remotion), AI APIs, File Storage           │
│  Receives jobs via Queue Adapter interface                        │
└──────────────────────────────────────────────────────────────────┘
                         │
                         v
┌──────────────────────────────────────────────────────────────────┐
│                   File Storage (Cloudflare R2)                     │
│           (S3-compatible: R2, MinIO for local dev)                │
│                                                                   │
│  PDFs ─── Page Images ─── Audio Files ─── Final Videos            │
│  Presigned URLs for secure download / streaming                   │
└──────────────────────────────────────────────────────────────────┘
```

### 4.2 Monorepo Structure

```
hq-to-video/
├── apps/
│   ├── frontend/          # Web application (React)
│   └── backend/           # API server + job orchestration
├── packages/
│   ├── api-client/        # Auto-generated API client (Kubb + React Query)
│   ├── poc-remotion/      # Remotion Studio experimentation
│   └── render/            # Production Remotion template
├── docs/
│   ├── PRD.md             # This document
│   └── openapi.yaml       # OpenAPI 3.1 specification (source of truth)
├── package.json           # Monorepo root (workspaces)
└── turbo.json             # Turborepo config (or pnpm workspaces)
```

### 4.3 Package Descriptions

| Package                 | Purpose                                                                              | Key Dependencies                                                                    |
| ----------------------- | ------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------- |
| `apps/frontend`         | User-facing web app: upload PDF, configure, view videos, queue                       | React, TanStack Router, TailwindCSS, `@tanstack/react-query`, `api-client` package |
| `apps/backend`          | Framework-agnostic API core with HTTP adapter, queue adapter, and database adapter   | Node.js, Fastify (HTTP adapter), Drizzle ORM, OpenAPI spec validation               |
| `packages/api-client`   | Auto-generated typed API client with React Query hooks from OpenAPI spec via Kubb    | `@kubb/cli`, `@kubb/plugin-oas`, `@kubb/plugin-ts`, `@kubb/plugin-react-query`     |
| `packages/poc-remotion` | Prototyping video templates with Remotion Studio                                     | Remotion, React                                                                     |
| `packages/render`       | Production-ready Remotion composition used by workers                                | `@remotion/bundler`, `@remotion/renderer`, React                                    |

### 4.4 Data Flow

```
1. User uploads PDF via frontend
2. Frontend calls useCreateProjectMutation() (from api-client package)
   → sends PDF to backend POST /api/projects
3. Backend (HTTP adapter receives request → delegates to CreateProject use case):
   a. Stores PDF in file storage
   b. Creates project record via database adapter (Drizzle ORM, status: "created")
   c. Enqueues processing job via queue adapter (BullMQ / SQS / RabbitMQ)
   d. Returns project ID to frontend
4. Worker picks up job from queue adapter:
   a. Updates status → "processing"
   b. Extracts PDF pages to images (Stage 1)
   c. Sends images to Vision AI for panel analysis (Stage 2)
   d. Sends panel data to LLM for script generation (Stage 3)
   e. Sends script to TTS for audio generation (Stage 4)
   f. Passes scene data to Remotion renderer (Stage 5)
   g. Stores final MP4 in file storage
   h. Updates status → "completed" via database adapter
5. Frontend polls via useGetProjectById() or receives WebSocket update
6. User views/downloads video via useGetProjectVideo()
```

### 4.5 OpenAPI Specification & Code Generation (Kubb)

All backend API routes are defined using an **OpenAPI 3.1 specification** file (`docs/openapi.yaml`). This file is the **single source of truth** for the API contract between the frontend and backend. No route is implemented without first being declared in the spec.

#### Why OpenAPI-First

- **Contract-driven development**: frontend and backend teams can work in parallel once the spec is agreed upon.
- **Type safety end-to-end**: TypeScript types, request/response schemas, and React Query hooks are all generated from the same source.
- **Documentation as code**: the OpenAPI spec doubles as always-up-to-date API documentation.
- **Validation**: the backend validates incoming requests against the spec, rejecting malformed payloads before they reach business logic.

#### Code Generation with Kubb

The `packages/api-client` package uses **Kubb** to auto-generate a fully-typed API client with React Query hooks from the OpenAPI spec.

**Kubb configuration** (`packages/api-client/kubb.config.ts`):

```typescript
import { defineConfig } from '@kubb/core'
import { pluginOas } from '@kubb/plugin-oas'
import { pluginTs } from '@kubb/plugin-ts'
import { pluginReactQuery } from '@kubb/plugin-react-query'

export default defineConfig({
  input: {
    path: '../../docs/openapi.yaml',
  },
  output: {
    path: './src/gen',
    clean: true,
  },
  plugins: [
    pluginOas(),
    pluginTs(),
    pluginReactQuery({
      output: { path: './hooks' },
      client: {
        dataReturnType: 'data',
      },
      query: {
        methods: ['get'],
        importPath: '@tanstack/react-query',
      },
      mutation: {
        methods: ['post', 'put', 'delete'],
      },
      group: {
        type: 'tag',
        name: ({ group }) => `${group}Hooks`,
      },
    }),
  ],
})
```

**What Kubb generates:**

| Output                  | Description                                                         |
| ----------------------- | ------------------------------------------------------------------- |
| TypeScript types        | Request/response interfaces for every endpoint                      |
| React Query hooks       | `useQuery` hooks for GET endpoints, `useMutation` for POST/PUT/DELETE |
| API client functions    | Typed fetch wrappers for each endpoint                              |
| Query key factories     | Typed, deterministic query keys for cache invalidation              |

**Generated code workflow:**

```
docs/openapi.yaml  ──(kubb generate)──>  packages/api-client/src/gen/
                                            ├── types/          # TS interfaces
                                            ├── hooks/          # React Query hooks
                                            └── clients/        # Fetch wrappers
```

**Usage in frontend:**

```typescript
import { useGetProjects, useCreateProjectMutation } from '@heroic-vision/api-client'

function Dashboard() {
  const { data: projects, isLoading } = useGetProjects()
  const createProject = useCreateProjectMutation()

  const handleCreate = (formData: FormData) => {
    createProject.mutate({ data: formData })
  }
}
```

**Regeneration**: the api-client package includes a `generate` script that re-runs Kubb whenever the OpenAPI spec changes. This should be executed as part of the monorepo build pipeline.

```json
{
  "scripts": {
    "generate": "kubb generate",
    "build": "kubb generate && tsc"
  }
}
```

### 4.6 Backend Framework Adapter Pattern

The backend core is **framework-agnostic**. Business logic, use cases, and domain rules do not depend on any HTTP framework. The HTTP layer is isolated behind an adapter interface, making it straightforward to swap Fastify for another framework (Express, Hono, h3, etc.) without touching application logic.

#### Layer Structure

```
apps/backend/
├── src/
│   ├── core/                    # Framework-agnostic application logic
│   │   ├── use-cases/           # Business logic (e.g., CreateProject, RetryJob)
│   │   ├── domain/              # Entities, value objects, enums
│   │   ├── repositories/        # Repository interfaces (ports)
│   │   └── services/            # Domain services
│   │
│   ├── adapters/
│   │   ├── http/
│   │   │   ├── fastify/         # Fastify-specific route registration & middleware
│   │   │   │   ├── server.ts    # Fastify server bootstrap
│   │   │   │   ├── routes/      # Route handlers that delegate to use cases
│   │   │   │   └── plugins/     # Fastify plugins (CORS, multipart, etc.)
│   │   │   └── http.port.ts     # HTTP adapter interface (port)
│   │   │
│   │   ├── queue/
│   │   │   ├── bullmq/          # BullMQ adapter implementation
│   │   │   ├── sqs/             # AWS SQS adapter implementation
│   │   │   ├── rabbitmq/        # RabbitMQ adapter implementation
│   │   │   └── queue.port.ts    # Queue adapter interface (port)
│   │   │
│   │   └── database/
│   │       ├── drizzle/          # Drizzle ORM schema + repository implementations
│   │       │   ├── schema.ts     # Drizzle table definitions
│   │       │   ├── migrations/   # SQL migrations
│   │       │   └── repositories/ # Concrete repository implementations
│   │       └── db.port.ts        # Database adapter interface (port)
│   │
│   └── main.ts                  # Composition root (wires adapters to core)
```

#### HTTP Adapter Interface

```typescript
interface HttpServer {
  registerRoute(route: RouteDefinition): void
  start(port: number): Promise<void>
  stop(): Promise<void>
}

interface RouteDefinition {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  path: string
  handler: (req: AppRequest) => Promise<AppResponse>
  schema?: OpenAPIOperationSchema
}

interface AppRequest {
  params: Record<string, string>
  query: Record<string, string>
  body: unknown
  files?: UploadedFile[]
  headers: Record<string, string>
}

interface AppResponse {
  status: number
  body: unknown
  headers?: Record<string, string>
}
```

The Fastify adapter translates `AppRequest`/`AppResponse` to and from Fastify's native request/reply objects. To switch to another framework, only a new adapter implementation is needed — the core use cases, routes definitions, and handler logic remain unchanged.

### 4.7 Queue Adapter Pattern

The job queue system is also **framework-agnostic**, abstracted behind a port interface. The MVP ships with a BullMQ adapter, but the architecture supports swapping to AWS SQS or RabbitMQ without modifying workers or business logic.

#### Queue Port Interface

```typescript
interface QueuePort {
  enqueue(job: JobPayload): Promise<string>
  onProcess(handler: (job: JobPayload) => Promise<void>): void
  getJobStatus(jobId: string): Promise<JobStatus>
  retry(jobId: string): Promise<void>
  getQueueMetrics(): Promise<QueueMetrics>
}

interface JobPayload {
  id: string
  projectId: string
  type: 'video-generation'
  data: {
    pdfUrl: string
    startPage: number
    endPage: number
    creativeBrief?: string
  }
}

type JobStatus = 'waiting' | 'processing' | 'completed' | 'failed'

interface QueueMetrics {
  activeJobs: number
  waitingJobs: number
  completedToday: number
  failedToday: number
}
```

#### Adapter Implementations

| Adapter  | When to Use                                                   | Trade-offs                                  |
| -------- | ------------------------------------------------------------- | ------------------------------------------- |
| BullMQ   | Local development, self-hosted deployments with Redis          | Simple setup; requires Redis infrastructure |
| AWS SQS  | Cloud-native deployments on AWS; serverless workers            | Managed service; higher latency; no priority queues natively |
| RabbitMQ | On-premise deployments; complex routing or priority needs      | Feature-rich; requires Erlang/RabbitMQ server management |

The active adapter is selected via environment configuration:

```typescript
// main.ts (composition root)
const queueAdapter = createQueueAdapter(process.env.QUEUE_PROVIDER) // 'bullmq' | 'sqs' | 'rabbitmq'
```

### 4.8 API Endpoints

All endpoints below are defined in the OpenAPI 3.1 spec (`docs/openapi.yaml`) and tagged by resource group. Kubb uses these tags to organize the generated hooks (e.g., `ProjectsHooks`, `QueueHooks`, `DashboardHooks`).

| Method | Endpoint                    | Tag         | Description                          | Generated Hook                |
| ------ | --------------------------- | ----------- | ------------------------------------ | ----------------------------- |
| POST   | `/api/projects`             | `Projects`  | Create project with PDF upload       | `useCreateProjectMutation`    |
| GET    | `/api/projects`             | `Projects`  | List all projects with status        | `useGetProjects`              |
| GET    | `/api/projects/:id`         | `Projects`  | Get project details                  | `useGetProjectById`           |
| GET    | `/api/projects/:id/video`   | `Projects`  | Stream/download generated video      | `useGetProjectVideo`          |
| POST   | `/api/projects/:id/retry`   | `Projects`  | Retry failed processing job          | `useRetryProjectMutation`     |
| GET    | `/api/queue`                | `Queue`     | Get queue status (active, completed) | `useGetQueue`                 |
| GET    | `/api/dashboard/metrics`    | `Dashboard` | Get dashboard metrics                | `useGetDashboardMetrics`      |
| POST   | `/api/projects/:id/publish` | `Projects`  | Initiate TikTok publish flow         | `usePublishProjectMutation`   |

### 4.9 Database Schema (Drizzle ORM)

```
Project
├── id              UUID (PK)
├── title           String
├── pdfUrl          String (file storage path)
├── startPage       Integer
├── endPage         Integer
├── creativeBrief   Text (nullable)
├── status          Enum (PROCESSING, COMPLETED, CANCELLED)
├── errorMessage    Text (nullable)
├── videoUrl        String (nullable, file storage path)
├── duration        Integer (seconds, nullable)
├── formatSize      Enum (VERTICAL, HORIZONTAL) default VERTICAL
├── createdAt       DateTime
├── updatedAt       DateTime

ProcessingJob
├── id              UUID (PK)
├── projectId       UUID (FK → Project)
├── currentStep     Enum (PDF_EXTRACTION, VISION_ANALYSIS, SCRIPT_GEN, TTS, RENDER)
├── progress        Integer (0-100)
├── startedAt       DateTime (nullable)
├── completedAt     DateTime (nullable)
├── errorDetails    Text (nullable)
├── attempts        Integer (default 0)
```

### 4.10 Remotion Input Props Schema

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

### 4.11 Integration Points

| System          | Integration                                                                           |
| --------------- | ------------------------------------------------------------------------------------- |
| API Contract    | OpenAPI 3.1 spec (`docs/openapi.yaml`) — single source of truth for all API routes    |
| API Client      | Kubb-generated React Query hooks + TypeScript types (`packages/api-client`)           |
| HTTP Framework  | Fastify (via HTTP adapter port); swappable to Express, Hono, h3                       |
| Vision AI       | OpenAI GPT-4o Vision API (or Gemini/Claude as fallback)                               |
| Script LLM      | OpenAI GPT-4o API (or Claude 3.5 Sonnet as fallback)                                  |
| TTS             | ElevenLabs API (or OpenAI TTS as fallback)                                            |
| Job Queue       | Queue adapter port — BullMQ (default), AWS SQS, or RabbitMQ via env config            |
| File Storage    | Cloudflare R2 via `@aws-sdk/client-s3` (S3-compatible API; MinIO for local dev)           |
| Database        | PostgreSQL via Drizzle ORM (adapter port for repository implementations)              |
| Video Rendering | Remotion (`@remotion/bundler` + `@remotion/renderer`)                                 |
| TikTok Publish  | TikTok Content Posting API (OAuth 2.0)                                                |

### 4.12 Security & Privacy

| Concern             | Mitigation                                                                                                          |
| ------------------- | ------------------------------------------------------------------------------------------------------------------- |
| PDF file validation | Validate MIME type and file header; reject non-PDF files                                                            |
| File size limits    | Enforce 150 MB max upload; reject oversized files server-side                                                       |
| API key storage     | All AI provider API keys stored in environment variables, never committed to version control                        |
| Uploaded content    | PDFs and generated assets stored in a private R2 bucket; served through time-limited presigned URLs via authenticated API endpoints |
| IP protection       | Uploaded files are processed and stored encrypted at rest; deletion policy after configurable retention period      |
| Rate limiting       | API rate limiting to prevent abuse (100 requests/min per user)                                                      |

---

## 5. Risks & Roadmap

### 5.1 Phased Rollout

#### Phase 1 — MVP (Weeks 1-6)

| Milestone                          | Description                                                            |
| ---------------------------------- | ---------------------------------------------------------------------- |
| Monorepo setup                     | Configure workspaces: frontend, backend, api-client, poc-remotion      |
| OpenAPI spec + Kubb setup          | Define API contract in OpenAPI 3.1, configure Kubb code generation     |
| Backend adapter pattern            | Implement HTTP port (Fastify adapter), queue port, database port       |
| POC Remotion                       | Validate video generation with hardcoded scenes data                   |
| PDF-to-Image extraction            | Implement Stage 1 of the pipeline                                      |
| Vision AI panel analysis           | Implement Stage 2 with a single AI provider                            |
| Script generation                  | Implement Stage 3 with basic narration structure                       |
| TTS integration                    | Implement Stage 4 with a single TTS provider                           |
| Render package                     | Migrate validated POC template to production `render`                  |
| Worker pipeline                    | End-to-end pipeline with queue adapter job processing                  |
| Frontend — all screens             | Dashboard, New Project, Queue, Video Viewer using api-client hooks     |

#### Phase 2 — v1.1 (Weeks 7-10)

| Milestone                      | Description                                              |
| ------------------------------ | -------------------------------------------------------- |
| TikTok publishing integration  | OAuth flow + Content Posting API                         |
| AI model fallback strategy     | Automatic fallback between vision/LLM/TTS providers      |
| Retry logic and error recovery | Automatic retries with exponential backoff               |
| Video style variations         | Multiple Remotion templates (Cinematic, Comic Pop, Noir) |
| Performance optimization       | Parallel stage execution where possible                  |

#### Phase 3 — v2.0 (Weeks 11-16)

| Milestone                               | Description                                            |
| --------------------------------------- | ------------------------------------------------------ |
| User authentication                     | Multi-user support with auth (e.g., Clerk, BetterAuth) |
| Cloud deployment                        | Containerized workers, auto-scaling, managed infra     |
| Instagram Reels / YouTube Shorts export | Additional platform publishing                         |
| Custom template editor                  | Allow users to tweak video layout and styles           |
| Analytics dashboard                     | Engagement metrics from published videos               |
| Multi-language narration                | Support for additional TTS languages                   |
| Batch processing                        | Upload multiple PDFs and process in parallel           |

### 5.2 Technical Risks

| Risk                                    | Impact | Likelihood | Mitigation                                                                                            |
| --------------------------------------- | ------ | ---------- | ----------------------------------------------------------------------------------------------------- |
| Vision AI misreads comic panels         | High   | Medium     | Fine-tune prompts; manual override UI for panel correction in v1.1; test across 5+ comic art styles   |
| TTS audio sounds robotic                | Medium | Low        | Use ElevenLabs with expressive voice models; A/B test multiple providers; allow voice selection       |
| Remotion render fails on complex scenes | High   | Medium     | Implement render timeout with fallback to simplified template; thorough testing in poc-remotion first |
| AI API costs escalate rapidly           | High   | High       | Implement token budgets per project; cache repeated analyses; batch API calls where possible          |
| Long processing times frustrate users   | Medium | Medium     | WebSocket real-time progress updates; estimated time display; queue position indicator                |
| PDF format variability                  | Medium | High       | Support multiple PDF engines; graceful degradation with user-friendly error messages                  |
| TikTok API changes or rate limits       | Low    | Medium     | Abstract publishing behind an adapter pattern; implement retry with backoff                           |
| Queue provider data loss                | High   | Low        | Persist job state in PostgreSQL via Drizzle; enable persistence on chosen provider (Redis AOF, SQS FIFO, RabbitMQ durable queues); idempotent job processing |
| Adapter abstraction leakage             | Medium | Medium     | Keep adapter interfaces minimal; test each adapter implementation independently; avoid provider-specific features in core logic |
| OpenAPI spec drift from implementation  | Medium | Medium     | Run spec validation in CI; use Kubb generation as a build step that fails on spec errors; code review checklist for spec updates |

### 5.3 Development Strategy

```
Week 1-2:  Monorepo setup + OpenAPI spec + Kubb config + Backend adapter pattern + POC Remotion
Week 3:    PDF extraction + Vision AI integration
Week 4:    Script generation + TTS integration
Week 5:    Worker pipeline (end-to-end) + Render package migration
Week 6:    Frontend (all 4 screens) using api-client generated hooks
Week 7-8:  Polish, error handling, testing
Week 9-10: TikTok integration, AI fallbacks, style variations
```

---

## Appendix A: UI Design Reference

The application follows a dark-themed UI with a cyberpunk/comic aesthetic branded as **"Heroic Vision"**. Figma designs are available at:

| Screen            | Figma Link                                                                                          |
| ----------------- | --------------------------------------------------------------------------------------------------- |
| Dashboard         | [Figma — Dashboard](https://www.figma.com/design/MupzTsbp3eceYTly9twFbA/Untitled?node-id=1-2)       |
| Processing Queue  | [Figma — Queue](https://www.figma.com/design/MupzTsbp3eceYTly9twFbA/Untitled?node-id=1-180)         |
| New Video Project | [Figma — New Project](https://www.figma.com/design/MupzTsbp3eceYTly9twFbA/Untitled?node-id=1-787)   |
| Video Viewer      | [Figma — Video Viewer](https://www.figma.com/design/MupzTsbp3eceYTly9twFbA/Untitled?node-id=1-1004) |

**Design System Notes:**

- **Theme**: Dark background (#0A0A0F range), card surfaces (#1A1A2E range).
- **Primary accent**: Coral/red (#FF6B6B range) for CTAs and important actions.
- **Secondary accent**: Blue/purple for active states and highlights.
- **Typography**: Bold, uppercase display headings with a comic/heroic feel; clean sans-serif for body text.
- **Status badges**: Green (Success/Completed), Blue (Processing), Red (Cancelled), Gray (Waiting).
- **Sidebar**: Fixed left navigation with logo, user profile, page links, support, and sign out.

---

## Appendix B: Glossary

| Term             | Definition                                                                                  |
| ---------------- | ------------------------------------------------------------------------------------------- |
| Panel            | A single frame/box within a comic book page                                                 |
| HQ               | "História em Quadrinhos" — Portuguese for comic book                                        |
| Scene            | A segment of the generated video corresponding to one or more panels                        |
| Creative Brief   | User-provided text describing desired pacing, mood, and highlights                          |
| Ken Burns Effect | A panning/zooming animation applied to still images                                         |
| BPM              | Beats Per Minute — tempo of background music, if applicable                                 |
| TTS              | Text-to-Speech — AI technology that converts text into spoken audio                         |
| OpenAPI          | A specification standard for describing RESTful APIs; used as the API contract source of truth |
| Kubb             | A TypeScript code generator that reads OpenAPI specs and outputs typed clients, React Query hooks, and more |
| React Query      | TanStack library for managing server state in React apps via hooks (`useQuery`, `useMutation`) |
| Drizzle ORM      | A lightweight, type-safe TypeScript ORM for SQL databases with a schema-as-code approach    |
| Port/Adapter     | A software architecture pattern where core logic defines interfaces (ports) and infrastructure implements them (adapters) |
| BullMQ           | A Node.js library for managing job queues backed by Redis                                   |
| AWS SQS          | Amazon Simple Queue Service — a managed message queue service                               |
| RabbitMQ         | An open-source message broker supporting multiple messaging protocols                       |
| Fastify          | A high-performance Node.js HTTP framework used as the default HTTP adapter                  |
| Remotion         | A React-based framework for programmatically creating videos                                |
