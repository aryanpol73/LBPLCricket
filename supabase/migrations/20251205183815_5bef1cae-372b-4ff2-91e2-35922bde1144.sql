-- Remove overly permissive gallery storage policies
DROP POLICY IF EXISTS "Anyone can upload gallery images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update gallery images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete gallery images" ON storage.objects;

-- Fix the function search path mutable warning for existing functions
CREATE OR REPLACE FUNCTION public.sync_points_table_team_name()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $function$
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    SELECT name INTO NEW.team_name
    FROM public.teams
    WHERE id = NEW.team_id;
  END IF;
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_points_table_on_team_change()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $function$
BEGIN
  UPDATE public.points_table
  SET team_name = NEW.name
  WHERE team_id = NEW.id;
  RETURN NEW;
END;
$function$;