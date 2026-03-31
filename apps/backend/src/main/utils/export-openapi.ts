import { writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import type { FastifyInstance } from 'fastify';

const __dirname = dirname(fileURLToPath(import.meta.url));

const OUT_PATH = resolve(__dirname, '../../../../../docs/openapi.json');

export async function exportOpenApi(app: FastifyInstance): Promise<void> {
  const spec = app.swagger();
  writeFileSync(OUT_PATH, `${JSON.stringify(spec, null, 2)}\n`);

  app.log.info(`OpenAPI spec exported to ${OUT_PATH}`);
}
