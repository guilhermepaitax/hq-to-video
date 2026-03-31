import type { FastifyInstance } from 'fastify';

import { PublishProjectController } from '@application/controllers/projects/publish-project-controller';
import {
  publishProjectParamsJsonSchema,
  publishProjectResponseJsonSchema,
} from '@application/controllers/projects/schemas/publish-project-schema';
import { errorResponseJsonSchema } from '@application/controllers/shared/error-response-schema';
import { fastifyHttpAdapter } from '@main/adapters/fastify-http-adapter';

export async function publishProjectRoute(app: FastifyInstance): Promise<void> {
  app.post('/projects/:id/publish', {
    schema: {
      tags: ['Projects'],
      summary: 'Start TikTok publish flow for completed video',
      params: publishProjectParamsJsonSchema,
      response: {
        200: publishProjectResponseJsonSchema,
        400: errorResponseJsonSchema,
        404: errorResponseJsonSchema,
        500: errorResponseJsonSchema,
        501: errorResponseJsonSchema,
      },
    },
    handler: fastifyHttpAdapter(PublishProjectController),
  });
}
