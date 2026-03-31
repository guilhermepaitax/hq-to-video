import {
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';

export const projectStatusEnum = pgEnum('project_status', [
  'PROCESSING',
  'COMPLETED',
  'CANCELLED',
]);

export const pipelineStepEnum = pgEnum('pipeline_step', [
  'PDF_EXTRACTION',
  'VISION_ANALYSIS',
  'SCRIPT_GEN',
  'TTS',
  'RENDER',
]);

export const formatSizeEnum = pgEnum('format_size', ['VERTICAL', 'HORIZONTAL']);

export const projects = pgTable('projects', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  pdfUrl: text('pdf_url').notNull(),
  startPage: integer('start_page').notNull(),
  endPage: integer('end_page').notNull(),
  creativeBrief: text('creative_brief'),
  status: projectStatusEnum('status').notNull(),
  errorMessage: text('error_message'),
  videoUrl: text('video_url'),
  duration: integer('duration'),
  formatSize: formatSizeEnum('format_size').notNull().default('VERTICAL'),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const processingJobs = pgTable('processing_jobs', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id')
    .notNull()
    .references(() => projects.id, { onDelete: 'cascade' }),
  currentStep: pipelineStepEnum('current_step').notNull(),
  progress: integer('progress').notNull(),
  startedAt: timestamp('started_at', { withTimezone: true }),
  completedAt: timestamp('completed_at', { withTimezone: true }),
  errorDetails: text('error_details'),
  attempts: integer('attempts').notNull().default(0),
});
