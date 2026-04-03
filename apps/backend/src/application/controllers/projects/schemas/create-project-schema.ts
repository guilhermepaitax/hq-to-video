import { z } from 'zod';

import { projectWrappedSchema } from './shared/project-schema';

/**
 * Body after multipart `attachFieldsToBody: 'keyValues'`: text fields are strings
 * (pages coerced); file is a Buffer.
 */
export const createProjectRequestBodySchema = z.object({
  file: z.instanceof(Buffer).describe('Comic book PDF file'),
  title: z.string().min(1),
  startPage: z.coerce.number().int().min(1),
  endPage: z.coerce.number().int().min(1),
  creativeBrief: z.string().optional(),
});

export const createProjectResponseSchema = projectWrappedSchema;
