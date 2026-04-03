import { GetMetricsController } from '@application/controllers/dashboard/get-metrics-controller';
import { dashboardMetricsSchema } from '@application/controllers/dashboard/schemas/dashboard-metrics-schema';
import { errorResponseSchema } from '@application/controllers/shared/error-response-schema';
import { fastifyHttpAdapter } from '@main/adapters/fastify-http-adapter';
import type { AppInstance } from '@main/types/fastify-app';

export async function getDashboardMetricsRoute(
  app: AppInstance,
): Promise<void> {
  app.get('/dashboard/metrics', {
    schema: {
      tags: ['Dashboard'],
      summary: 'Get dashboard aggregate metrics',
      response: {
        200: dashboardMetricsSchema,
        500: errorResponseSchema,
        501: errorResponseSchema,
      },
    },
    handler: fastifyHttpAdapter(GetMetricsController),
  });
}
