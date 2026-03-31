import { projectIdParamsJsonSchema } from './shared/project-id-params-schema';

export const getProjectVideoParamsJsonSchema = projectIdParamsJsonSchema;

/** Binary video stream (MP4). Documented for OpenAPI; not validated with Zod. */
export const getProjectVideoResponse200BinarySchema = {
  type: 'string',
  format: 'binary',
  description: 'MP4 video stream',
} as const;
