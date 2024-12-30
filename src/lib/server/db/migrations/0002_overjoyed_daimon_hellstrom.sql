ALTER TABLE "entry" ALTER COLUMN "thumbnail_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "entry" ALTER COLUMN "preview_id" SET NOT NULL;