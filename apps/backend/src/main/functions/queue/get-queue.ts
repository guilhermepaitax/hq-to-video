import { GetQueueController } from '@application/controllers/queue/get-queue-controller';
import { queueStatusSchema } from '@application/controllers/queue/schemas/queue-status-schema';
import { errorResponseSchema } from '@application/controllers/shared/error-response-schema';
import { fastifyHttpAdapter } from '@main/adapters/fastify-http-adapter';

import type { AppInstance } from '@main/types/fastify-app';

export async function getQueueRoute(app: AppInstance): Promise<void> {
  app.get('/queue', {
    schema: {
      tags: ['Queue'],
      summary: 'Get processing queue status and items',
      response: {
        200: queueStatusSchema,
        500: errorResponseSchema,
        501: errorResponseSchema,
      },
    },
    handler: fastifyHttpAdapter(GetQueueController),
  });
}
