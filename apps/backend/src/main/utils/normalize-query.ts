import type { FastifyRequest } from 'fastify';

export function normalizeQuery(
  query: FastifyRequest['query'],
): Record<string, string> {
  const out: Record<string, string> = {};
  if (query === null || typeof query !== 'object') {
    return out;
  }
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined) continue;
    out[key] = Array.isArray(value) ? (value[0] ?? '') : String(value);
  }
  return out;
}
