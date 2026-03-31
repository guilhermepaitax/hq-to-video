import {
  Controller,
  type ControllerRequest,
  type ControllerResponse,
} from '@application/contracts/Controller';
import { Injectable } from '@kernel/decorators/injectable';

@Injectable()
export class GetMetricsController extends Controller<'public', unknown> {
  protected override async handle(
    request: ControllerRequest<'public'>,
  ): Promise<ControllerResponse<unknown>> {
    void request;
    return {
      statusCode: 501,
      body: {
        error: 'NotImplemented',
        message: 'Get dashboard metrics is not implemented yet.',
      },
    };
  }
}
