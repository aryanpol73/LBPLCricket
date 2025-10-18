import { useEffect, useState } from "react";
import { Card } from "./ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, Clock } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface Match {
  id: string;
  team_a: { name: string; logo_url?: string };
  team_b: { name: string; logo_url?: string };
  match_date: string;
  venue?: string;
}

export const UpcomingMatches = () => {
  const [matches, setMatches] = useState<Match[]>([]);

  useEffect(() => {
    loadUpcomingMatches();
  }, []);

  const loadUpcomingMatches = async () => {
    const { data } = await supabase
      .from('matches')
      .select(`
        *,
        team_a:teams!matches_team_a_id_fkey(name, logo_url),
        team_b:teams!matches_team_b_id_fkey(name, logo_url)
      `)
      .eq('status', 'upcoming')
      .order('match_date', { ascending: true })
      .limit(6);

    if (data) {
      setMatches(data as any);
    }
  };

  const getTimeUntilMatch = (matchDate: string) => {
    const now = new Date().getTime();
    const match = new Date(matchDate).getTime();
    const diff = match - now;

    if (diff <= 0) return "Starting soon";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `${days}d ${hours}h`;
    return `${hours}h`;
  };

  const formatMatchDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="container mx-auto px-4 mb-12">
      <h2 className="text-3xl font-bold text-center text-primary mb-6">
        Upcoming Fixtures
      </h2>
      <Carousel className="w-full max-w-5xl mx-auto">
        <CarouselContent>
          {matches.map((match) => (
            <CarouselItem key={match.id} className="md:basis-1/2 lg:basis-1/3">
              <Card className="p-6 bg-gradient-card shadow-card hover:shadow-glow transition-all">
                <div className="space-y-4">
                  {/* Countdown Badge */}
                  <div className="flex justify-center">
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold">
                      {getTimeUntilMatch(match.match_date)}
                    </span>
                  </div>

                  {/* Teams */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      {match.team_a.logo_url && (
                        <img src={match.team_a.logo_url} alt={match.team_a.name} className="w-8 h-8 object-contain" />
                      )}
                      <p className="font-bold text-foreground text-sm">{match.team_a.name}</p>
                    </div>
                    <div className="flex items-center justify-center">
                      <span className="text-xs text-muted-foreground font-semibold">VS</span>
                    </div>
                    <div className="flex items-center gap-3">
                      {match.team_b.logo_url && (
                        <img src={match.team_b.logo_url} alt={match.team_b.name} className="w-8 h-8 object-contain" />
                      )}
                      <p className="font-bold text-foreground text-sm">{match.team_b.name}</p>
                    </div>
                  </div>

                  {/* Match Details */}
                  <div className="space-y-2 pt-2 border-t border-border">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar size={14} />
                      <span>{formatMatchDate(match.match_date)}</span>
                    </div>
                    {match.venue && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock size={14} />
                        <span>{match.venue}</span>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};
