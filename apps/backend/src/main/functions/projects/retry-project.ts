import type { FastifyInstance } from 'fastify';

import { RetryProjectController } from '@application/controllers/projects/retry-project-controller';
import {
  retryProjectParamsJsonSchema,
  retryProjectResponseJsonSchema,
} from '@application/controllers/projects/schemas/retry-project-schema';
import { errorResponseJsonSchema } from '@application/controllers/shared/error-response-schema';
import { fastifyHttpAdapter } from '@main/adapters/fastify-http-adapter';

export async function retryProjectRoute(app: FastifyInstance): Promise<void> {
  app.post('/projects/:id/retry', {
    schema: {
      tags: ['Projects'],
      summary: 'Retry failed processing for a project',
      params: retryProjectParamsJsonSchema,
      response: {
        200: retryProjectResponseJsonSchema,
        400: errorResponseJsonSchema,
        404: errorResponseJsonSchema,
        500: errorResponseJsonSchema,
        501: errorResponseJsonSchema,
      },
    },
    handler: fastifyHttpAdapter(RetryProjectController),
  });
}
