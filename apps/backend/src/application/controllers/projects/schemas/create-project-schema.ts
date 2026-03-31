import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

import { atmosphereConfigSchema } from './shared/atmosphere-config-schema';
import { projectJsonSchema } from './shared/project-schema';

/** Logical multipart form fields (PDF binary documented separately for OpenAPI). */
export const createProjectFormFieldsSchema = z.object({
  title: z.string().min(1),
  startPage: z.number().int().min(1),
  endPage: z.number().int().min(1),
  videoStyle: z.string().min(1),
  narrationStyle: z.string().min(1),
  creativeBrief: z.string().optional(),
  atmosphere: atmosphereConfigSchema.optional(),
});

const formFieldsJson = zodToJsonSchema(createProjectFormFieldsSchema, {
  $refStrategy: 'none',
}) as {
  type?: string;
  properties?: Record<string, unknown>;
  required?: string[];
};

const formProperties =
  formFieldsJson.properties !== undefined && typeof formFieldsJson.properties === 'object'
    ? formFieldsJson.properties
    : {};

const formRequired = Array.isArray(formFieldsJson.required)
  ? [...formFieldsJson.required]
  : [];

/**
 * OpenAPI 3.1 body for multipart/form-data (file + fields).
 */
export const createProjectMultipartBodyJsonSchema = {
  type: 'object',
  required: ['file', ...formRequired],
  properties: {
    file: {
      type: 'string',
      contentEncoding: 'binary',
      description: 'Comic book PDF file',
    },
    ...formProperties,
  },
} as const;

export const createProjectResponseJsonSchema = projectJsonSchema;
