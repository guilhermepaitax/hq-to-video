import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

export const getHealthResponseSchema = z.object({
  status: z.string(),
});

export const getHealthResponseJsonSchema = zodToJsonSchema(getHealthResponseSchema);
