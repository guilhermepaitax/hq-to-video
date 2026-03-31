import cors from '@fastify/cors';
import multipart from '@fastify/multipart';
import swagger from '@fastify/swagger';
import ScalarApiReference from '@scalar/fastify-api-reference';
import Fastify from 'fastify';

import { getDashboardMetricsRoute } from '@main/functions/dashboard/get-metrics';
import { registerHealthRoutes } from '@main/functions/health/get-health';
import { createProjectRoute } from '@main/functions/projects/create-project';
import { getProjectByIdRoute } from '@main/functions/projects/get-project-by-id';
import { getProjectVideoRoute } from '@main/functions/projects/get-project-video';
import { listProjectsRoute } from '@main/functions/projects/list-projects';
import { publishProjectRoute } from '@main/functions/projects/publish-project';
import { retryProjectRoute } from '@main/functions/projects/retry-project';
import { getQueueRoute } from '@main/functions/queue/get-queue';
import { env } from '@shared/config/env';

export async function buildServer() {
  const app = Fastify({ logger: true });

  await app.register(cors);

  await app.register(multipart);

  await app.register(swagger, {
    openapi: {
      openapi: '3.1.0',
      info: {
        title: 'Heroic Vision API',
        version: '1.0.0',
        license: { name: 'UNLICENSED' },
      },
      servers: [
        {
          url: `http://localhost:${env.port}`,
          description: 'Local development',
        },
      ],
      security: [],
      tags: [
        {
          name: 'Health',
          description: 'Service health checks',
        },
        {
          name: 'Projects',
          description: 'Project management and video pipeline',
        },
        {
          name: 'Queue',
          description: 'Processing queue status',
        },
        {
          name: 'Dashboard',
          description: 'Dashboard aggregate metrics',
        },
      ],
    },
  });

  await app.register(ScalarApiReference, {
    routePrefix: '/docs',
    configuration: {
      theme: 'kepler',
    },
  });

  await app.register(async (instance) => {
    await registerHealthRoutes(instance);
  });

  await app.register(
    async (instance) => {
      await createProjectRoute(instance);
      await listProjectsRoute(instance);
      await getProjectByIdRoute(instance);
      await getProjectVideoRoute(instance);
      await retryProjectRoute(instance);
      await publishProjectRoute(instance);
      await getQueueRoute(instance);
      await getDashboardMetricsRoute(instance);
    },
    { prefix: '/api' },
  );

  return app;
}
