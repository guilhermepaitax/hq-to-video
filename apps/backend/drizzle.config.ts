import { defineConfig } from 'drizzle-kit';
import { env } from './src/shared/config/env';

export default defineConfig({
  schema: './src/infra/database/drizzle/schema.ts',
  out: './src/infra/database/drizzle/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: env.databaseUrl,
  },
});
