import { projectWithProcessingJobJsonSchema } from './shared/project-with-processing-job-schema';
import { projectIdParamsJsonSchema } from './shared/project-id-params-schema';

export const retryProjectParamsJsonSchema = projectIdParamsJsonSchema;

export const retryProjectResponseJsonSchema = projectWithProcessingJobJsonSchema;
