ALTER TABLE "processing_jobs" DROP CONSTRAINT "processing_jobs_project_id_projects_id_fk";--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "id" SET DATA TYPE text USING id::text;--> statement-breakpoint
ALTER TABLE "processing_jobs" ALTER COLUMN "project_id" SET DATA TYPE text USING project_id::text;--> statement-breakpoint
ALTER TABLE "processing_jobs" ADD CONSTRAINT "processing_jobs_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
