-- Drop fan-related tables
DROP TABLE IF EXISTS public.fan_poll_votes CASCADE;
DROP TABLE IF EXISTS public.fan_poll_options CASCADE;
DROP TABLE IF EXISTS public.fan_polls CASCADE;
DROP TABLE IF EXISTS public.fan_leaderboard CASCADE;

-- Add team_name column to points_table
ALTER TABLE public.points_table 
ADD COLUMN IF NOT EXISTS team_name TEXT;

-- Populate team_name from teams table for existing records
UPDATE public.points_table pt
SET team_name = t.name
FROM public.teams t
WHERE pt.team_id = t.id;

-- Create trigger to auto-update team_name when team_id changes or team name changes
CREATE OR REPLACE FUNCTION public.sync_points_table_team_name()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    SELECT name INTO NEW.team_name
    FROM public.teams
    WHERE id = NEW.team_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER sync_points_table_team_name_trigger
BEFORE INSERT OR UPDATE ON public.points_table
FOR EACH ROW
EXECUTE FUNCTION public.sync_points_table_team_name();

-- Also create trigger on teams table to update points_table when team name changes
CREATE OR REPLACE FUNCTION public.update_points_table_on_team_change()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.points_table
  SET team_name = NEW.name
  WHERE team_id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_points_table_on_team_change_trigger
AFTER UPDATE OF name ON public.teams
FOR EACH ROW
WHEN (OLD.name IS DISTINCT FROM NEW.name)
EXECUTE FUNCTION public.update_points_table_on_team_change();