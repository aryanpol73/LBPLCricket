-- Create storage bucket for gallery images
INSERT INTO storage.buckets (id, name, public)
VALUES ('gallery', 'gallery', true);

-- Create gallery_images table
CREATE TABLE public.gallery_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  title TEXT,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;

-- RLS Policies for gallery_images
CREATE POLICY "Gallery images are viewable by everyone"
  ON public.gallery_images
  FOR SELECT
  USING (true);

CREATE POLICY "Only admins can manage gallery images"
  ON public.gallery_images
  FOR ALL
  USING (false);

-- Storage policies for gallery bucket
CREATE POLICY "Gallery images are publicly accessible"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'gallery');

CREATE POLICY "Anyone can upload gallery images"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'gallery');

CREATE POLICY "Anyone can update gallery images"
  ON storage.objects
  FOR UPDATE
  USING (bucket_id = 'gallery');

CREATE POLICY "Anyone can delete gallery images"
  ON storage.objects
  FOR DELETE
  USING (bucket_id = 'gallery');

-- Create stats configuration table
CREATE TABLE public.site_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stat_key TEXT UNIQUE NOT NULL,
  stat_value INTEGER NOT NULL,
  stat_label TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.site_stats ENABLE ROW LEVEL SECURITY;

-- RLS Policies for site_stats
CREATE POLICY "Site stats are viewable by everyone"
  ON public.site_stats
  FOR SELECT
  USING (true);

CREATE POLICY "Only admins can manage site stats"
  ON public.site_stats
  FOR ALL
  USING (false);

-- Insert default stats
INSERT INTO public.site_stats (stat_key, stat_value, stat_label, display_order)
VALUES 
  ('teams_count', 18, 'Teams', 1),
  ('matches_count', 33, 'Matches', 2),
  ('season_year', 2026, 'Season', 3);