import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

export const projectIdParamsSchema = z.object({
  id: z.string().uuid(),
});

export const projectIdParamsJsonSchema = zodToJsonSchema(projectIdParamsSchema, {
  $refStrategy: 'none',
});
