import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

/** Queue row can include waiting jobs (not persisted on Project entity). */
export const queueItemStatusSchema = z.enum([
  'WAITING',
  'PROCESSING',
  'COMPLETED',
  'CANCELLED',
]);

export const queueItemSchema = z.object({
  projectId: z.string().uuid(),
  thumbnailUrl: z.string().nullable(),
  title: z.string(),
  format: z.string().nullable(),
  durationSeconds: z.number().int().nullable(),
  status: queueItemStatusSchema,
  progress: z.number().int().min(0).max(100).nullable(),
  stepLabel: z.string().nullable(),
  queuePosition: z.number().int().nullable(),
  failureReason: z.string().nullable(),
});

export const queueStatusSchema = z.object({
  activeTasks: z.number().int().min(0),
  completedToday: z.number().int().min(0),
  items: z.array(queueItemSchema),
});

export const queueStatusJsonSchema = zodToJsonSchema(queueStatusSchema, {
  $refStrategy: 'none',
});
