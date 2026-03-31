CREATE TYPE "public"."format_size" AS ENUM('VERTICAL', 'HORIZONTAL');--> statement-breakpoint
CREATE TYPE "public"."pipeline_step" AS ENUM('PDF_EXTRACTION', 'VISION_ANALYSIS', 'SCRIPT_GEN', 'TTS', 'RENDER');--> statement-breakpoint
CREATE TYPE "public"."project_status" AS ENUM('PROCESSING', 'COMPLETED', 'CANCELLED');--> statement-breakpoint
CREATE TABLE "processing_jobs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"current_step" "pipeline_step" NOT NULL,
	"progress" integer NOT NULL,
	"started_at" timestamp with time zone,
	"completed_at" timestamp with time zone,
	"error_details" text,
	"attempts" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"pdf_url" text NOT NULL,
	"start_page" integer NOT NULL,
	"end_page" integer NOT NULL,
	"creative_brief" text,
	"status" "project_status" NOT NULL,
	"error_message" text,
	"video_url" text,
	"duration" integer,
	"format_size" "format_size" DEFAULT 'VERTICAL' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "processing_jobs" ADD CONSTRAINT "processing_jobs_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;