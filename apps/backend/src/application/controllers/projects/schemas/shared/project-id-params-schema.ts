import { z } from 'zod';

export const projectIdParamsSchema = z.object({
  id: z.string().min(1),
});
