import { z } from 'zod';

export const schema = z.object({
  nodeEnv: z.enum(['development', 'production', 'test']),
  port: z.coerce.number().int().positive(),
  databaseUrl: z.string().min(1, 'DATABASE_URL is required'),
  r2AccountId: z.string().min(1),
  r2AccessKeyId: z.string().min(1),
  r2SecretAccessKey: z.string().min(1),
  r2Bucket: z.string().min(1),
  r2Endpoint: z.string().url().optional(),
});

export const env = schema.parse({
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: process.env.PORT ?? '3001',
  databaseUrl: process.env.DATABASE_URL,
  r2AccountId: process.env.R2_ACCOUNT_ID,
  r2AccessKeyId: process.env.R2_ACCESS_KEY_ID,
  r2SecretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  r2Bucket: process.env.R2_BUCKET,
  r2Endpoint: process.env.R2_ENDPOINT || undefined,
});
