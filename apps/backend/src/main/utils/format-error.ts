import { ApplicationError } from '@application/errors/application/ApplicationError';
import { BadRequestError } from '@application/errors/http/BadRequestError';
import { NotFoundError } from '@application/errors/http/NotFoundError';
import { UnprocessableEntityError } from '@application/errors/http/UnprocessableEntityError';

export type StandardErrorBody = {
  error: string;
  message: string;
};

export function formatError(err: unknown): {
  statusCode: number;
  body: StandardErrorBody;
} {
  if (err instanceof BadRequestError) {
    return {
      statusCode: err.statusCode,
      body: { error: err.name, message: err.message },
    };
  }
  if (err instanceof NotFoundError) {
    return {
      statusCode: err.statusCode,
      body: { error: err.name, message: err.message },
    };
  }
  if (err instanceof UnprocessableEntityError) {
    return {
      statusCode: err.statusCode,
      body: { error: err.name, message: err.message },
    };
  }
  if (err instanceof ApplicationError) {
    return {
      statusCode: 500,
      body: { error: 'InternalError', message: err.message },
    };
  }
  if (err instanceof Error) {
    return {
      statusCode: 500,
      body: { error: 'InternalError', message: err.message },
    };
  }
  return {
    statusCode: 500,
    body: { error: 'InternalError', message: 'Unknown error' },
  };
}
