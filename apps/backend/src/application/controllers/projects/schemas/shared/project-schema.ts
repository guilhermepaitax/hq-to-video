import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

import { atmosphereConfigSchema } from './atmosphere-config-schema';

export const projectStatusSchema = z.enum([
  'PROCESSING',
  'COMPLETED',
  'CANCELLED',
]);

export const pipelineStepSchema = z.enum([
  'pdf_extraction',
  'vision_analysis',
  'script_gen',
  'tts',
  'render',
]);

export const projectSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  pdfUrl: z.string(),
  startPage: z.number().int(),
  endPage: z.number().int(),
  videoStyle: z.string(),
  narrationStyle: z.string(),
  creativeBrief: z.string().nullable(),
  atmosphere: atmosphereConfigSchema.nullable(),
  status: projectStatusSchema,
  errorMessage: z.string().nullable(),
  videoUrl: z.string().nullable(),
  duration: z.number().int().nullable(),
  format: z.string().nullable(),
  metadata: z.record(z.string(), z.any()).nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const projectJsonSchema = zodToJsonSchema(projectSchema, {
  $refStrategy: 'none',
});
