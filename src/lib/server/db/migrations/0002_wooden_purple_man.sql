CREATE INDEX "submissions_search_idx" ON "submission" USING gin (to_tsvector('english', "title"));