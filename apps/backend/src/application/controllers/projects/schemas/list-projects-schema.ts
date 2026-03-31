import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

import { projectWithProcessingJobSchema } from './shared/project-with-processing-job-schema';

export const listProjectsResponseSchema = z.array(projectWithProcessingJobSchema);

export const listProjectsResponseJsonSchema = zodToJsonSchema(
  listProjectsResponseSchema,
  { $refStrategy: 'none' },
);
