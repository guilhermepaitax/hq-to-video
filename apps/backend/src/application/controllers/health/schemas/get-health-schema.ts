import { z } from 'zod';

export const getHealthResponseSchema = z.object({
  status: z.string(),
});
