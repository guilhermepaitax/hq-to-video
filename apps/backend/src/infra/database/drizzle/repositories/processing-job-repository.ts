import { eq } from 'drizzle-orm';

import type { ProcessingJobRepository } from '@application/contracts/processing-job-repository';
import { ProcessingJob } from '@application/entities/processing-job';
import { db } from '@infra/database/drizzle/client';
import { processingJobFromDrizzle } from '@infra/database/drizzle/items/processing-job-item';
import { processingJobs } from '@infra/database/drizzle/schema';
import { Injectable } from '@kernel/decorators/injectable';

@Injectable()
export class DrizzleProcessingJobRepository implements ProcessingJobRepository {
  async create(processingJob: ProcessingJob): Promise<ProcessingJob> {
    const [row] = await db
      .insert(processingJobs)
      .values(processingJob)
      .returning();

    if (!row) {
      throw new Error('Failed to create processing job');
    }

    return processingJobFromDrizzle(row);
  }

  async findByProjectId(projectId: string): Promise<ProcessingJob | null> {
    const [row] = await db
      .select()
      .from(processingJobs)
      .where(eq(processingJobs.projectId, projectId))
      .limit(1);

    return row ? processingJobFromDrizzle(row) : null;
  }

  async updateProgress(
    input: ProcessingJobRepository.UpdateProgressInput,
  ): Promise<void> {
    await db
      .update(processingJobs)
      .set({
        currentStep: input.step,
        progress: input.progress,
      })
      .where(eq(processingJobs.id, input.id));
  }

  async complete(input: ProcessingJobRepository.CompleteInput): Promise<void> {
    await db
      .update(processingJobs)
      .set({
        completedAt: new Date(),
        progress: 100,
      })
      .where(eq(processingJobs.id, input.id));
  }

  async fail(input: ProcessingJobRepository.FailInput): Promise<void> {
    await db
      .update(processingJobs)
      .set({
        errorDetails: input.errorDetails,
        completedAt: new Date(),
      })
      .where(eq(processingJobs.id, input.id));
  }
}
