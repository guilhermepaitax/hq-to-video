import 'reflect-metadata';

import { buildServer } from '../src/main/server';
import { exportOpenApi } from '../src/main/utils/export-openapi';

async function main(): Promise<void> {
  const app = await buildServer();
  await app.ready();
  await exportOpenApi(app);
  await app.close();
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
