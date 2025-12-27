import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ExternalLink, Trophy, BarChart3, Users, Calendar, Image } from "lucide-react";

const TOURNAMENT_BASE_URL = "https://cricheroes.com/tournament/1/1735717/lbpl-season-3";

const tournamentLinks = [
  { label: "Live Matches", path: "/matches/live-matches", icon: Calendar, color: "text-live" },
  { label: "Upcoming", path: "/matches/upcoming-matches", icon: Calendar, color: "text-primary" },
  { label: "Results", path: "/matches/past-matches", icon: Trophy, color: "text-secondary" },
  { label: "Points Table", path: "/point-table", icon: BarChart3, color: "text-success" },
  { label: "Stats", path: "/stats", icon: BarChart3, color: "text-info" },
  { label: "Teams", path: "/teams", icon: Users, color: "text-primary" },
  { label: "Gallery", path: "/gallery", icon: Image, color: "text-secondary" },
];

interface CricHeroesTournamentProps {
  className?: string;
}

export const CricHeroesTournament = ({ className = "" }: CricHeroesTournamentProps) => {
  const [iframeError, setIframeError] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  const handleIframeLoad = () => {
    setIframeLoaded(true);
  };

  const handleIframeError = () => {
    setIframeError(true);
  };

  return (
    <section className={`container mx-auto px-4 py-8 ${className}`}>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-3 h-3 bg-live rounded-full animate-blink" />
        <h2 className="text-3xl font-bold text-primary">Live Tournament</h2>
        <a 
          href={TOURNAMENT_BASE_URL} 
          target="_blank" 
          rel="noopener noreferrer"
          className="ml-auto text-sm text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors"
        >
          Open in CricHeroes <ExternalLink size={14} />
        </a>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2 mb-6">
        {tournamentLinks.map((link) => (
          <a
            key={link.path}
            href={`${TOURNAMENT_BASE_URL}${link.path}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group"
          >
            <Card className="p-3 bg-card/50 hover:bg-card border-border/50 hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-glow text-center">
              <link.icon className={`mx-auto mb-1 ${link.color} group-hover:scale-110 transition-transform`} size={20} />
              <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                {link.label}
              </span>
            </Card>
          </a>
        ))}
      </div>

      {/* Main Tournament Card with Iframe or Fallback */}
      <Card className="overflow-hidden bg-gradient-card border-primary/20 shadow-card">
        {!iframeError ? (
          <div className="relative">
            {/* Loading state */}
            {!iframeLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-card z-10">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  <p className="text-muted-foreground text-sm">Loading tournament...</p>
                </div>
              </div>
            )}
            
            {/* Iframe */}
            <iframe
              src={TOURNAMENT_BASE_URL}
              title="CricHeroes Tournament"
              className="w-full h-[600px] border-0"
              onLoad={handleIframeLoad}
              onError={handleIframeError}
              loading="lazy"
              sandbox="allow-scripts allow-same-origin allow-popups"
            />
          </div>
        ) : (
          /* Fallback when iframe blocked */
          <div className="p-8 text-center">
            <Trophy className="mx-auto mb-4 text-secondary" size={48} />
            <h3 className="text-xl font-bold text-foreground mb-2">
              View Tournament on CricHeroes
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Access live scores, match details, player stats, and more on CricHeroes
            </p>
            <Button asChild size="lg" className="font-semibold">
              <a 
                href={TOURNAMENT_BASE_URL} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                Open CricHeroes <ExternalLink size={18} />
              </a>
            </Button>
          </div>
        )}
      </Card>
    </section>
  );
};
