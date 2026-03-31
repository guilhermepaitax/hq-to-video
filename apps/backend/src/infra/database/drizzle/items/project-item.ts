import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';

import { Project } from '@application/entities/project';
import { projects } from '@infra/database/drizzle/schema';

export type ProjectRow = InferSelectModel<typeof projects>;
export type ProjectInsert = InferInsertModel<typeof projects>;

export function projectFromDrizzle(project: ProjectRow): Project {
  return new Project({
    id: project.id,
    title: project.title,
    pdfUrl: project.pdfUrl,
    startPage: project.startPage,
    endPage: project.endPage,
    creativeBrief: project.creativeBrief ?? null,
    status: project.status as Project.Status,
    errorMessage: project.errorMessage ?? null,
    videoUrl: project.videoUrl ?? null,
    duration: project.duration ?? null,
    formatSize: project.formatSize as Project.FormatSize,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
  });
}
