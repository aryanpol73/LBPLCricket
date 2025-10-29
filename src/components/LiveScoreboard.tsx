import { Card } from "@/components/ui/card";

interface LiveScoreboardProps {
  url?: string;
  title?: string;
  height?: string;
  className?: string;
}

export const LiveScoreboard = ({ 
  url = "https://cricheroes.com/live-score-widget", 
  title = "Live Scoreboard",
  height = "400px",
  className = ""
}: LiveScoreboardProps) => {
  return (
    <section className={`container mx-auto px-4 mb-12 ${className}`}>
      <Card className="p-4 bg-gradient-card shadow-card border-primary/20">
        <h2 className="text-2xl font-bold text-primary mb-4">{title}</h2>
        <div 
          className="w-full rounded-lg overflow-hidden border border-border"
          style={{ height }}
        >
          <iframe
            src={url}
            title={title}
            className="w-full h-full"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
          />
        </div>
      </Card>
    </section>
  );
};
