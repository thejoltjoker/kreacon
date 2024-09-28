ALTER TABLE "tickets" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "tickets" DROP COLUMN IF EXISTS "content";