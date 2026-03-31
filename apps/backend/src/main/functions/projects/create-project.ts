import type { FastifyInstance } from 'fastify';

import { CreateProjectController } from '@application/controllers/projects/create-project-controller';
import {
  createProjectMultipartBodyJsonSchema,
  createProjectResponseJsonSchema,
} from '@application/controllers/projects/schemas/create-project-schema';
import { errorResponseJsonSchema } from '@application/controllers/shared/error-response-schema';
import { fastifyHttpAdapter } from '@main/adapters/fastify-http-adapter';

export async function createProjectRoute(app: FastifyInstance): Promise<void> {
  app.post('/projects', {
    schema: {
      tags: ['Projects'],
      summary: 'Create project with PDF upload',
      consumes: ['multipart/form-data'],
      body: createProjectMultipartBodyJsonSchema,
      response: {
        201: createProjectResponseJsonSchema,
        400: errorResponseJsonSchema,
        500: errorResponseJsonSchema,
        501: errorResponseJsonSchema,
      },
    },
    handler: fastifyHttpAdapter(CreateProjectController),
  });
}
