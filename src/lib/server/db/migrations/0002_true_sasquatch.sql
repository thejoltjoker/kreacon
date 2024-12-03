ALTER TABLE "event" ADD COLUMN "slug" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "event" ADD CONSTRAINT "event_slug_unique" UNIQUE("slug");