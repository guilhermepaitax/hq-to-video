import { Project } from '@application/entities/project';
import { BadRequestError } from '@application/errors/http/BadRequestError';
import { DrizzleProjectRepository } from '@infra/database/drizzle/repositories/project-repository';
import { R2StorageGateway } from '@infra/gateways/storage/r2-storage-gateway';
import { Injectable } from '@kernel/decorators/injectable';

@Injectable()
export class CreateProjectUsecase {
  constructor(
    private readonly projectRepository: DrizzleProjectRepository,
    private readonly storageGateway: R2StorageGateway,
  ) {}

  async execute(
    input: CreateProjectUsecase.Input,
  ): Promise<CreateProjectUsecase.Output> {
    if (input.startPage >= input.endPage) {
      throw new BadRequestError('startPage must be less than endPage');
    }

    const project = new Project({
      title: input.title,
      startPage: input.startPage,
      endPage: input.endPage,
      creativeBrief: input.creativeBrief,
      status: Project.Status.PROCESSING,
    });

    const pdfUrl = await this.storageGateway.savePdf(project.id, input.file);

    project.pdfUrl = pdfUrl;

    const created = await this.projectRepository.create(project);

    return { project: created };
  }
}

export namespace CreateProjectUsecase {
  export type Input = {
    file: Buffer;
    title: string;
    startPage: number;
    endPage: number;
    creativeBrief?: string;
  };

  export type Output = { project: Project };
}
