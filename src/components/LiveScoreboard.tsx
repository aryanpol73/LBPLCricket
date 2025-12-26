import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";

interface LiveScoreboardProps {
  url?: string;
  title?: string;
  height?: string;
  className?: string;
}

export const LiveScoreboard = ({ 
  url = "https://cricheroes.com/tournament-embed/1/1735717/lbpl-season-3/matches/live-matches?pageno=past-matches&type=m", 
  title = "Live Scoreboard",
  height = "400px",
  className = ""
}: LiveScoreboardProps) => {
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    // Auto-refresh iframe every 60 seconds
    const interval = setInterval(() => {
      setRefreshKey(prev => prev + 1);
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className={`container mx-auto px-4 mb-12 ${className}`}>
      <Card className="p-4 bg-gradient-card shadow-card border-primary/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-live/10 via-transparent to-live/10 animate-pulse-glow pointer-events-none" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 bg-live rounded-full animate-blink" />
            <h2 className="text-2xl font-bold text-primary">{title}</h2>
          </div>
          <div 
            className="w-full rounded-lg overflow-hidden border border-border shadow-inner"
            style={{ height }}
          >
            <iframe
              key={refreshKey}
              src={url}
              title={title}
              className="w-full h-full"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
            />
          </div>
        </div>
      </Card>
    </section>
  );
};
