export type ControllerRequest<TBody = unknown> = {
  body: TBody;
  params: Record<string, string>;
  queryParams: Record<string, string>;
};

export type ControllerResponse<TBody = unknown> = {
  statusCode: number;
  body: TBody;
};

export abstract class Controller<TBody, TResponse> {
  async execute(
    req: ControllerRequest<TBody>,
  ): Promise<ControllerResponse<TResponse>> {
    return this.handle(req);
  }

  protected abstract handle(
    req: ControllerRequest<TBody>,
  ): Promise<ControllerResponse<TResponse>>;
}
