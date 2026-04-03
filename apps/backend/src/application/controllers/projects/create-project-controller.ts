import {
  Controller,
  type ControllerRequest,
  type ControllerResponse,
} from '@application/contracts/Controller';
import { BadRequestError } from '@application/errors/http/BadRequestError';
import { CreateProjectUsecase } from '@application/usecases/projects/create-project-usecase';
import { Injectable } from '@kernel/decorators/injectable';
import { Schema } from '@kernel/decorators/schema';

import {
  createProjectRequestBodySchema,
} from './schemas/create-project-schema';

export type CreateProjectRequestBody = {
  file: Buffer;
  title: string;
  startPage: number;
  endPage: number;
  creativeBrief?: string;
};

@Injectable()
@Schema(createProjectRequestBodySchema)
export class CreateProjectController extends Controller<
  CreateProjectRequestBody,
  CreateProjectController.Response
> {
  constructor(private readonly createProjectUsecase: CreateProjectUsecase) {
    super();
  }

  protected override async handle(
    request: ControllerRequest<CreateProjectRequestBody>,
  ): Promise<ControllerResponse<CreateProjectController.Response>> {
    const parsed = createProjectRequestBodySchema.safeParse(request.body);
    if (!parsed.success) {
      throw new BadRequestError(parsed.error.message);
    }
    const body = parsed.data;

    const { project } = await this.createProjectUsecase.execute({
      file: body.file,
      title: body.title,
      startPage: body.startPage,
      endPage: body.endPage,
      creativeBrief: body.creativeBrief,
    });

    const createdAt = project.createdAt ?? new Date();
    const updatedAt = project.updatedAt ?? createdAt;

    return {
      statusCode: 201,
      body: {
        project: {
          id: project.id,
          title: project.title,
          pdfUrl: project.pdfUrl,
          startPage: project.startPage,
          endPage: project.endPage,
          creativeBrief: project.creativeBrief ?? null,
          status: project.status,
          errorMessage: project.errorMessage ?? null,
          videoUrl: project.videoUrl ?? null,
          duration: project.duration ?? null,
          formatSize: project.formatSize,
          createdAt: createdAt.toISOString(),
          updatedAt: updatedAt.toISOString(),
        },
      },
    };
  }
}

export namespace CreateProjectController {
  export type Response = {
    project: {
      id: string;
      title: string;
      pdfUrl?: string | null;
      startPage: number;
      endPage: number;
      creativeBrief: string | null;
      status: string;
      errorMessage: string | null;
      videoUrl: string | null;
      duration: number | null;
      formatSize: string;
      createdAt: string;
      updatedAt: string;
    };
  };
}
