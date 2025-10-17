import { Navigation } from "@/components/Navigation";
import { LiveMatchCard } from "@/components/LiveMatchCard";
import { CountdownTimer } from "@/components/CountdownTimer";
import { MatchPredictionPoll } from "@/components/MatchPredictionPoll";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Trophy, Users, Calendar } from "lucide-react";

const Index = () => {
  const [liveMatch, setLiveMatch] = useState<any>(null);
  const [upcomingMatch, setUpcomingMatch] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    // Get live match
    const { data: live } = await supabase
      .from('matches')
      .select(`
        *,
        team_a:teams!matches_team_a_id_fkey(*),
        team_b:teams!matches_team_b_id_fkey(*)
      `)
      .eq('status', 'live')
      .order('match_date', { ascending: true })
      .limit(1)
      .single();

    // Get upcoming match
    const { data: upcoming } = await supabase
      .from('matches')
      .select(`
        *,
        team_a:teams!matches_team_a_id_fkey(*),
        team_b:teams!matches_team_b_id_fkey(*)
      `)
      .eq('status', 'upcoming')
      .order('match_date', { ascending: true })
      .limit(1)
      .single();

    setLiveMatch(live);
    setUpcomingMatch(upcoming);
    setLoading(false);
  };

  const currentMatch = liveMatch || upcomingMatch;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-gradient-hero py-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 animate-slide-in">
            LBPL SEASON 3
          </h1>
          <p className="text-xl md:text-2xl text-secondary mb-2">
            League Box Premiere League • 2026
          </p>
          <p className="text-lg text-white/90">
            18 Teams • One Champion
          </p>
        </div>
      </section>

      {/* Stats Cards */}
      <section className="container mx-auto px-4 -mt-8 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6 bg-white shadow-card hover:shadow-glow transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Users className="text-primary" size={28} />
              </div>
              <div>
                <p className="text-3xl font-bold text-primary">18</p>
                <p className="text-sm text-muted-foreground">Teams</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white shadow-card hover:shadow-glow transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-secondary/10 rounded-lg">
                <Trophy className="text-secondary" size={28} />
              </div>
              <div>
                <p className="text-3xl font-bold text-secondary">45+</p>
                <p className="text-sm text-muted-foreground">Matches</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white shadow-card hover:shadow-glow transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-success/10 rounded-lg">
                <Calendar className="text-success" size={28} />
              </div>
              <div>
                <p className="text-3xl font-bold text-success">2026</p>
                <p className="text-sm text-muted-foreground">Season</p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Live Match Section */}
      {!loading && currentMatch && (
        <section className="container mx-auto px-4 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <LiveMatchCard
                teamA={currentMatch.team_a?.name || "TBD"}
                teamB={currentMatch.team_b?.name || "TBD"}
                teamALogo={currentMatch.team_a?.logo_url}
                teamBLogo={currentMatch.team_b?.logo_url}
                isLive={currentMatch.status === 'live'}
                teamAScore={currentMatch.team_a_score}
                teamBScore={currentMatch.team_b_score}
              />

              {currentMatch.status === 'upcoming' && (
                <div className="mt-6">
                  <CountdownTimer
                    targetDate={new Date(currentMatch.match_date)}
                    matchLabel="Match starts in"
                  />
                </div>
              )}
            </div>

            <div>
              <MatchPredictionPoll
                matchId={currentMatch.id}
                teamAId={currentMatch.team_a_id}
                teamBId={currentMatch.team_b_id}
                teamAName={currentMatch.team_a?.name || "TBD"}
                teamBName={currentMatch.team_b?.name || "TBD"}
              />
            </div>
          </div>
        </section>
      )}

      {/* Tournament Info */}
      <section className="container mx-auto px-4 pb-16">
        <div className="bg-gradient-card rounded-xl p-8 shadow-card">
          <h2 className="text-3xl font-bold text-center text-primary mb-6">
            Tournament Format
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div className="p-4">
              <div className="w-16 h-16 mx-auto mb-3 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="font-bold text-foreground mb-2">League 1</h3>
              <p className="text-sm text-muted-foreground">6 groups of 3 teams</p>
            </div>
            
            <div className="p-4">
              <div className="w-16 h-16 mx-auto mb-3 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="font-bold text-foreground mb-2">League 2</h3>
              <p className="text-sm text-muted-foreground">Top 12 in 4 groups</p>
            </div>
            
            <div className="p-4">
              <div className="w-16 h-16 mx-auto mb-3 bg-secondary/10 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-secondary">SF</span>
              </div>
              <h3 className="font-bold text-foreground mb-2">Semi Finals</h3>
              <p className="text-sm text-muted-foreground">Top 4 teams compete</p>
            </div>
            
            <div className="p-4">
              <div className="w-16 h-16 mx-auto mb-3 bg-secondary/10 rounded-full flex items-center justify-center">
                <Trophy className="text-secondary" size={28} />
              </div>
              <h3 className="font-bold text-foreground mb-2">Grand Final</h3>
              <p className="text-sm text-muted-foreground">Champions crowned</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
