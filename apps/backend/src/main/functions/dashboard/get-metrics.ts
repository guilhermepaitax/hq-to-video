import type { FastifyInstance } from 'fastify';

import { GetMetricsController } from '@application/controllers/dashboard/get-metrics-controller';
import { dashboardMetricsJsonSchema } from '@application/controllers/dashboard/schemas/dashboard-metrics-schema';
import { errorResponseJsonSchema } from '@application/controllers/shared/error-response-schema';
import { fastifyHttpAdapter } from '@main/adapters/fastify-http-adapter';

export async function getDashboardMetricsRoute(
  app: FastifyInstance,
): Promise<void> {
  app.get('/dashboard/metrics', {
    schema: {
      tags: ['Dashboard'],
      summary: 'Get dashboard aggregate metrics',
      response: {
        200: dashboardMetricsJsonSchema,
        500: errorResponseJsonSchema,
        501: errorResponseJsonSchema,
      },
    },
    handler: fastifyHttpAdapter(GetMetricsController),
  });
}
