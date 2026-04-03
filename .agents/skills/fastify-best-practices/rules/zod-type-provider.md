---
name: zod-type-provider
description: Zod 4 + fastify-type-provider-zod for validation, serialization, and OpenAPI with Fastify 5
metadata:
  tags: fastify, zod, validation, openapi, swagger
---

# Zod type provider (Fastify 5)

This repository’s backend uses **Zod 4** with **fastify-type-provider-zod** so route `schema` options accept Zod schemas directly (no hand-written JSON Schema conversion at call sites).

## Dependencies

- `fastify` ^5.5+
- `zod` ^4.1.5+ (peer of `fastify-type-provider-zod` 6.x)
- `fastify-type-provider-zod` ^6.x
- `openapi-types` (peer; install in the app)
- `@fastify/swagger` ^9.5.1+

## Bootstrap

Set compilers on the Fastify instance, then narrow the instance with `withTypeProvider<ZodTypeProvider>()`:

```typescript
import Fastify from 'fastify';
import fastifySwagger from '@fastify/swagger';
import {
  createJsonSchemaTransform,
  serializerCompiler,
  type ZodTypeProvider,
  validatorCompiler,
} from 'fastify-type-provider-zod';

const app = Fastify({ logger: true }).withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

await app.register(fastifySwagger, {
  openapi: {
    openapi: '3.1.0',
    info: { title: 'API', version: '1.0.0' },
  },
  transform: createJsonSchemaTransform({
    zodToJsonConfig: { target: 'draft-2020-12' },
  }),
});
```

For OpenAPI **3.0.x** documents, use `createJsonSchemaTransform({ zodToJsonConfig: { target: 'openapi-3.0' } })` instead.

## Routes

Use Zod for `body`, `params`, `querystring`, `headers`, and `response` status codes:

```typescript
import { z } from 'zod';

app.post('/items', {
  schema: {
    body: z.object({ name: z.string().min(1) }),
    response: {
      201: z.object({ id: z.string(), name: z.string() }),
      400: z.object({ error: z.string(), message: z.string() }),
    },
  },
  handler: async (request, reply) => {
    reply.code(201);
    return { id: '1', name: request.body.name };
  },
});
```

## Plugins

Prefer the typed plugin types from the package when registering route modules:

```typescript
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';

const itemsPlugin: FastifyPluginAsyncZod = async function (fastify) {
  fastify.get('/', {
    schema: {
      response: { 200: z.array(z.string()) },
    },
    handler: async () => [],
  });
};
```

## Validation and response errors

Map framework validation failures to API-friendly bodies:

```typescript
import {
  hasZodFastifySchemaValidationErrors,
  isResponseSerializationError,
} from 'fastify-type-provider-zod';

app.setErrorHandler((err, request, reply) => {
  if (hasZodFastifySchemaValidationErrors(err)) {
    return reply.status(400).send({
      error: 'BadRequest',
      message: err.message,
    });
  }
  if (isResponseSerializationError(err)) {
    request.log.error({ err }, 'response_serialization_failed');
    return reply.status(500).send({
      error: 'InternalError',
      message: 'Internal server error',
    });
  }
  throw err;
});
```

## OpenAPI extras

- Optional **schema refs**: register schemas with Zod’s global registry and set `transformObject: jsonSchemaTransformObject` on `@fastify/swagger` (see package README).
- Use **`.describe()`** on Zod fields for richer documentation.

## Zod 4 notes

- Prefer **`z.iso.datetime()`** over deprecated `z.string().datetime()`.
- **`z.coerce.*`** lives under **`z.coerce`** (e.g. `z.coerce.number()`).
