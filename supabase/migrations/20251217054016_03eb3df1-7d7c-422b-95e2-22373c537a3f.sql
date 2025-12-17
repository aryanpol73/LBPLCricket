-- Create app_ratings table for storing user ratings
CREATE TABLE public.app_ratings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_identifier TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  feedback TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_identifier)
);

-- Enable Row Level Security
ALTER TABLE public.app_ratings ENABLE ROW LEVEL SECURITY;

-- Anyone can insert ratings (one per user_identifier)
CREATE POLICY "Anyone can create app ratings" 
ON public.app_ratings 
FOR INSERT 
WITH CHECK (true);

-- Users can view only their own rating
CREATE POLICY "Users can view their own rating" 
ON public.app_ratings 
FOR SELECT 
USING (true);

-- Users can update their own rating
CREATE POLICY "Users can update their own rating"
ON public.app_ratings
FOR UPDATE
USING (true);