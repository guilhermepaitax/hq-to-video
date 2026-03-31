/**
 * Framework-agnostic HTTP controller contract.
 */
export type ControllerRequest<
  TType extends 'public' | 'private' = 'public' | 'private',
  TBody = unknown,
> = {
  body: TBody;
  params: Record<string, string>;
  queryParams: Record<string, string>;
  accountId: TType extends 'public' ? null : string;
};

export type ControllerResponse<TBody = unknown> = {
  statusCode: number;
  body: TBody;
};

export abstract class Controller<
  TType extends 'public' | 'private',
  TResponse,
> {
  async execute(
    req: ControllerRequest<TType>,
  ): Promise<ControllerResponse<TResponse>> {
    return this.handle(req);
  }

  protected abstract handle(
    req: ControllerRequest<TType>,
  ): Promise<ControllerResponse<TResponse>>;
}
