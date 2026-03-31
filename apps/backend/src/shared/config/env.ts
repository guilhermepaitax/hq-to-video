import { z } from 'zod';

export const schema = z.object({
  nodeEnv: z.enum(['development', 'production', 'test']),
  port: z.coerce.number().int().positive(),
  databaseUrl: z.string().min(1, 'DATABASE_URL is required'),
});

export const env = schema.parse({
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: process.env.PORT ?? '3001',
  databaseUrl: process.env.DATABASE_URL,
});
