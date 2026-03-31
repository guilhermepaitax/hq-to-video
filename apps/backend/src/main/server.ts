import cors from '@fastify/cors';
import multipart from '@fastify/multipart';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import Fastify from 'fastify';

import { registerHealthRoutes } from '@main/functions/health/get-health';

export async function buildServer() {
  const app = Fastify({ logger: true });

  await app.register(cors);

  await app.register(multipart);

  await app.register(swagger, {
    openapi: {
      openapi: '3.1.0',
      info: { title: 'Heroic Vision API', version: '1.0.0' },
      tags: [{ name: 'Projects' }, { name: 'Queue' }, { name: 'Dashboard' }],
    },
  });

  await app.register(swaggerUi, {
    routePrefix: '/docs',
  });

  await app.register(async (instance) => {
    await registerHealthRoutes(instance);
  });

  return app;
}
