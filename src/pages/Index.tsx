import { Navigation } from "@/components/Navigation";
import { LiveMatchCard } from "@/components/LiveMatchCard";
import { CountdownTimer } from "@/components/CountdownTimer";
import { MatchPredictionPoll } from "@/components/MatchPredictionPoll";
import { YouTubeLiveStream } from "@/components/YouTubeLiveStream";
import { PlayerOfMatchVoting } from "@/components/PlayerOfMatchVoting";
import { MatchTimeline } from "@/components/MatchTimeline";
import { SponsorsSection } from "@/components/SponsorsSection";
import { GallerySection } from "@/components/GallerySection";
import { LiveScoreboard } from "@/components/LiveScoreboard";
import { LiveTicker } from "@/components/LiveTicker";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Users, Calendar } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useCountUp } from "@/hooks/useCountUp";

const Index = () => {
  const [liveMatch, setLiveMatch] = useState<any>(null);
  const [upcomingMatch, setUpcomingMatch] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any[]>([]);
  
  const statsRef = useScrollAnimation();
  const { count: teamsCount, startCounting: startTeamsCount } = useCountUp(0, 2000);
  const { count: matchesCount, startCounting: startMatchesCount } = useCountUp(0, 2000);
  const { count: seasonCount, startCounting: startSeasonCount } = useCountUp(0, 2000);

  useEffect(() => {
    loadMatches();
    loadStats();
  }, []);

  useEffect(() => {
    if (statsRef.isVisible && stats.length > 0) {
      const teamsStat = stats.find(s => s.stat_key === 'teams_count');
      const matchesStat = stats.find(s => s.stat_key === 'matches_count');
      const seasonStat = stats.find(s => s.stat_key === 'season_year');
      
      if (teamsStat) startTeamsCount(teamsStat.stat_value);
      if (matchesStat) startMatchesCount(matchesStat.stat_value);
      if (seasonStat) startSeasonCount(seasonStat.stat_value);
    }
  }, [statsRef.isVisible, stats]);

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

  const loadStats = async () => {
    const { data } = await supabase
      .from('site_stats')
      .select('*')
      .order('display_order');
    setStats(data || []);
  };

  const currentMatch = liveMatch || upcomingMatch;

  return (
    <div className="min-h-screen bg-background relative">
      <AnimatedBackground />
      <Navigation />
      <LiveTicker />

      {/* Hero Section */}
      <section className="relative z-10 bg-gradient-hero py-16 px-4 overflow-hidden">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 animate-fade-in-down">
            LBPL SEASON 3
          </h1>
          <p className="text-xl md:text-2xl text-secondary mb-2 animate-fade-in-up" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
            Lad Brahmin Premiere League • 2026
          </p>
          <p className="text-lg text-white/90 mb-6 animate-fade-in-up" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
            18 Teams • One Champion
          </p>
          
          {/* Watch Live Button - Always Visible with Fallback URL */}
          <div className="animate-scale-in" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
            <Button
              asChild
              variant="destructive"
              size="lg"
              className="relative z-10 font-bold px-8 py-4 shadow-glow transition-all duration-300 hover:scale-110 hover:shadow-xl"
            >
              <a
                href={liveMatch?.youtube_stream_url || import.meta.env.VITE_YOUTUBE_LIVE_URL || "https://www.youtube.com/"}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Watch Live on YouTube"
                className="flex items-center gap-2"
              >
                <span className="animate-pulse">🔴</span>
                <span>Click Here to Watch Live</span>
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Cards */}
      <section className="container mx-auto px-4 py-8 mb-12" ref={statsRef.elementRef}>
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 transition-all duration-700 ${statsRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <Card className="p-6 bg-white shadow-card hover:shadow-glow hover:-translate-y-2 transition-all duration-300 cursor-pointer group">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                <Users className="text-primary" size={28} />
              </div>
              <div>
                <p className="text-3xl font-bold text-primary">{teamsCount}</p>
                <p className="text-sm text-muted-foreground">Teams</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white shadow-card hover:shadow-gold hover:-translate-y-2 transition-all duration-300 cursor-pointer group">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-secondary/10 rounded-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                <Trophy className="text-secondary" size={28} />
              </div>
              <div>
                <p className="text-3xl font-bold text-secondary">{matchesCount}</p>
                <p className="text-sm text-muted-foreground">Matches</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white shadow-card hover:shadow-glow hover:-translate-y-2 transition-all duration-300 cursor-pointer group">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-success/10 rounded-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                <Calendar className="text-success" size={28} />
              </div>
              <div>
                <p className="text-3xl font-bold text-success">{seasonCount}</p>
                <p className="text-sm text-muted-foreground">Season</p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Match Timeline */}
      <MatchTimeline />

      {/* Countdown Timer */}
      {upcomingMatch && (
        <section className="container mx-auto px-4 mb-12">
          <CountdownTimer 
            targetDate={new Date(upcomingMatch.match_date)} 
            matchLabel="Match starts in"
          />
        </section>
      )}

      {/* Gallery Section */}
      <GallerySection />

      {/* Sponsors Section */}
      <SponsorsSection />
    </div>
  );
};

export default Index;