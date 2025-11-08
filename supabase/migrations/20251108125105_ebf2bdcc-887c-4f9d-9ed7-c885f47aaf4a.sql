-- Add group_name and round columns to points_table
ALTER TABLE public.points_table 
ADD COLUMN IF NOT EXISTS group_name text,
ADD COLUMN IF NOT EXISTS round integer DEFAULT 1;

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_points_table_round_group ON public.points_table(round, group_name);