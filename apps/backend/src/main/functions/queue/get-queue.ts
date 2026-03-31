import type { FastifyInstance } from 'fastify';

import { GetQueueController } from '@application/controllers/queue/get-queue-controller';
import { queueStatusJsonSchema } from '@application/controllers/queue/schemas/queue-status-schema';
import { errorResponseJsonSchema } from '@application/controllers/shared/error-response-schema';
import { fastifyHttpAdapter } from '@main/adapters/fastify-http-adapter';

export async function getQueueRoute(app: FastifyInstance): Promise<void> {
  app.get('/queue', {
    schema: {
      tags: ['Queue'],
      summary: 'Get processing queue status and items',
      response: {
        200: queueStatusJsonSchema,
        500: errorResponseJsonSchema,
        501: errorResponseJsonSchema,
      },
    },
    handler: fastifyHttpAdapter(GetQueueController),
  });
}
