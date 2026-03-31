import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

export const dashboardMetricsSchema = z.object({
  totalVideosGenerated: z.number().int().min(0),
  activeJobs: z.number().int().min(0),
  conversionRate: z.number().min(0).max(100),
  completedToday: z.number().int().min(0),
});

export const dashboardMetricsJsonSchema = zodToJsonSchema(dashboardMetricsSchema, {
  $refStrategy: 'none',
});
