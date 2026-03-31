import { zodToJsonSchema } from 'zod-to-json-schema';

import { processingJobSchema } from './processing-job-schema';
import { projectSchema } from './project-schema';

export const projectWithProcessingJobSchema = projectSchema.extend({
  processingJob: processingJobSchema,
});

export const projectWithProcessingJobJsonSchema = zodToJsonSchema(
  projectWithProcessingJobSchema,
  { $refStrategy: 'none' },
);
