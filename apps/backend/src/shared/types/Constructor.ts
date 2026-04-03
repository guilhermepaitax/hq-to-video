/** Class constructor type for DI and adapters (supports decorated constructor injection). */
export type Constructor<T = unknown> = new (...args: any[]) => T;
