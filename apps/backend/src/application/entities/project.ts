export class Project {
  readonly id: string;
  readonly title: string;
  readonly pdfUrl: string;
  readonly startPage: number;
  readonly endPage: number;
  readonly creativeBrief?: string | null;
  readonly status: Project.Status;
  readonly errorMessage?: string | null;
  readonly videoUrl?: string | null;
  readonly duration?: number | null;
  readonly formatSize: Project.FormatSize;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;

  constructor(attributes: Project.Attributes) {
    this.id = attributes.id;
    this.title = attributes.title;
    this.pdfUrl = attributes.pdfUrl;
    this.startPage = attributes.startPage;
    this.endPage = attributes.endPage;
    this.creativeBrief = attributes.creativeBrief;
    this.status = attributes.status ?? Project.Status.PROCESSING;
    this.errorMessage = attributes.errorMessage;
    this.videoUrl = attributes.videoUrl;
    this.duration = attributes.duration;
    this.formatSize = attributes.formatSize ?? Project.FormatSize.VERTICAL;
    this.updatedAt = attributes.updatedAt;
    this.createdAt = attributes.createdAt ?? new Date();
  }
}

export namespace Project {
  export enum Status {
    PROCESSING = 'PROCESSING',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED',
  }

  export enum FormatSize {
    VERTICAL = 'VERTICAL',
    HORIZONTAL = 'HORIZONTAL',
  }

  export enum PipelineStep {
    PdfExtraction = 'PDF_EXTRACTION',
    VisionAnalysis = 'VISION_ANALYSIS',
    ScriptGen = 'SCRIPT_GEN',
    Tts = 'TTS',
    Render = 'RENDER',
  }

  export type Attributes = {
    id: string;
    title: string;
    pdfUrl: string;
    startPage: number;
    endPage: number;
    creativeBrief?: string | null;
    status?: Status;
    errorMessage?: string | null;
    videoUrl?: string | null;
    duration?: number | null;
    formatSize?: FormatSize;
    createdAt?: Date;
    updatedAt?: Date;
  };
}
