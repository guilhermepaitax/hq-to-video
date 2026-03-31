import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

export const errorResponseSchema = z.object({
  error: z.string(),
  message: z.string(),
});

export const errorResponseJsonSchema = zodToJsonSchema(errorResponseSchema, {
  $refStrategy: 'none',
});
