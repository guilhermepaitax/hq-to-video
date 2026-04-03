import { GetProjectByIdController } from '@application/controllers/projects/get-project-by-id-controller';
import {
  getProjectByIdParamsSchema,
  getProjectByIdResponseSchema,
} from '@application/controllers/projects/schemas/get-project-by-id-schema';
import { errorResponseSchema } from '@application/controllers/shared/error-response-schema';
import { fastifyHttpAdapter } from '@main/adapters/fastify-http-adapter';

import type { AppInstance } from '@main/types/fastify-app';

export async function getProjectByIdRoute(app: AppInstance): Promise<void> {
  app.get('/projects/:id', {
    schema: {
      tags: ['Projects'],
      summary: 'Get project details by id',
      params: getProjectByIdParamsSchema,
      response: {
        200: getProjectByIdResponseSchema,
        400: errorResponseSchema,
        404: errorResponseSchema,
        500: errorResponseSchema,
        501: errorResponseSchema,
      },
    },
    handler: fastifyHttpAdapter(GetProjectByIdController),
  });
}
