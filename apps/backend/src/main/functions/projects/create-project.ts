import { CreateProjectController } from '@application/controllers/projects/create-project-controller';
import {
  createProjectRequestBodySchema,
  createProjectResponseSchema,
} from '@application/controllers/projects/schemas/create-project-schema';
import { errorResponseSchema } from '@application/controllers/shared/error-response-schema';
import { fastifyMultipartAdapter } from '@main/adapters/fastify-multipart-adapter';
import type { AppInstance } from '@main/types/fastify-app';

export async function createProjectRoute(app: AppInstance): Promise<void> {
  app.post('/projects', {
    schema: {
      tags: ['Projects'],
      summary: 'Create project with PDF upload',
      consumes: ['multipart/form-data'],
      body: createProjectRequestBodySchema,
      response: {
        201: createProjectResponseSchema,
        400: errorResponseSchema,
        500: errorResponseSchema,
      },
    },
    handler: fastifyMultipartAdapter(CreateProjectController),
  });
}
