-- Remove fan engagement tables that are no longer needed

-- Drop tables in correct order (respect foreign key dependencies)
DROP TABLE IF EXISTS public.fan_poll_votes CASCADE;
DROP TABLE IF EXISTS public.fan_poll_options CASCADE;
DROP TABLE IF EXISTS public.fan_polls CASCADE;
DROP TABLE IF EXISTS public.fan_leaderboard CASCADE;