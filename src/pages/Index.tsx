import { Navigation } from "@/components/Navigation";
import { LiveMatchCard } from "@/components/LiveMatchCard";
import { CountdownTimer } from "@/components/CountdownTimer";
import { MatchPredictionPoll } from "@/components/MatchPredictionPoll";
import { YouTubeLiveStream } from "@/components/YouTubeLiveStream";
import { PlayerOfMatchVoting } from "@/components/PlayerOfMatchVoting";
import { LeaderboardSnapshot } from "@/components/LeaderboardSnapshot";
import { SponsorsSection } from "@/components/SponsorsSection";
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
            Lad Brahmin Premiere League • 2026
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
            <div className="space-y-6">
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
                <CountdownTimer
                  targetDate={new Date(currentMatch.match_date)}
                  matchLabel="Match starts in"
                />
              )}

              {currentMatch.status === 'live' && currentMatch.youtube_stream_url && (
                <YouTubeLiveStream streamUrl={currentMatch.youtube_stream_url} />
              )}
            </div>

            <div className="space-y-6">
              <MatchPredictionPoll
                matchId={currentMatch.id}
                teamAId={currentMatch.team_a_id}
                teamBId={currentMatch.team_b_id}
                teamAName={currentMatch.team_a?.name || "TBD"}
                teamBName={currentMatch.team_b?.name || "TBD"}
              />

              {currentMatch.status === 'live' && (
                <PlayerOfMatchVoting matchId={currentMatch.id} />
              )}
            </div>
          </div>
        </section>
      )}

      {/* Leaderboard Snapshot */}
      <LeaderboardSnapshot />

      {/* Sponsors Section */}
      <SponsorsSection />
    </div>
  );
};

export default Index;
