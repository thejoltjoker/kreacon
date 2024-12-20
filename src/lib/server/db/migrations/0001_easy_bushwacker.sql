CREATE TABLE "file" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"category" varchar(255),
	"contentType" varchar(127) NOT NULL,
	"container" varchar(255),
	"url" varchar(255) NOT NULL,
	"filename" varchar(255) NOT NULL,
	"size" integer,
	"checksum" varchar(255),
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "submission" ADD COLUMN "proof_id" uuid;