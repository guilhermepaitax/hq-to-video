import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

export const atmosphereConfigSchema = z.object({
  rainSfx: z.boolean().optional(),
  streetNoise: z.boolean().optional(),
  orchestralScore: z.boolean().optional(),
});

export const atmosphereConfigJsonSchema = zodToJsonSchema(atmosphereConfigSchema, {
  $refStrategy: 'none',
});
