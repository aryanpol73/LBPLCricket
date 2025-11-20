-- Create fan polls table
CREATE TABLE IF NOT EXISTS public.fan_polls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  ends_at TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN DEFAULT true
);

-- Create fan poll options table
CREATE TABLE IF NOT EXISTS public.fan_poll_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  poll_id UUID NOT NULL REFERENCES public.fan_polls(id) ON DELETE CASCADE,
  option_text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create fan poll votes table
CREATE TABLE IF NOT EXISTS public.fan_poll_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  poll_id UUID NOT NULL REFERENCES public.fan_polls(id) ON DELETE CASCADE,
  option_id UUID NOT NULL REFERENCES public.fan_poll_options(id) ON DELETE CASCADE,
  user_identifier TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(poll_id, user_identifier)
);

-- Create fan leaderboard table
CREATE TABLE IF NOT EXISTS public.fan_leaderboard (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_identifier TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  points INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.fan_polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fan_poll_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fan_poll_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fan_leaderboard ENABLE ROW LEVEL SECURITY;

-- RLS Policies for fan_polls
CREATE POLICY "Anyone can view active polls" ON public.fan_polls
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage polls" ON public.fan_polls
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for fan_poll_options
CREATE POLICY "Anyone can view poll options" ON public.fan_poll_options
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage poll options" ON public.fan_poll_options
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for fan_poll_votes
CREATE POLICY "Anyone can view poll votes" ON public.fan_poll_votes
  FOR SELECT USING (true);

CREATE POLICY "Anyone can create poll votes" ON public.fan_poll_votes
  FOR INSERT WITH CHECK (true);

-- RLS Policies for fan_leaderboard
CREATE POLICY "Anyone can view leaderboard" ON public.fan_leaderboard
  FOR SELECT USING (true);

CREATE POLICY "Anyone can insert to leaderboard" ON public.fan_leaderboard
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own leaderboard entry" ON public.fan_leaderboard
  FOR UPDATE USING (true);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_fan_poll_votes_poll_id ON public.fan_poll_votes(poll_id);
CREATE INDEX IF NOT EXISTS idx_fan_poll_votes_option_id ON public.fan_poll_votes(option_id);
CREATE INDEX IF NOT EXISTS idx_fan_poll_options_poll_id ON public.fan_poll_options(poll_id);
CREATE INDEX IF NOT EXISTS idx_fan_leaderboard_points ON public.fan_leaderboard(points DESC);