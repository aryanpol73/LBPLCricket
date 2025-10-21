-- Add statistics columns to players table
ALTER TABLE public.players
ADD COLUMN IF NOT EXISTS matches_played integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS runs_scored integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS wickets_taken integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS batting_average numeric(5,2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS strike_rate numeric(5,2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS bowling_average numeric(5,2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS economy_rate numeric(4,2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS catches integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS stumpings integer DEFAULT 0;