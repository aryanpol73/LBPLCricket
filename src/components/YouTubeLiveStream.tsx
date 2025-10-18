import { Card } from "./ui/card";
import { Youtube } from "lucide-react";

interface YouTubeLiveStreamProps {
  streamUrl?: string;
}

export const YouTubeLiveStream = ({ streamUrl }: YouTubeLiveStreamProps) => {
  if (!streamUrl) return null;

  // Extract video ID from YouTube URL
  const getYouTubeEmbedUrl = (url: string) => {
    const videoIdMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    return videoIdMatch ? `https://www.youtube.com/embed/${videoIdMatch[1]}?autoplay=1` : null;
  };

  const embedUrl = getYouTubeEmbedUrl(streamUrl);

  if (!embedUrl) return null;

  return (
    <Card className="p-6 bg-gradient-card shadow-card">
      <div className="flex items-center gap-2 mb-4">
        <Youtube className="text-destructive" size={24} />
        <h3 className="text-xl font-bold text-foreground">Watch Live Stream</h3>
      </div>
      <div className="aspect-video rounded-lg overflow-hidden">
        <iframe
          src={embedUrl}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </Card>
  );
};
