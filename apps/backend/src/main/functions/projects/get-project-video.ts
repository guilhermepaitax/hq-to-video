import type { FastifyInstance } from 'fastify';

import { GetProjectVideoController } from '@application/controllers/projects/get-project-video-controller';
import {
  getProjectVideoParamsJsonSchema,
  getProjectVideoResponse200BinarySchema,
} from '@application/controllers/projects/schemas/get-project-video-schema';
import { errorResponseJsonSchema } from '@application/controllers/shared/error-response-schema';
import { fastifyHttpAdapter } from '@main/adapters/fastify-http-adapter';

export async function getProjectVideoRoute(app: FastifyInstance): Promise<void> {
  app.get('/projects/:id/video', {
    schema: {
      tags: ['Projects'],
      summary: 'Stream or download generated project video',
      params: getProjectVideoParamsJsonSchema,
      produces: ['video/mp4'],
      response: {
        200: getProjectVideoResponse200BinarySchema,
        400: errorResponseJsonSchema,
        404: errorResponseJsonSchema,
        500: errorResponseJsonSchema,
        501: errorResponseJsonSchema,
      },
    },
    handler: fastifyHttpAdapter(GetProjectVideoController),
  });
}
