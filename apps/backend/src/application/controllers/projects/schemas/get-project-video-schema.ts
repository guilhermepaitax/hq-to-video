import { z } from 'zod';

export { projectIdParamsSchema as getProjectVideoParamsSchema } from './shared/project-id-params-schema';

/** MP4 stream; OpenAPI/binary documentation. */
export const getProjectVideoResponse200Schema = z
  .instanceof(Buffer)
  .describe('MP4 video stream');
