-- Add image_urls column to store multiple images as a JSON array
ALTER TABLE public.community_posts 
ADD COLUMN image_urls text[] DEFAULT '{}';

-- Migrate existing single image_url data to the new array column
UPDATE public.community_posts 
SET image_urls = ARRAY[image_url] 
WHERE image_url IS NOT NULL AND image_url != '';

-- Note: Keeping image_url column for backwards compatibility