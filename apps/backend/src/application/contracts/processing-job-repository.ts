import { ProcessingJob } from '@application/entities/processing-job';
import { Project } from '@application/entities/project';

export interface ProcessingJobRepository {
  create(processingJob: ProcessingJob): Promise<ProcessingJob>;

  findByProjectId(projectId: string): Promise<ProcessingJob | null>;

  updateProgress(
    input: ProcessingJobRepository.UpdateProgressInput,
  ): Promise<void>;

  complete(input: ProcessingJobRepository.CompleteInput): Promise<void>;

  fail(input: ProcessingJobRepository.FailInput): Promise<void>;
}

export namespace ProcessingJobRepository {
  export type UpdateProgressInput = {
    id: string;
    step: Project.PipelineStep;
    progress: number;
  };

  export type CompleteInput = {
    id: string;
  };

  export type FailInput = {
    id: string;
    errorDetails: string;
  };
}
