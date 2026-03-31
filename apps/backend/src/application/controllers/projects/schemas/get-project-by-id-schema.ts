import { projectWithProcessingJobJsonSchema } from './shared/project-with-processing-job-schema';
import { projectIdParamsJsonSchema } from './shared/project-id-params-schema';

export const getProjectByIdParamsJsonSchema = projectIdParamsJsonSchema;

export const getProjectByIdResponseJsonSchema = projectWithProcessingJobJsonSchema;
