import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Trophy, Crown, Award, Star } from "lucide-react";

interface GroupedResults {
  'League Phase': any[];
  'Knockouts': any[];
  'Semi-Finals': any[];
  'Grand Final': any[];
}

const Results = () => {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = async () => {
    const { data } = await supabase
      .from('matches')
      .select(`
        *,
        team_a:teams!matches_team_a_id_fkey(*),
        team_b:teams!matches_team_b_id_fkey(*),
        winner:teams!matches_winner_id_fkey(*),
        player_of_match:players(*)
      `)
      .eq('status', 'completed')
      .order('match_no', { ascending: true });

    setResults(data || []);
    setLoading(false);
  };

  // Group results by phase
  const groupedResults: GroupedResults = {
    'League Phase': [],
    'Knockouts': [],
    'Semi-Finals': [],
    'Grand Final': []
  };

  results.forEach((match) => {
    const phase = match.match_phase;
    if (phase === 'league1' || phase === 'league') {
      groupedResults['League Phase'].push(match);
    } else if (phase === 'knockout' || phase === 'knockouts') {
      groupedResults['Knockouts'].push(match);
    } else if (phase === 'semi-final' || phase === 'semifinals') {
      groupedResults['Semi-Finals'].push(match);
    } else if (phase === 'final' || phase === 'grand-final') {
      groupedResults['Grand Final'].push(match);
    }
  });

  const getPhaseIcon = (phase: string) => {
    switch (phase) {
      case 'League Phase':
        return <Trophy className="text-[hsl(45,90%,55%)]" size={32} strokeWidth={2.5} />;
      case 'Knockouts':
        return <Award className="text-[hsl(45,90%,55%)]" size={32} strokeWidth={2.5} />;
      case 'Semi-Finals':
        return <Crown className="text-[hsl(45,90%,55%)]" size={32} strokeWidth={2.5} />;
      case 'Grand Final':
        return <Star className="text-[hsl(45,90%,55%)]" size={32} strokeWidth={2.5} fill="hsl(45,90%,55%)" />;
      default:
        return <Trophy className="text-[hsl(45,90%,55%)]" size={32} strokeWidth={2.5} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8 text-center">
          <p>Loading results...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        {/* Premium Header */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <Trophy className="text-[hsl(45,90%,55%)]" size={40} strokeWidth={2.5} />
          <h1 className="text-5xl font-bold bg-gradient-gold bg-clip-text text-transparent">
            Match Results
          </h1>
          <Crown className="text-[hsl(45,90%,55%)]" size={40} strokeWidth={2.5} />
        </div>

        {/* Phase Sections */}
        <div className="space-y-12">
          {Object.entries(groupedResults).map(([phase, matches]) => {
            // Skip empty phases
            if (matches.length === 0) return null;

            return (
              <div key={phase} className="space-y-6">
                {/* Phase Header */}
                <div className="flex items-center justify-center gap-3 mb-6">
                  {getPhaseIcon(phase)}
                  <h2 className="text-3xl font-bold bg-gradient-gold bg-clip-text text-transparent">
                    {phase}
                  </h2>
                </div>

                {/* Premium Golden Background Container for Phase */}
                <div className="relative bg-gradient-gold-premium rounded-3xl p-8 shadow-premium">
                  {/* Subtle inner glow */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/40 via-transparent to-white/20 pointer-events-none" />
                  
                  <div className="relative space-y-6">
                    {matches.map((match) => (
                      <Card key={match.id} className="bg-card/95 backdrop-blur-sm border-2 border-[hsl(45,70%,75%)] shadow-gold-soft hover:shadow-gold hover:scale-[1.02] transition-all duration-300">
                        <div className="p-6">
                          <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-center">
                            {/* Round & Match No */}
                            <div className="md:col-span-1 flex md:flex-col gap-2 items-center">
                              <div className="text-center">
                                <div className="text-xs text-muted-foreground font-medium mb-1">Round</div>
                                <div className="text-2xl font-bold text-[hsl(45,90%,50%)]">
                                  {match.round_no || '-'}
                                </div>
                              </div>
                              <div className="text-center">
                                <div className="text-xs text-muted-foreground font-medium mb-1">Match</div>
                                <div className="text-lg font-semibold text-foreground">
                                  #{match.match_no || '-'}
                                </div>
                              </div>
                            </div>

                            {/* Teams */}
                            <div className="md:col-span-2">
                              <div className="font-semibold text-lg text-foreground">
                                {match.team_a?.name}
                                <span className="text-muted-foreground mx-2">vs</span>
                                {match.team_b?.name}
                              </div>
                            </div>

                            {/* Score */}
                            <div className="md:col-span-1 text-center">
                              <div className="text-xs text-muted-foreground font-medium mb-1">Score</div>
                              <div className="font-mono text-2xl font-bold text-foreground bg-muted/50 rounded-lg px-3 py-1 inline-block">
                                {match.team_a_score} - {match.team_b_score}
                              </div>
                            </div>

                            {/* Winner */}
                            <div className="md:col-span-1 text-center">
                              <div className="text-xs text-muted-foreground font-medium mb-1">Winner</div>
                              {match.winner ? (
                                <div className="flex items-center justify-center gap-1">
                                  <Trophy className="text-[hsl(45,90%,50%)]" size={18} />
                                  <Badge className="bg-gradient-gold text-white border-0 shadow-gold-soft font-semibold px-3 py-1">
                                    {match.winner.name}
                                  </Badge>
                                </div>
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )}
                            </div>

                            {/* Player of Match */}
                            <div className="md:col-span-1 text-center">
                              <div className="text-xs text-muted-foreground font-medium mb-1">Player of Match</div>
                              {match.player_of_match ? (
                                <div className="flex items-center justify-center gap-1">
                                  <Star className="text-[hsl(45,90%,50%)]" size={16} fill="hsl(45,90%,50%)" />
                                  <Badge variant="outline" className="border-2 border-[hsl(45,80%,60%)] text-[hsl(45,90%,35%)] font-semibold bg-[hsl(45,90%,95%)]">
                                    {match.player_of_match.name}
                                  </Badge>
                                </div>
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )}
                            </div>

                            {/* Phase Badge */}
                            <div className="md:col-span-1 text-center">
                              <div className="text-xs text-muted-foreground font-medium mb-1">Phase</div>
                              <Badge className="bg-primary text-primary-foreground font-semibold">
                                {match.match_phase?.toUpperCase()}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Empty State */}
          {results.length === 0 && (
            <div className="relative bg-gradient-gold-premium rounded-3xl p-8 shadow-premium">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/40 via-transparent to-white/20 pointer-events-none" />
              <Card className="relative bg-card/95 backdrop-blur-sm border-2 border-[hsl(45,70%,75%)] shadow-gold-soft">
                <div className="p-12 text-center">
                  <Award className="mx-auto text-[hsl(45,70%,60%)] mb-4" size={48} />
                  <p className="text-muted-foreground text-lg">No completed matches yet</p>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Results;
