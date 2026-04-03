import type { Controller } from '@application/contracts/Controller';
import { BadRequestError } from '@application/errors/http/BadRequestError';
import { Registry } from '@kernel/di/registry';
import { formatError } from '@main/utils/format-error';
import { normalizeQuery } from '@main/utils/normalize-query';

import type { Constructor } from '@shared/types/Constructor';
import type { FastifyReply, FastifyRequest } from 'fastify';

type AnyController = Controller<unknown, unknown>;

function multipartBodyFromRequest(
  request: FastifyRequest,
): Record<string, unknown> {
  if (!request.isMultipart()) {
    throw new BadRequestError('Content-Type must be multipart/form-data');
  }

  const { body } = request;
  if (body === null || typeof body !== 'object' || Array.isArray(body)) {
    throw new BadRequestError('Invalid multipart body');
  }

  return { ...(body as Record<string, unknown>) };
}

export function fastifyMultipartAdapter(
  ControllerClass: Constructor<AnyController>,
) {
  return async (
    request: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> => {
    try {
      const controller = Registry.getInstance().resolve(ControllerClass);

      const response = await controller.execute({
        body: multipartBodyFromRequest(request),
        params: (request.params ?? {}) as Record<string, string>,
        queryParams: normalizeQuery(request.query),
      });

      await reply.status(response.statusCode).send(response.body);
    } catch (err: unknown) {
      const { statusCode, body } = formatError(err);
      await reply.status(statusCode).send(body);
    }
  };
}
