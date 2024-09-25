ALTER TABLE "account" DROP COLUMN IF EXISTS "type";--> statement-breakpoint
ALTER TABLE "account" DROP COLUMN IF EXISTS "refresh_token";--> statement-breakpoint
ALTER TABLE "account" DROP COLUMN IF EXISTS "access_token";--> statement-breakpoint
ALTER TABLE "account" DROP COLUMN IF EXISTS "expires_at";--> statement-breakpoint
ALTER TABLE "account" DROP COLUMN IF EXISTS "token_type";--> statement-breakpoint
ALTER TABLE "account" DROP COLUMN IF EXISTS "scope";--> statement-breakpoint
ALTER TABLE "account" DROP COLUMN IF EXISTS "id_token";--> statement-breakpoint
ALTER TABLE "account" DROP COLUMN IF EXISTS "session_state";