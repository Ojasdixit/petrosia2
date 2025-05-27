CREATE TABLE IF NOT EXISTS "news_articles" (
  "id" SERIAL PRIMARY KEY,
  "title" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "summary" TEXT,
  "source" TEXT NOT NULL,
  "source_url" TEXT NOT NULL,
  "image_url" TEXT,
  "published_at" TIMESTAMP NOT NULL,
  "created_at" TIMESTAMP DEFAULT NOW(),
  "categories" JSONB DEFAULT '[]'
);