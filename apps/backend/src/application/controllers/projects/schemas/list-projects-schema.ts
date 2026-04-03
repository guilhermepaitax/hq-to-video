import { z } from 'zod';

import { projectWithProcessingJobSchema } from './shared/project-with-processing-job-schema';

export const listProjectsResponseSchema = z.array(projectWithProcessingJobSchema);
