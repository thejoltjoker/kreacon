ALTER TABLE "tickets" ALTER COLUMN "id" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "tickets" DROP COLUMN IF EXISTS "content";