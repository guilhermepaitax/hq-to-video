import 'reflect-metadata';
import type * as z from 'zod';

export const SCHEMA_METADATA_KEY = Symbol('schema');

/**
 * Attaches a Zod schema to a controller class for OpenAPI / validation metadata.
 */
export function Schema(schema: z.ZodType): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata(SCHEMA_METADATA_KEY, schema, target);
    return target;
  };
}

export function getControllerSchema(
  target: new (...args: never[]) => unknown,
): z.ZodType | undefined {
  const metadata = Reflect.getMetadata(SCHEMA_METADATA_KEY, target);
  return metadata as z.ZodType | undefined;
}
