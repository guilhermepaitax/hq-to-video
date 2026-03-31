import { type Project } from '@application/entities/project';

export interface ProjectRepository {
  create(project: Project): Promise<Project>;

  findById(id: string): Promise<Project | null>;

  findAll(): Promise<Project[]>;

  updateStatus(input: ProjectRepository.UpdateStatusInput): Promise<void>;

  updateVideo(input: ProjectRepository.UpdateVideoInput): Promise<void>;
}

export namespace ProjectRepository {
  export type UpdateStatusInput = {
    id: string;
    status: Project.Status;
    errorMessage?: string;
  };

  export type UpdateVideoInput = {
    id: string;
    videoUrl: string;
    duration: number;
    formatSize: Project.FormatSize;
  };
}
