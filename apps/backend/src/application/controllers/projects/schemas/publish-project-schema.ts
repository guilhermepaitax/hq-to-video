import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

import { projectIdParamsJsonSchema } from './shared/project-id-params-schema';

export const publishProjectParamsJsonSchema = projectIdParamsJsonSchema;

export const publishProjectResponseSchema = z.object({
  tikTokUrl: z.string().url(),
});

export const publishProjectResponseJsonSchema = zodToJsonSchema(
  publishProjectResponseSchema,
  { $refStrategy: 'none' },
);
