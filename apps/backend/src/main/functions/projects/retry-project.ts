import { RetryProjectController } from '@application/controllers/projects/retry-project-controller';
import {
  retryProjectParamsSchema,
  retryProjectResponseSchema,
} from '@application/controllers/projects/schemas/retry-project-schema';
import { errorResponseSchema } from '@application/controllers/shared/error-response-schema';
import { fastifyHttpAdapter } from '@main/adapters/fastify-http-adapter';

import type { AppInstance } from '@main/types/fastify-app';

export async function retryProjectRoute(app: AppInstance): Promise<void> {
  app.post('/projects/:id/retry', {
    schema: {
      tags: ['Projects'],
      summary: 'Retry failed processing for a project',
      params: retryProjectParamsSchema,
      response: {
        200: retryProjectResponseSchema,
        400: errorResponseSchema,
        404: errorResponseSchema,
        500: errorResponseSchema,
        501: errorResponseSchema,
      },
    },
    handler: fastifyHttpAdapter(RetryProjectController),
  });
}
