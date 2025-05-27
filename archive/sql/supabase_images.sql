-- SQL script to create a table for managing image metadata in Supabase

-- Create images table to track uploaded files
CREATE TABLE IF NOT EXISTS images (
  id SERIAL PRIMARY KEY,
  filename TEXT NOT NULL,
  original_filename TEXT,
  bucket_path TEXT NOT NULL,
  file_type TEXT,
  content_type TEXT,
  size INTEGER,
  entity_type TEXT NOT NULL, -- 'pet', 'breed', 'provider', etc.
  entity_id INTEGER, -- ID of the related entity (petId, breedId, etc.)
  public_url TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index for faster lookups by entity
CREATE INDEX IF NOT EXISTS idx_images_entity ON images(entity_type, entity_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update timestamp on row update
DROP TRIGGER IF EXISTS set_timestamp ON images;
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON images
FOR EACH ROW
EXECUTE PROCEDURE update_timestamp();

-- Create storage buckets if they don't exist (this is handled via Supabase dashboard typically)
-- Note: You'll need to create these buckets via the Supabase dashboard:
-- 1. pet-images
-- 2. breed-images
-- 3. provider-images
-- And set the appropriate permissions for public access