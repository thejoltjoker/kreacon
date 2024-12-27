ALTER TYPE "public"."media_type" ADD VALUE 'archive';--> statement-breakpoint
ALTER TABLE "event" ADD COLUMN "tagline" varchar(255) NOT NULL;