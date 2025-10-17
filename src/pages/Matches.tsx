import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, MapPin } from "lucide-react";
import { format } from "date-fns";

const Matches = () => {
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    const { data } = await supabase
      .from('matches')
      .select(`
        *,
        team_a:teams!matches_team_a_id_fkey(*),
        team_b:teams!matches_team_b_id_fkey(*),
        winner:teams!matches_winner_id_fkey(*),
        player_of_match:players(*)
      `)
      .order('match_date', { ascending: true });

    setMatches(data || []);
    setLoading(false);
  };

  const filterMatches = (status: string) => {
    return matches.filter(m => m.status === status);
  };

  const MatchCard = ({ match }: { match: any }) => (
    <Card className="p-6 bg-gradient-card shadow-card hover:shadow-glow transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {format(new Date(match.match_date), "PPP")}
          </span>
        </div>
        <Badge 
          variant={
            match.status === 'live' ? 'destructive' : 
            match.status === 'completed' ? 'default' : 
            'secondary'
          }
          className={match.status === 'live' ? 'animate-blink bg-live' : ''}
        >
          {match.status === 'live' ? '● LIVE' : match.status.toUpperCase()}
        </Badge>
      </div>

      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex-1 text-center">
          <h3 className="font-bold text-primary mb-1">{match.team_a?.name}</h3>
          {match.team_a_score && (
            <p className="text-2xl font-bold text-foreground">{match.team_a_score}</p>
          )}
        </div>

        <div className="text-2xl font-bold text-secondary">VS</div>

        <div className="flex-1 text-center">
          <h3 className="font-bold text-primary mb-1">{match.team_b?.name}</h3>
          {match.team_b_score && (
            <p className="text-2xl font-bold text-foreground">{match.team_b_score}</p>
          )}
        </div>
      </div>

      {match.venue && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <MapPin size={14} />
          <span>{match.venue}</span>
        </div>
      )}

      {match.status === 'completed' && (
        <div className="mt-4 pt-4 border-t border-border">
          {match.winner && (
            <p className="text-sm text-foreground mb-1">
              <span className="font-bold text-success">Winner:</span> {match.winner.name}
            </p>
          )}
          {match.player_of_match && (
            <p className="text-sm text-foreground">
              <span className="font-bold text-secondary">Player of Match:</span> {match.player_of_match.name}
            </p>
          )}
        </div>
      )}

      <Badge variant="outline" className="mt-3">
        {match.match_phase?.toUpperCase()} • {match.group_name || 'N/A'}
      </Badge>
    </Card>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8 text-center">
          <p>Loading matches...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-primary mb-8">Matches</h1>

        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3 mb-8">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="live">Live</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterMatches('upcoming').length > 0 ? (
                filterMatches('upcoming').map(match => (
                  <MatchCard key={match.id} match={match} />
                ))
              ) : (
                <p className="col-span-full text-center text-muted-foreground">No upcoming matches</p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="live">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterMatches('live').length > 0 ? (
                filterMatches('live').map(match => (
                  <MatchCard key={match.id} match={match} />
                ))
              ) : (
                <p className="col-span-full text-center text-muted-foreground">No live matches</p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="completed">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterMatches('completed').length > 0 ? (
                filterMatches('completed').map(match => (
                  <MatchCard key={match.id} match={match} />
                ))
              ) : (
                <p className="col-span-full text-center text-muted-foreground">No completed matches</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Matches;
