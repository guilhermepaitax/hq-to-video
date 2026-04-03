import { GetProjectVideoController } from '@application/controllers/projects/get-project-video-controller';
import {
  getProjectVideoParamsSchema,
  getProjectVideoResponse200Schema,
} from '@application/controllers/projects/schemas/get-project-video-schema';
import { errorResponseSchema } from '@application/controllers/shared/error-response-schema';
import { fastifyHttpAdapter } from '@main/adapters/fastify-http-adapter';

import type { AppInstance } from '@main/types/fastify-app';

export async function getProjectVideoRoute(app: AppInstance): Promise<void> {
  app.get('/projects/:id/video', {
    schema: {
      tags: ['Projects'],
      summary: 'Stream or download generated project video',
      params: getProjectVideoParamsSchema,
      produces: ['video/mp4'],
      response: {
        200: getProjectVideoResponse200Schema,
        400: errorResponseSchema,
        404: errorResponseSchema,
        500: errorResponseSchema,
        501: errorResponseSchema,
      },
    },
    handler: fastifyHttpAdapter(GetProjectVideoController),
  });
}
