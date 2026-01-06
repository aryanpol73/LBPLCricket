-- Create match_scorecards table for static scorecard data
CREATE TABLE public.match_scorecards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  match_id UUID REFERENCES public.matches(id) ON DELETE CASCADE,
  match_no INTEGER NOT NULL,
  
  -- Team A (batting first) data
  team_a_id UUID REFERENCES public.teams(id),
  team_a_name TEXT NOT NULL,
  team_a_runs INTEGER NOT NULL,
  team_a_wickets INTEGER NOT NULL,
  team_a_overs TEXT NOT NULL,
  team_a_extras TEXT,
  
  -- Team B data
  team_b_id UUID REFERENCES public.teams(id),
  team_b_name TEXT NOT NULL,
  team_b_runs INTEGER NOT NULL,
  team_b_wickets INTEGER NOT NULL,
  team_b_overs TEXT NOT NULL,
  team_b_extras TEXT,
  
  -- Result
  winner_name TEXT NOT NULL,
  result_text TEXT NOT NULL,
  toss_text TEXT,
  
  -- Batting and bowling data as JSONB for flexibility
  team_a_batting JSONB NOT NULL DEFAULT '[]',
  team_a_bowling JSONB NOT NULL DEFAULT '[]',
  team_b_batting JSONB NOT NULL DEFAULT '[]',
  team_b_bowling JSONB NOT NULL DEFAULT '[]',
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.match_scorecards ENABLE ROW LEVEL SECURITY;

-- Everyone can view scorecards
CREATE POLICY "Scorecards are viewable by everyone"
ON public.match_scorecards
FOR SELECT
USING (true);

-- Only admins can manage scorecards
CREATE POLICY "Admins can insert scorecards"
ON public.match_scorecards
FOR INSERT
WITH CHECK (EXISTS (
  SELECT 1 FROM user_roles
  WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'admin'
));

CREATE POLICY "Admins can update scorecards"
ON public.match_scorecards
FOR UPDATE
USING (EXISTS (
  SELECT 1 FROM user_roles
  WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'admin'
));

CREATE POLICY "Admins can delete scorecards"
ON public.match_scorecards
FOR DELETE
USING (EXISTS (
  SELECT 1 FROM user_roles
  WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'admin'
));

-- Create index for faster lookups
CREATE INDEX idx_match_scorecards_match_no ON public.match_scorecards(match_no);