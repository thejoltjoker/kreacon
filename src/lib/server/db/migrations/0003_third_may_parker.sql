ALTER TABLE "ticket" ADD COLUMN "code" varchar(255);
UPDATE "ticket" SET "code" = "id" WHERE "code" IS NULL;
ALTER TABLE "ticket" ALTER COLUMN "code" SET NOT NULL;