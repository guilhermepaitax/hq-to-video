import { z } from 'zod';

import { pipelineStepSchema } from './project-schema';

export const processingJobSchema = z.object({
  id: z.uuid(),
  projectId: z.string().min(1),
  currentStep: pipelineStepSchema,
  progress: z.number().int().min(0).max(100),
  startedAt: z.iso.datetime().nullable(),
  completedAt: z.iso.datetime().nullable(),
  errorDetails: z.string().nullable(),
  attempts: z.number().int().min(0),
});
