-- Drop the UNIQUE CONSTRAINT on team_id (to allow multiple entries per team across rounds)
ALTER TABLE public.points_table DROP CONSTRAINT IF EXISTS points_table_team_id_key;

-- Ensure round is always present
UPDATE public.points_table SET round = 1 WHERE round IS NULL;
ALTER TABLE public.points_table ALTER COLUMN round SET DEFAULT 1;
ALTER TABLE public.points_table ALTER COLUMN round SET NOT NULL;

-- Enforce uniqueness per (team, round) so each team can have one entry per round
CREATE UNIQUE INDEX IF NOT EXISTS points_table_team_id_round_key
ON public.points_table (team_id, round);