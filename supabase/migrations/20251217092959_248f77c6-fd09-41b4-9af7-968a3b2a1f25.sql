-- Create tournament_settings table to store CricHeroes URLs
CREATE TABLE public.tournament_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key TEXT UNIQUE NOT NULL,
  setting_value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.tournament_settings ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Tournament settings are viewable by everyone"
ON public.tournament_settings
FOR SELECT
USING (true);

-- Admin-only write access
CREATE POLICY "Admins can insert tournament settings"
ON public.tournament_settings
FOR INSERT
WITH CHECK (EXISTS (
  SELECT 1 FROM user_roles
  WHERE user_roles.user_id = auth.uid()
  AND user_roles.role = 'admin'::app_role
));

CREATE POLICY "Admins can update tournament settings"
ON public.tournament_settings
FOR UPDATE
USING (EXISTS (
  SELECT 1 FROM user_roles
  WHERE user_roles.user_id = auth.uid()
  AND user_roles.role = 'admin'::app_role
));

CREATE POLICY "Admins can delete tournament settings"
ON public.tournament_settings
FOR DELETE
USING (EXISTS (
  SELECT 1 FROM user_roles
  WHERE user_roles.user_id = auth.uid()
  AND user_roles.role = 'admin'::app_role
));

-- Insert default settings
INSERT INTO public.tournament_settings (setting_key, setting_value) VALUES
  ('cricheroes_tournament_base_url', ''),
  ('cricheroes_stats_url', ''),
  ('cricheroes_points_table_url', '');