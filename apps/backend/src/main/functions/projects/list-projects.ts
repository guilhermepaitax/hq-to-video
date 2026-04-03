import { ListProjectsController } from '@application/controllers/projects/list-projects-controller';
import { listProjectsResponseSchema } from '@application/controllers/projects/schemas/list-projects-schema';
import { errorResponseSchema } from '@application/controllers/shared/error-response-schema';
import { fastifyHttpAdapter } from '@main/adapters/fastify-http-adapter';

import type { AppInstance } from '@main/types/fastify-app';

export async function listProjectsRoute(app: AppInstance): Promise<void> {
  app.get('/projects', {
    schema: {
      tags: ['Projects'],
      summary: 'List all projects with processing status',
      response: {
        200: listProjectsResponseSchema,
        500: errorResponseSchema,
        501: errorResponseSchema,
      },
    },
    handler: fastifyHttpAdapter(ListProjectsController),
  });
}
