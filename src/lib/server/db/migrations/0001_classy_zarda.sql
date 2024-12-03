CREATE TABLE IF NOT EXISTS "categories_to_rules" (
	"category_id" integer NOT NULL,
	"rule_id" integer NOT NULL,
	CONSTRAINT "categories_to_rules_rule_id_category_id_pk" PRIMARY KEY("rule_id","category_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "rule" (
	"id" serial PRIMARY KEY NOT NULL,
	"text" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "category" ALTER COLUMN "description" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "category" ALTER COLUMN "description" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "category" ALTER COLUMN "media_type" SET NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "categories_to_rules" ADD CONSTRAINT "categories_to_rules_category_id_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."category"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "categories_to_rules" ADD CONSTRAINT "categories_to_rules_rule_id_rule_id_fk" FOREIGN KEY ("rule_id") REFERENCES "public"."rule"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
