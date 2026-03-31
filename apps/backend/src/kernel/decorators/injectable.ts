import { Registry } from '@kernel/di/registry';
import type { Constructor } from '@shared/types/Constructor';

export const INJECTABLE_METADATA_KEY = Symbol('injectable');

/**
 * Marks a class as available for the DI container.
 */
export function Injectable(): ClassDecorator {
  return (target: unknown) => {
    Registry.getInstance().register(target as Constructor);
  };
}
