-- Add youtube stream URL to matches table
ALTER TABLE public.matches
ADD COLUMN youtube_stream_url text;

COMMENT ON COLUMN public.matches.youtube_stream_url IS 'YouTube live stream URL for the match';