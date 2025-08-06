ALTER TABLE "projects" DROP CONSTRAINT "projects_owner_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "project_members" ALTER COLUMN "role" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."role";--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('Project Manager', 'Frontend Developer', 'Backend Developer', 'Fullstack Developer', 'UI/UX Designer', 'QA Engineer', 'DevOps Engineer', 'Product Manager', 'Team Lead');--> statement-breakpoint
ALTER TABLE "project_members" ALTER COLUMN "role" SET DATA TYPE "public"."role" USING "role"::"public"."role";--> statement-breakpoint
ALTER TABLE "project_members" ADD COLUMN "approved" boolean NOT NULL;--> statement-breakpoint
ALTER TABLE "tasks" ADD COLUMN "column_count" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" DROP COLUMN "owner_id";