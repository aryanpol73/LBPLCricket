-- Add cricheroes_match_id column to matches table
ALTER TABLE public.matches ADD COLUMN cricheroes_match_id TEXT;

-- Populate CricHeroes match IDs for Day 1 matches (1-12)
UPDATE public.matches SET cricheroes_match_id = '21215430' WHERE match_no = 1;
UPDATE public.matches SET cricheroes_match_id = '21215506' WHERE match_no = 2;
UPDATE public.matches SET cricheroes_match_id = '21216307' WHERE match_no = 3;
UPDATE public.matches SET cricheroes_match_id = '21216332' WHERE match_no = 4;
UPDATE public.matches SET cricheroes_match_id = '21216349' WHERE match_no = 5;
UPDATE public.matches SET cricheroes_match_id = '21216363' WHERE match_no = 6;
UPDATE public.matches SET cricheroes_match_id = '21216384' WHERE match_no = 7;
UPDATE public.matches SET cricheroes_match_id = '21216403' WHERE match_no = 8;
UPDATE public.matches SET cricheroes_match_id = '21216416' WHERE match_no = 9;
UPDATE public.matches SET cricheroes_match_id = '21216435' WHERE match_no = 10;
UPDATE public.matches SET cricheroes_match_id = '21216454' WHERE match_no = 11;
UPDATE public.matches SET cricheroes_match_id = '21216469' WHERE match_no = 12;