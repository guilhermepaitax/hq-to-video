import { z } from 'zod';

/** Queue row can include waiting jobs (not persisted on Project entity). */
export const queueItemStatusSchema = z.enum([
  'WAITING',
  'PROCESSING',
  'COMPLETED',
  'CANCELLED',
]);

export const queueItemSchema = z.object({
  projectId: z.string().min(1),
  thumbnailUrl: z.string().nullable(),
  title: z.string(),
  formatSize: z.enum(['VERTICAL', 'HORIZONTAL']).nullable(),
  durationSeconds: z.number().int().nullable(),
  status: queueItemStatusSchema,
  progress: z.number().int().min(0).max(100).nullable(),
  queuePosition: z.number().int().nullable(),
  failureReason: z.string().nullable(),
});

export const queueStatusSchema = z.object({
  activeTasks: z.number().int().min(0),
  completedToday: z.number().int().min(0),
  items: z.array(queueItemSchema),
});
