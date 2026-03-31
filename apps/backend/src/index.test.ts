import assert from 'node:assert/strict';
import test from 'node:test';

import { env } from './shared/config/env';

test('env has default port', () => {
  assert.ok(typeof env.port === 'number');
  assert.ok(env.port > 0);
});
