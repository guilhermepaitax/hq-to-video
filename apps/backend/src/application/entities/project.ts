import KSUID from 'ksuid';

export class Project {
  readonly id: string;
  readonly title: string;
  readonly startPage: number;
  readonly endPage: number;
  readonly creativeBrief?: string | null;
  readonly errorMessage?: string | null;
  readonly duration?: number | null;
  readonly formatSize: Project.FormatSize;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
  pdfUrl?: string | null;
  status: Project.Status;
  videoUrl?: string | null;

  constructor(attributes: Project.Attributes) {
    this.id = attributes.id ?? KSUID.randomSync().string;
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
    id?: string;
    title: string;
    pdfUrl?: string | null;
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
