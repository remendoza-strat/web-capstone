ALTER TABLE "projects" ADD COLUMN "column_count" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "column_names" text[] NOT NULL;--> statement-breakpoint
ALTER TABLE "tasks" DROP COLUMN "column_count";