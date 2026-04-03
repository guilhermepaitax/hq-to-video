import { PublishProjectController } from '@application/controllers/projects/publish-project-controller';
import {
  publishProjectParamsSchema,
  publishProjectResponseSchema,
} from '@application/controllers/projects/schemas/publish-project-schema';
import { errorResponseSchema } from '@application/controllers/shared/error-response-schema';
import { fastifyHttpAdapter } from '@main/adapters/fastify-http-adapter';

import type { AppInstance } from '@main/types/fastify-app';

export async function publishProjectRoute(app: AppInstance): Promise<void> {
  app.post('/projects/:id/publish', {
    schema: {
      tags: ['Projects'],
      summary: 'Start TikTok publish flow for completed video',
      params: publishProjectParamsSchema,
      response: {
        200: publishProjectResponseSchema,
        400: errorResponseSchema,
        404: errorResponseSchema,
        500: errorResponseSchema,
        501: errorResponseSchema,
      },
    },
    handler: fastifyHttpAdapter(PublishProjectController),
  });
}
