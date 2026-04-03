import { GetHealthController } from '@application/controllers/health/get-health-controller';
import { getHealthResponseSchema } from '@application/controllers/health/schemas/get-health-schema';
import { fastifyHttpAdapter } from '@main/adapters/fastify-http-adapter';

import type { AppInstance } from '@main/types/fastify-app';

export async function registerHealthRoutes(app: AppInstance): Promise<void> {
  app.get('/health', {
    schema: {
      tags: ['Health'],
      summary: 'Health check',
      response: {
        200: getHealthResponseSchema,
      },
    },
    handler: fastifyHttpAdapter(GetHealthController),
  });
}
