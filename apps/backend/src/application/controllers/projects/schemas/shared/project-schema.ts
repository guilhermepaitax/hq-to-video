import { z } from 'zod';

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
  id: z.string().min(1),
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
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

/** Single project wrapped for create/get responses. */
export const projectWrappedSchema = z.object({
  project: projectSchema,
});
