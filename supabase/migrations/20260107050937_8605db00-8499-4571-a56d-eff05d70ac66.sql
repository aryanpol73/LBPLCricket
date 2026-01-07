-- Create pwa_installs table for tracking PWA installations
CREATE TABLE public.pwa_installs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  installed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  user_agent TEXT,
  platform TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.pwa_installs ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (anonymous tracking)
CREATE POLICY "Anyone can log PWA installs" 
ON public.pwa_installs 
FOR INSERT 
WITH CHECK (true);

-- Only admins can view installs
CREATE POLICY "Admins can view PWA installs" 
ON public.pwa_installs 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM user_roles 
  WHERE user_roles.user_id = auth.uid() 
  AND user_roles.role = 'admin'::app_role
));

-- Add video_highlight_url column to matches table
ALTER TABLE public.matches 
ADD COLUMN video_highlight_url TEXT;