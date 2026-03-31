import { ApplicationError } from '@application/errors/application/ApplicationError';

export class UnprocessableEntityError extends ApplicationError {
  readonly statusCode = 422;

  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = 'UnprocessableEntity';
  }
}
