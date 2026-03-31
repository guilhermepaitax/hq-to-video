/**
 * Base class for domain / application-level errors.
 */
export class ApplicationError extends Error {
  constructor(
    message: string,
    options?: ErrorOptions,
  ) {
    super(message, options);
    this.name = 'ApplicationError';
  }
}
