import type { FastifyInstance } from 'fastify';

import { GetHealthController } from '@application/controllers/health/get-health-controller';
import { getHealthResponseJsonSchema } from '@application/controllers/health/schemas/get-health-schema';
import { fastifyHttpAdapter } from '@main/adapters/fastify-http-adapter';

export async function registerHealthRoutes(
  app: FastifyInstance,
): Promise<void> {
  app.get('/health', {
    schema: {
      tags: ['Health'],
      summary: 'Health check',
      response: {
        200: getHealthResponseJsonSchema,
      },
    },
    handler: fastifyHttpAdapter(GetHealthController),
  });
}
