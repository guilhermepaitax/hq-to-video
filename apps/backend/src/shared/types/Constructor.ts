/** Class constructor type for DI and adapters. */
export type Constructor<T = unknown> = new (...args: unknown[]) => T;
