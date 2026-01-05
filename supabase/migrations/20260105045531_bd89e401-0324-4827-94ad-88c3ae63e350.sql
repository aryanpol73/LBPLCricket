-- Add ties column to points_table
ALTER TABLE public.points_table ADD COLUMN IF NOT EXISTS ties integer DEFAULT 0;