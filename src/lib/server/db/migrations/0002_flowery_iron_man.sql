ALTER TABLE "file" ALTER COLUMN "size" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "file" ADD COLUMN "type" varchar(127) NOT NULL;--> statement-breakpoint
ALTER TABLE "file" ADD COLUMN "name" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "file" DROP COLUMN "category";--> statement-breakpoint
ALTER TABLE "file" DROP COLUMN "contentType";--> statement-breakpoint
ALTER TABLE "file" DROP COLUMN "container";--> statement-breakpoint
ALTER TABLE "file" DROP COLUMN "filename";