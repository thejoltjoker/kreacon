ALTER TABLE "category" ALTER COLUMN "name" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "category" ALTER COLUMN "slug" SET DATA TYPE varchar(300);--> statement-breakpoint
ALTER TABLE "event" ALTER COLUMN "description" SET NOT NULL;--> statement-breakpoint
CREATE INDEX "events_search_idx" ON "event" USING gin (to_tsvector('english', "name" || ' ' || "description"));