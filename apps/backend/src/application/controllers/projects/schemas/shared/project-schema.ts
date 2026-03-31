import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

export const projectStatusSchema = z.enum([
  'PROCESSING',
  'COMPLETED',
  'CANCELLED',
]);

export const formatSizeSchema = z.enum(['VERTICAL', 'HORIZONTAL']);

export const pipelineStepSchema = z.enum([
  'PDF_EXTRACTION',
  'VISION_ANALYSIS',
  'SCRIPT_GEN',
  'TTS',
  'RENDER',
]);

export const projectSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  pdfUrl: z.string(),
  startPage: z.number().int(),
  endPage: z.number().int(),
  creativeBrief: z.string().nullable(),
  status: projectStatusSchema,
  errorMessage: z.string().nullable(),
  videoUrl: z.string().nullable(),
  duration: z.number().int().nullable(),
  formatSize: formatSizeSchema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const projectJsonSchema = zodToJsonSchema(projectSchema, {
  $refStrategy: 'none',
});
