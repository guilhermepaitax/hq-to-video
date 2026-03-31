import type {
  Controller,
  ControllerRequest,
} from '@application/contracts/Controller';
import { Registry } from '@kernel/di/registry';
import { formatError } from '@main/utils/format-error';
import type { Constructor } from '@shared/types/Constructor';
import type { FastifyReply, FastifyRequest } from 'fastify';

function normalizeQuery(
  query: FastifyRequest['query'],
): Record<string, string> {
  const out: Record<string, string> = {};
  if (query === null || typeof query !== 'object') {
    return out;
  }
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined) continue;
    out[key] = Array.isArray(value) ? (value[0] ?? '') : String(value);
  }
  return out;
}

type AnyController = Controller<'public' | 'private', unknown>;

/**
 * Bridges Fastify to framework-agnostic controllers.
 */
export function fastifyHttpAdapter(
  ControllerClass: Constructor<AnyController>,
) {
  return async (
    request: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> => {
    try {
      const controller = Registry.getInstance().resolve(ControllerClass);

      const internalUser = (
        request as FastifyRequest & { user?: { internalId?: string } }
      ).user;

      const response = await controller.execute({
        body: request.body,
        params: (request.params ?? {}) as Record<string, string>,
        queryParams: normalizeQuery(request.query),
        accountId: internalUser?.internalId ?? null,
      } as ControllerRequest<'public' | 'private'>);

      await reply.status(response.statusCode).send(response.body);
    } catch (err: unknown) {
      const { statusCode, body } = formatError(err);
      await reply.status(statusCode).send(body);
    }
  };
}
