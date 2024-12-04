CREATE TABLE IF NOT EXISTS "prize" (
	"id" serial PRIMARY KEY NOT NULL,
	"text" text NOT NULL,
	"position" integer NOT NULL,
	"category_id" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
