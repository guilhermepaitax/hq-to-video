import { ProcessingJob } from '@application/entities/processing-job';
import { type Project } from '@application/entities/project';
import { processingJobs } from '@infra/database/drizzle/schema';
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';

export type ProcessingJobRow = InferSelectModel<typeof processingJobs>;
export type ProcessingJobInsert = InferInsertModel<typeof processingJobs>;

export function processingJobFromDrizzle(row: ProcessingJobRow): ProcessingJob {
  return new ProcessingJob({
    id: row.id,
    projectId: row.projectId,
    currentStep: row.currentStep as Project.PipelineStep,
    progress: row.progress,
    startedAt: row.startedAt ?? undefined,
    completedAt: row.completedAt ?? undefined,
    errorDetails: row.errorDetails ?? undefined,
    attempts: row.attempts,
  });
}
