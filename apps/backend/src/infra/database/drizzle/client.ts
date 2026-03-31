import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import * as schema from '@infra/database/drizzle/schema';
import { env } from '@shared/config/env';

const client = postgres(env.databaseUrl);

export const db = drizzle(client, { schema });
