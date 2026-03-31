import type { FastifyInstance } from 'fastify';

import { ListProjectsController } from '@application/controllers/projects/list-projects-controller';
import { listProjectsResponseJsonSchema } from '@application/controllers/projects/schemas/list-projects-schema';
import { errorResponseJsonSchema } from '@application/controllers/shared/error-response-schema';
import { fastifyHttpAdapter } from '@main/adapters/fastify-http-adapter';

export async function listProjectsRoute(app: FastifyInstance): Promise<void> {
  app.get('/projects', {
    schema: {
      tags: ['Projects'],
      summary: 'List all projects with processing status',
      response: {
        200: listProjectsResponseJsonSchema,
        500: errorResponseJsonSchema,
        501: errorResponseJsonSchema,
      },
    },
    handler: fastifyHttpAdapter(ListProjectsController),
  });
}
