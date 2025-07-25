ALTER TABLE "tasks" ALTER COLUMN "priority" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."priority";--> statement-breakpoint
CREATE TYPE "public"."priority" AS ENUM('Low', 'Medium', 'High');--> statement-breakpoint
ALTER TABLE "tasks" ALTER COLUMN "priority" SET DATA TYPE "public"."priority" USING "priority"::"public"."priority";--> statement-breakpoint
ALTER TABLE "project_members" ALTER COLUMN "role" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."role";--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('Viewer', 'Project Manager', 'Developer', 'Designer', 'QA Engineer');--> statement-breakpoint
ALTER TABLE "project_members" ALTER COLUMN "role" SET DATA TYPE "public"."role" USING "role"::"public"."role";