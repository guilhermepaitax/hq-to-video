import { type Project } from '@application/entities/project';

export class ProcessingJob {
  readonly id: string;
  readonly projectId: string;
  readonly currentStep: Project.PipelineStep;
  readonly progress: number;
  readonly errorDetails?: string;
  readonly attempts: number;
  readonly startedAt?: Date;
  readonly completedAt?: Date;

  constructor(attributes: ProcessingJob.Attributes) {
    this.id = attributes.id;
    this.projectId = attributes.projectId;
    this.currentStep = attributes.currentStep;
    this.progress = attributes.progress ?? 0;
    this.errorDetails = attributes.errorDetails;
    this.completedAt = attributes.completedAt;
    this.attempts = attributes.attempts ?? 0;
    this.startedAt = attributes.startedAt ?? new Date();
  }
}

export namespace ProcessingJob {
  export type Attributes = {
    id: string;
    projectId: string;
    currentStep: Project.PipelineStep;
    progress?: number;
    errorDetails?: string;
    attempts?: number;
    startedAt?: Date;
    completedAt?: Date;
  };
}
