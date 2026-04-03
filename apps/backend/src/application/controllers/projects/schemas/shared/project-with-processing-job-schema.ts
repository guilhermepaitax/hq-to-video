import { processingJobSchema } from './processing-job-schema';
import { projectSchema } from './project-schema';

export const projectWithProcessingJobSchema = projectSchema.extend({
  processingJob: processingJobSchema,
});
