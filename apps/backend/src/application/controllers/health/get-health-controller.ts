import {
  Controller,
  type ControllerRequest,
  type ControllerResponse,
} from '@application/contracts/Controller';
import { Injectable } from '@kernel/decorators/injectable';

@Injectable()
export class GetHealthController extends Controller<
  'public',
  { status: string }
> {
  protected override async handle(
    request: ControllerRequest<'public'>,
  ): Promise<ControllerResponse<{ status: string }>> {
    void request;
    return {
      statusCode: 200,
      body: { status: 'ok' },
    };
  }
}
