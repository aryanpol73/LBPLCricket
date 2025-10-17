-- LBPL Season 3 Database Schema

-- Teams table
CREATE TABLE public.teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  short_name TEXT,
  logo_url TEXT,
  home_city TEXT,
  fun_fact TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Teams are viewable by everyone"
  ON public.teams FOR SELECT
  USING (true);

CREATE POLICY "Only admins can manage teams"
  ON public.teams FOR ALL
  USING (false);

-- Players table
CREATE TABLE public.players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  age INTEGER,
  role TEXT,
  is_key_player BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Players are viewable by everyone"
  ON public.players FOR SELECT
  USING (true);

CREATE POLICY "Only admins can manage players"
  ON public.players FOR ALL
  USING (false);

-- Matches table
CREATE TABLE public.matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_a_id UUID REFERENCES public.teams(id) ON DELETE CASCADE NOT NULL,
  team_b_id UUID REFERENCES public.teams(id) ON DELETE CASCADE NOT NULL,
  match_date TIMESTAMP WITH TIME ZONE NOT NULL,
  venue TEXT,
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'live', 'completed')),
  team_a_score TEXT,
  team_b_score TEXT,
  winner_id UUID REFERENCES public.teams(id) ON DELETE SET NULL,
  player_of_match_id UUID REFERENCES public.players(id) ON DELETE SET NULL,
  match_phase TEXT DEFAULT 'league1' CHECK (match_phase IN ('league1', 'league2', 'semi', 'final')),
  group_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Matches are viewable by everyone"
  ON public.matches FOR SELECT
  USING (true);

CREATE POLICY "Only admins can manage matches"
  ON public.matches FOR ALL
  USING (false);

-- Match Predictions (Polls for each match)
CREATE TABLE public.match_predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID REFERENCES public.matches(id) ON DELETE CASCADE NOT NULL,
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE NOT NULL,
  user_identifier TEXT NOT NULL, -- IP or session ID for non-logged users
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(match_id, user_identifier)
);

ALTER TABLE public.match_predictions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view match predictions"
  ON public.match_predictions FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create match predictions"
  ON public.match_predictions FOR INSERT
  WITH CHECK (true);

-- Player of Match Votes
CREATE TABLE public.potm_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID REFERENCES public.matches(id) ON DELETE CASCADE NOT NULL,
  player_id UUID REFERENCES public.players(id) ON DELETE CASCADE NOT NULL,
  user_identifier TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(match_id, user_identifier)
);

ALTER TABLE public.potm_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view POTM votes"
  ON public.potm_votes FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create POTM votes"
  ON public.potm_votes FOR INSERT
  WITH CHECK (true);

-- Points Table
CREATE TABLE public.points_table (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE NOT NULL UNIQUE,
  matches_played INTEGER DEFAULT 0,
  wins INTEGER DEFAULT 0,
  losses INTEGER DEFAULT 0,
  net_run_rate DECIMAL(4, 2) DEFAULT 0.00,
  points INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.points_table ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Points table is viewable by everyone"
  ON public.points_table FOR SELECT
  USING (true);

CREATE POLICY "Only admins can manage points table"
  ON public.points_table FOR ALL
  USING (false);

-- Fan Zone Polls
CREATE TABLE public.fan_polls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  ends_at TIMESTAMP WITH TIME ZONE
);

ALTER TABLE public.fan_polls ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Fan polls are viewable by everyone"
  ON public.fan_polls FOR SELECT
  USING (true);

CREATE POLICY "Only admins can manage fan polls"
  ON public.fan_polls FOR ALL
  USING (false);

-- Fan Poll Options
CREATE TABLE public.fan_poll_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  poll_id UUID REFERENCES public.fan_polls(id) ON DELETE CASCADE NOT NULL,
  option_text TEXT NOT NULL,
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE
);

ALTER TABLE public.fan_poll_options ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Fan poll options are viewable by everyone"
  ON public.fan_poll_options FOR SELECT
  USING (true);

CREATE POLICY "Only admins can manage fan poll options"
  ON public.fan_poll_options FOR ALL
  USING (false);

-- Fan Poll Votes
CREATE TABLE public.fan_poll_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  poll_id UUID REFERENCES public.fan_polls(id) ON DELETE CASCADE NOT NULL,
  option_id UUID REFERENCES public.fan_poll_options(id) ON DELETE CASCADE NOT NULL,
  user_identifier TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(poll_id, user_identifier)
);

ALTER TABLE public.fan_poll_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view fan poll votes"
  ON public.fan_poll_votes FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create fan poll votes"
  ON public.fan_poll_votes FOR INSERT
  WITH CHECK (true);

-- Fan Leaderboard (tracks correct predictions)
CREATE TABLE public.fan_leaderboard (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_identifier TEXT NOT NULL UNIQUE,
  username TEXT,
  correct_predictions INTEGER DEFAULT 0,
  total_predictions INTEGER DEFAULT 0,
  points INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.fan_leaderboard ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Fan leaderboard is viewable by everyone"
  ON public.fan_leaderboard FOR SELECT
  USING (true);

CREATE POLICY "Anyone can update their leaderboard"
  ON public.fan_leaderboard FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update their leaderboard entry"
  ON public.fan_leaderboard FOR UPDATE
  USING (true);

-- Create indexes for better performance
CREATE INDEX idx_matches_date ON public.matches(match_date);
CREATE INDEX idx_matches_status ON public.matches(status);
CREATE INDEX idx_points_table_points ON public.points_table(points DESC);
CREATE INDEX idx_fan_leaderboard_points ON public.fan_leaderboard(points DESC);
