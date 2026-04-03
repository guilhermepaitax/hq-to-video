import cors from '@fastify/cors';
import multipart from '@fastify/multipart';
import swagger from '@fastify/swagger';
import ScalarApiReference from '@scalar/fastify-api-reference';
import Fastify from 'fastify';
import {
  createJsonSchemaTransform,
  hasZodFastifySchemaValidationErrors,
  isResponseSerializationError,
  serializerCompiler,
  type ZodTypeProvider,
  validatorCompiler,
} from 'fastify-type-provider-zod';
import pretty from 'pino-pretty';

import { getDashboardMetricsRoute } from '@main/functions/dashboard/get-metrics';
import { registerHealthRoutes } from '@main/functions/health/get-health';
import { createProjectRoute } from '@main/functions/projects/create-project';
import { getProjectByIdRoute } from '@main/functions/projects/get-project-by-id';
import { getProjectVideoRoute } from '@main/functions/projects/get-project-video';
import { listProjectsRoute } from '@main/functions/projects/list-projects';
import { publishProjectRoute } from '@main/functions/projects/publish-project';
import { retryProjectRoute } from '@main/functions/projects/retry-project';
import { getQueueRoute } from '@main/functions/queue/get-queue';
import type { AppInstance } from '@main/types/fastify-app';
import { env } from '@shared/config/env';

const MAX_UPLOAD_BYTES = 150 * 1024 * 1024;

const loggerStream = pretty({
  colorize: true,
});

export async function buildServer(): Promise<AppInstance> {
  const app = Fastify({
    logger: {
      level: env.nodeEnv === 'production' ? 'info' : 'debug',
      stream: loggerStream,
    },
  }).withTypeProvider<ZodTypeProvider>();

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  app.setErrorHandler((err, request, reply) => {
    if (hasZodFastifySchemaValidationErrors(err)) {
      return reply.status(400).send({
        error: 'BadRequest',
        message: err.message,
      });
    }
    if (isResponseSerializationError(err)) {
      request.log.error({ err }, 'response_serialization_failed');
      return reply.status(500).send({
        error: 'InternalError',
        message: 'Internal server error',
      });
    }
    throw err;
  });

  await app.register(cors);

  await app.register(multipart, {
    limits: { fileSize: MAX_UPLOAD_BYTES },
    attachFieldsToBody: 'keyValues',
  });

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
    transform: createJsonSchemaTransform({
      zodToJsonConfig: { target: 'draft-2020-12' },
    }),
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
