ALTER TABLE "category" ADD COLUMN "slug" text NOT NULL;--> statement-breakpoint
ALTER TABLE "category" ADD CONSTRAINT "category_slug_unique" UNIQUE("slug");