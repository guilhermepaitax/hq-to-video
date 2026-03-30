import test from 'node:test';
import assert from 'node:assert/strict';
import { workspace } from './index.js';

test('workspace name', () => {
  assert.equal(workspace, 'render');
});
