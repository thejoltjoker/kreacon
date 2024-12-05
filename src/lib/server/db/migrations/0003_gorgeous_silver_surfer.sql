ALTER TABLE "ticket" ALTER COLUMN "user_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "ticket" ALTER COLUMN "event_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "ticket" ADD CONSTRAINT "ticket_user_id_event_id_unique" UNIQUE("user_id","event_id");