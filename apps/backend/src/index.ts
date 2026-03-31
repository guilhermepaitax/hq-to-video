import 'reflect-metadata';

import { buildServer } from '@main/server';
import { exportOpenApi } from '@main/utils/export-openapi';
import { env } from '@shared/config/env';

const app = await buildServer();

await app.listen({ port: env.port, host: '0.0.0.0' });

if (env.nodeEnv !== 'production') {
  await app.ready();
  await exportOpenApi(app);
}
