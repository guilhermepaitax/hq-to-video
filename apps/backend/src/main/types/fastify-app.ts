import type {
  FastifyBaseLogger,
  FastifyInstance,
  RawServerDefault,
} from 'fastify';
import type {
  RawReplyDefaultExpression,
  RawRequestDefaultExpression,
} from 'fastify/types/utils';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';

export type AppInstance = FastifyInstance<
  RawServerDefault,
  RawRequestDefaultExpression<RawServerDefault>,
  RawReplyDefaultExpression<RawServerDefault>,
  FastifyBaseLogger,
  ZodTypeProvider
>;
