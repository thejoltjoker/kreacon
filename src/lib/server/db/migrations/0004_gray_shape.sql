ALTER TABLE "event_category" DROP CONSTRAINT "event_category_category_id_category_id_fk";
--> statement-breakpoint
ALTER TABLE "event_category" DROP CONSTRAINT "event_category_event_id_event_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "event_category" ADD CONSTRAINT "event_category_category_id_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."category"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "event_category" ADD CONSTRAINT "event_category_event_id_event_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."event"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
