import { ApplicationError } from '@application/errors/application/ApplicationError';

export class NotFoundError extends ApplicationError {
  readonly statusCode = 404;

  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = 'NotFound';
  }
}
