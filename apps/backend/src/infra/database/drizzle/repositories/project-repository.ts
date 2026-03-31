import { desc, eq } from 'drizzle-orm';

import type { ProjectRepository } from '@application/contracts/project-repository';

import { Project } from '@application/entities/project';
import { db } from '@infra/database/drizzle/client';
import { projectFromDrizzle } from '@infra/database/drizzle/items/project-item';
import { projects } from '@infra/database/drizzle/schema';
import { Injectable } from '@kernel/decorators/injectable';

@Injectable()
export class DrizzleProjectRepository implements ProjectRepository {
  async create(project: Project): Promise<Project> {
    const [row] = await db.insert(projects).values(project).returning();

    if (!row) {
      throw new Error('Failed to create project');
    }

    return projectFromDrizzle(row);
  }

  async findById(id: string): Promise<Project | null> {
    const [row] = await db
      .select()
      .from(projects)
      .where(eq(projects.id, id))
      .limit(1);

    if (!row) {
      return null;
    }

    return projectFromDrizzle(row);
  }

  async findAll(): Promise<Project[]> {
    const rows = await db
      .select()
      .from(projects)
      .orderBy(desc(projects.createdAt));

    return rows.map(projectFromDrizzle);
  }

  async updateStatus(
    input: ProjectRepository.UpdateStatusInput,
  ): Promise<void> {
    await db
      .update(projects)
      .set({
        status: input.status,
        errorMessage: input.errorMessage ?? null,
        updatedAt: new Date(),
      })
      .where(eq(projects.id, input.id));
  }

  async updateVideo(input: ProjectRepository.UpdateVideoInput): Promise<void> {
    await db
      .update(projects)
      .set({
        videoUrl: input.videoUrl,
        duration: input.duration,
        formatSize: input.formatSize,
        updatedAt: new Date(),
      })
      .where(eq(projects.id, input.id));
  }
}
