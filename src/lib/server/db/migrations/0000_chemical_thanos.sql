CREATE TYPE "public"."mediaType" AS ENUM('image', 'video', 'audio');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('user', 'admin');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "account" (
	"user_id" uuid NOT NULL,
	"provider" varchar(255) NOT NULL,
	"provider_account_id" varchar NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "account_provider_provider_account_id_pk" PRIMARY KEY("provider","provider_account_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "category" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" varchar(512),
	"allowed_media_type" "mediaType",
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "categories_to_events" (
	"category_id" integer NOT NULL,
	"event_id" integer NOT NULL,
	CONSTRAINT "categories_to_events_event_id_category_id_pk" PRIMARY KEY("event_id","category_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "event" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" varchar(255),
	"submissions_open_at" timestamp NOT NULL,
	"submissions_close_at" timestamp NOT NULL,
	"voting_open_at" timestamp NOT NULL,
	"voting_close_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "media" (
	"id" serial PRIMARY KEY NOT NULL,
<<<<<<<< HEAD:src/lib/server/db/migrations/0000_chemical_thanos.sql
	"submission_id" text,
========
	"submission_id" varchar,
>>>>>>>> main:src/lib/server/db/migrations/0000_mushy_the_executioner.sql
	"type" "mediaType" NOT NULL,
	"url" varchar(255) NOT NULL,
	"alt" varchar(255),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "reaction" (
	"id" serial PRIMARY KEY NOT NULL,
<<<<<<<< HEAD:src/lib/server/db/migrations/0000_chemical_thanos.sql
	"name" text,
	"user_id" text,
	"submission_id" text,
========
	"value" varchar(255) NOT NULL,
	"user_id" uuid NOT NULL,
	"submissionId" varchar(255) NOT NULL,
>>>>>>>> main:src/lib/server/db/migrations/0000_mushy_the_executioner.sql
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "session" (
	"sessionToken" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "submission" (
	"id" varchar PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"category_id" integer NOT NULL,
	"event_id" integer NOT NULL,
	"title" varchar NOT NULL,
	"media_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tickets" (
	"id" serial PRIMARY KEY NOT NULL,
	"content" varchar(255),
	"user_id" uuid,
	"event_id" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"email_verified_at" timestamp,
	"password" varchar(255) NOT NULL,
	"role" "role" DEFAULT 'user',
	"picture" varchar(255),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "user_username_unique" UNIQUE("username"),
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "vote" (
<<<<<<<< HEAD:src/lib/server/db/migrations/0000_chemical_thanos.sql
	"submission_id" text NOT NULL,
	"user_id" text NOT NULL,
========
	"submission_id" varchar NOT NULL,
	"user_id" uuid NOT NULL,
>>>>>>>> main:src/lib/server/db/migrations/0000_mushy_the_executioner.sql
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "vote_submission_id_user_id_pk" PRIMARY KEY("submission_id","user_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "categories_to_events" ADD CONSTRAINT "categories_to_events_category_id_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."category"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "categories_to_events" ADD CONSTRAINT "categories_to_events_event_id_event_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."event"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "media" ADD CONSTRAINT "media_submission_id_submission_id_fk" FOREIGN KEY ("submission_id") REFERENCES "public"."submission"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "submission" ADD CONSTRAINT "submission_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
<<<<<<<< HEAD:src/lib/server/db/migrations/0000_chemical_thanos.sql
 ALTER TABLE "vote" ADD CONSTRAINT "vote_submission_id_submission_id_fk" FOREIGN KEY ("submission_id") REFERENCES "public"."submission"("id") ON DELETE no action ON UPDATE no action;
========
 ALTER TABLE "vote" ADD CONSTRAINT "vote_submission_id_submission_id_fk" FOREIGN KEY ("submission_id") REFERENCES "public"."submission"("id") ON DELETE cascade ON UPDATE no action;
>>>>>>>> main:src/lib/server/db/migrations/0000_mushy_the_executioner.sql
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
<<<<<<<< HEAD:src/lib/server/db/migrations/0000_chemical_thanos.sql
 ALTER TABLE "vote" ADD CONSTRAINT "vote_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
========
 ALTER TABLE "vote" ADD CONSTRAINT "vote_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
>>>>>>>> main:src/lib/server/db/migrations/0000_mushy_the_executioner.sql
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
