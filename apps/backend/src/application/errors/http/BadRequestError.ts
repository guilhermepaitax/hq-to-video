import { ApplicationError } from '@application/errors/application/ApplicationError';

export class BadRequestError extends ApplicationError {
  readonly statusCode = 400;

  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = 'BadRequest';
  }
}
