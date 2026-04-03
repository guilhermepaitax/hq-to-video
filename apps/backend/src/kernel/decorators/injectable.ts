import { Registry } from '@kernel/di/registry';
import type { Constructor } from '@shared/types/Constructor';

export function Injectable(): ClassDecorator {
  return (target: unknown) => {
    Registry.getInstance().register(target as Constructor);
  };
}
