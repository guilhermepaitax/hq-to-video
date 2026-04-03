import { z } from 'zod';

export { projectIdParamsSchema as publishProjectParamsSchema } from './shared/project-id-params-schema';

export const publishProjectResponseSchema = z.object({
  tikTokUrl: z.string().url(),
});
