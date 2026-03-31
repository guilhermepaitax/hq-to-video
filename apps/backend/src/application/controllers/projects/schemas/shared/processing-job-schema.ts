import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

import { pipelineStepSchema } from './project-schema';

export const processingJobSchema = z.object({
  id: z.string().uuid(),
  projectId: z.string().uuid(),
  currentStep: pipelineStepSchema,
  progress: z.number().int().min(0).max(100),
  startedAt: z.string().datetime().nullable(),
  completedAt: z.string().datetime().nullable(),
  errorDetails: z.string().nullable(),
  attempts: z.number().int().min(0),
});

export const processingJobJsonSchema = zodToJsonSchema(processingJobSchema, {
  $refStrategy: 'none',
});
