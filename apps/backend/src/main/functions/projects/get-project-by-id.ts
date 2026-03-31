import type { FastifyInstance } from 'fastify';

import { GetProjectByIdController } from '@application/controllers/projects/get-project-by-id-controller';
import {
  getProjectByIdParamsJsonSchema,
  getProjectByIdResponseJsonSchema,
} from '@application/controllers/projects/schemas/get-project-by-id-schema';
import { errorResponseJsonSchema } from '@application/controllers/shared/error-response-schema';
import { fastifyHttpAdapter } from '@main/adapters/fastify-http-adapter';

export async function getProjectByIdRoute(app: FastifyInstance): Promise<void> {
  app.get('/projects/:id', {
    schema: {
      tags: ['Projects'],
      summary: 'Get project details by id',
      params: getProjectByIdParamsJsonSchema,
      response: {
        200: getProjectByIdResponseJsonSchema,
        400: errorResponseJsonSchema,
        404: errorResponseJsonSchema,
        500: errorResponseJsonSchema,
        501: errorResponseJsonSchema,
      },
    },
    handler: fastifyHttpAdapter(GetProjectByIdController),
  });
}
