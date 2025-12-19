import { Navigation } from "@/components/Navigation";
import { SponsorsSection } from "@/components/SponsorsSection";
import { GallerySection } from "@/components/GallerySection";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { LiveTicker } from "@/components/LiveTicker";
import { CommunitySection } from "@/components/CommunitySection";
import { MatchTimeline } from "@/components/MatchTimeline";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Users, Calendar, Crown } from "lucide-react";
import { useCountUp } from "@/hooks/useCountUp";
import { TeamDetailDialog } from "@/components/TeamDetailDialog";
import { Link } from "react-router-dom";

const Index = () => {
  const location = useLocation();
  const [liveMatch, setLiveMatch] = useState<any>(null);
  const [stats, setStats] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [showAllTeams, setShowAllTeams] = useState(false);
  const [cricherosStatsUrl, setCricherosStatsUrl] = useState<string>('');
  const {
    count: teamsCount,
    startCounting: startTeamsCount
  } = useCountUp(0, 500);
  const {
    count: matchesCount,
    startCounting: startMatchesCount
  } = useCountUp(0, 500);
  const {
    count: seasonCount,
    startCounting: startSeasonCount
  } = useCountUp(0, 500);
  useEffect(() => {
    loadLiveMatch();
    loadStats();
    loadTeams();
    loadCricherosUrl();
  }, []);

  // Handle hash navigation from other pages
  useEffect(() => {
    if (location.hash) {
      const targetId = location.hash.replace("#", "");
      setTimeout(() => {
        const element = document.getElementById(targetId);
        if (element) {
          const navHeight = 64;
          const elementPosition = element.getBoundingClientRect().top + window.scrollY;
          window.scrollTo({
            top: elementPosition - navHeight,
            behavior: "smooth"
          });
        }
      }, 100);
    }
  }, [location.hash]);

  useEffect(() => {
    if (stats.length > 0) {
      const teamsStat = stats.find(s => s.stat_key === 'teams_count');
      const matchesStat = stats.find(s => s.stat_key === 'matches_count');
      const seasonStat = stats.find(s => s.stat_key === 'season_year');
      if (teamsStat) startTeamsCount(teamsStat.stat_value);
      if (matchesStat) startMatchesCount(matchesStat.stat_value);
      if (seasonStat) startSeasonCount(seasonStat.stat_value);
    }
  }, [stats]);

  const loadLiveMatch = async () => {
    const { data: live } = await supabase.from('matches').select(`
        *,
        team_a:teams!matches_team_a_id_fkey(*),
        team_b:teams!matches_team_b_id_fkey(*)
      `).eq('status', 'live').order('match_date', { ascending: true }).limit(1).maybeSingle();
    setLiveMatch(live);
  };

  const loadStats = async () => {
    const { data } = await supabase.from('site_stats').select('*').order('display_order');
    setStats(data || []);
  };

  const loadTeams = async () => {
    const { data } = await supabase.from('teams').select(`
        *,
        players(*)
      `).order('name');
    setTeams(data || []);
  };

  const loadCricherosUrl = async () => {
    const { data } = await supabase
      .from('tournament_settings')
      .select('setting_value')
      .eq('setting_key', 'cricheroes_stats_url')
      .maybeSingle();
    
    if (data?.setting_value) {
      setCricherosStatsUrl(data.setting_value);
    }
  };
  const handleTeamClick = (team: any) => {
    setSelectedTeam(team);
    setDialogOpen(true);
  };

  return <div className="min-h-screen bg-background relative pt-16">
      <AnimatedBackground />
      
      {/* Navigation */}
      <Navigation />
      
      {/* Live Ticker Banner */}
      <LiveTicker />

      {/* Hero Section */}
      <section id="home" className="relative z-10 bg-gradient-hero py-12 px-4 overflow-hidden">
        <div className="container mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-7xl font-bold text-white mb-4 animate-fade-in-down">LBPL SEASON 3</h1>
          <p className="text-xl md:text-2xl text-secondary mb-6 animate-fade-in-up" style={{
          animationDelay: '0.2s',
          animationFillMode: 'both'
        }}>
            18 Teams • One Champion
          </p>
          
          <div className="animate-scale-in" style={{
          animationDelay: '0.4s',
          animationFillMode: 'both'
        }}>
            <Button asChild variant="destructive" size="lg" className="relative z-10 font-bold px-8 py-4 shadow-glow transition-all duration-300 hover:scale-110 hover:shadow-xl">
              <a href={liveMatch?.youtube_stream_url || import.meta.env.VITE_YOUTUBE_LIVE_URL || "https://www.youtube.com/"} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                <span className="animate-pulse">🔴</span>
                <span>Click Here To Watch Live</span>
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* League Stats Section */}
      <section id="league-stats" className="reveal-scale container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/teams">
            <Card className="p-6 bg-card shadow-card hover:shadow-glow hover:-translate-y-2 transition-all duration-300 cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Users className="text-primary" size={28} />
                </div>
                <div>
                  <p className="text-3xl font-bold text-primary">{teamsCount}</p>
                  <p className="text-sm text-muted-foreground">Teams</p>
                </div>
              </div>
            </Card>
          </Link>

          <Link to="/matches">
            <Card className="p-6 bg-card shadow-card hover:shadow-gold hover:-translate-y-2 transition-all duration-300 cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-secondary/10 rounded-lg">
                  <Trophy className="text-secondary" size={28} />
                </div>
                <div>
                  <p className="text-3xl font-bold text-secondary">{matchesCount}</p>
                  <p className="text-sm text-muted-foreground">Matches</p>
                </div>
              </div>
            </Card>
          </Link>

          <Card className="p-6 bg-card shadow-card hover:shadow-glow hover:-translate-y-2 transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-success/10 rounded-lg">
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

      {/* Match Timeline Section */}
      <MatchTimeline />

      {/* Points Table Section - Preview */}
      <section id="pointsTable" className="reveal-right container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Trophy className="text-secondary" size={32} />
          <h2 className="text-4xl font-bold text-primary">Points Table - Season 3</h2>
        </div>

        {/* Preview of Points Table */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Group A Preview */}
          <Card className="bg-gradient-to-br from-[#0F1B35] to-[#0A1325] border-primary/50 overflow-hidden">
            <div className="bg-gradient-to-r from-primary to-primary/80 px-4 py-3">
              <h3 className="text-lg font-bold text-white">Group A</h3>
            </div>
            <div className="grid grid-cols-8 gap-1 px-4 py-2 text-xs text-gray-400 border-b border-primary/20">
              <div>Rank</div>
              <div className="col-span-2">Team</div>
              <div className="text-center">P</div>
              <div className="text-center">W</div>
              <div className="text-center">L</div>
              <div className="text-center">NRR</div>
              <div className="text-center">Pts</div>
            </div>
            {[{rank: 1, name: 'Team 1'}, {rank: 2, name: 'Team 2'}, {rank: 3, name: 'Team 3'}].map((team) => (
              <div key={team.rank} className="grid grid-cols-8 gap-1 px-4 py-3 text-sm border-b border-primary/10 last:border-b-0">
                <div className="text-white font-semibold">{team.rank}</div>
                <div className="col-span-2 text-white font-medium truncate">{team.name}</div>
                <div className="text-center text-white">0</div>
                <div className="text-center text-green-400 font-semibold">0</div>
                <div className="text-center text-red-400 font-semibold">0</div>
                <div className="text-center text-white">0.00</div>
                <div className="text-center">
                  <span className="inline-flex items-center justify-center w-7 h-7 bg-primary text-white text-xs font-bold rounded-full">0</span>
                </div>
              </div>
            ))}
          </Card>

          {/* Group B Preview */}
          <Card className="bg-gradient-to-br from-[#0F1B35] to-[#0A1325] border-primary/50 overflow-hidden">
            <div className="bg-gradient-to-r from-primary to-primary/80 px-4 py-3">
              <h3 className="text-lg font-bold text-white">Group B</h3>
            </div>
            <div className="grid grid-cols-8 gap-1 px-4 py-2 text-xs text-gray-400 border-b border-primary/20">
              <div>Rank</div>
              <div className="col-span-2">Team</div>
              <div className="text-center">P</div>
              <div className="text-center">W</div>
              <div className="text-center">L</div>
              <div className="text-center">NRR</div>
              <div className="text-center">Pts</div>
            </div>
            {[{rank: 1, name: 'Team 4'}, {rank: 2, name: 'Team 5'}, {rank: 3, name: 'Team 6'}].map((team) => (
              <div key={team.rank} className="grid grid-cols-8 gap-1 px-4 py-3 text-sm border-b border-primary/10 last:border-b-0">
                <div className="text-white font-semibold">{team.rank}</div>
                <div className="col-span-2 text-white font-medium truncate">{team.name}</div>
                <div className="text-center text-white">0</div>
                <div className="text-center text-green-400 font-semibold">0</div>
                <div className="text-center text-red-400 font-semibold">0</div>
                <div className="text-center text-white">0.00</div>
                <div className="text-center">
                  <span className="inline-flex items-center justify-center w-7 h-7 bg-primary text-white text-xs font-bold rounded-full">0</span>
                </div>
              </div>
            ))}
          </Card>
        </div>
        
        <div className="text-center">
          <Button asChild size="lg" className="font-semibold">
            <Link to="/points-table">View Full Points Table</Link>
          </Button>
        </div>
      </section>

      {/* Results Section - Coming Soon */}
      <section id="results" className="reveal-blur container mx-auto px-4 py-8">
        <div className="flex items-center justify-center gap-3 mb-8">
          <Trophy className="text-[hsl(45,90%,55%)]" size={40} strokeWidth={2.5} />
          <h2 className="text-5xl font-bold bg-gradient-gold bg-clip-text text-transparent">
            Match Results
          </h2>
          <Crown className="text-[hsl(45,90%,55%)]" size={40} strokeWidth={2.5} />
        </div>

        <div className="relative bg-gradient-to-br from-[hsl(220,25%,12%)] via-[hsl(220,30%,15%)] to-[hsl(220,25%,10%)] rounded-3xl p-8 shadow-premium border-2 border-[hsl(45,90%,50%)]/30">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[hsl(45,90%,50%)]/10 via-transparent to-[hsl(45,90%,50%)]/5 pointer-events-none" />
          
          <div className="relative text-center py-8">
            <Trophy className="mx-auto mb-4 text-secondary" size={48} />
            <p className="text-muted-foreground text-lg">Results will be available once matches are completed</p>
          </div>
          
          <div className="text-center mt-4">
            <Button asChild size="lg" className="font-semibold bg-secondary hover:bg-secondary/90">
              <Link to="/results">View Results</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Player Stats Section */}
      <section id="playerStats" className="reveal-rotate container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 rounded-lg bg-[#F9C846]/10 border border-[#F9C846]/30">
            <Trophy className="text-[#F9C846]" size={32} />
          </div>
          <h2 className="text-4xl font-bold text-white">Player Statistics</h2>
        </div>

        {cricherosStatsUrl ? (
          <div className="w-full h-[50vh] rounded-lg overflow-hidden border border-[#F9C846]/30 mb-8">
            <iframe
              src={cricherosStatsUrl}
              className="w-full h-full border-0"
              title="Tournament Stats"
              allow="fullscreen"
            />
          </div>
        ) : (
          <Card className="p-8 bg-gradient-to-br from-[#0F1B35] to-[#0A1325] border-[#F9C846]/30 text-center">
            <Trophy className="mx-auto mb-4 text-[#F9C846]" size={48} />
            <p className="text-muted-foreground text-lg">Statistics will be available once the tournament starts</p>
          </Card>
        )}
        
        {/* View More Button for Stats - Always visible */}
        <div className="text-center mt-8">
          <Button asChild size="lg" className="font-semibold">
            <Link to="/stats">View Full Statistics</Link>
          </Button>
        </div>
      </section>

      {/* Matches Section - Coming Soon */}
      <section id="matches" className="reveal-scale container mx-auto px-4 py-8">
        <h2 className="text-4xl md:text-5xl font-bold text-primary mb-8 text-center">Match Fixtures</h2>
        <Card className="p-8 bg-card border border-border text-center">
          <Calendar className="mx-auto mb-4 text-secondary" size={48} />
          <p className="text-muted-foreground text-lg">Fixtures will be updated soon</p>
        </Card>
        <div className="text-center mt-8">
          <Button asChild size="lg" className="font-semibold">
            <Link to="/matches">View All Matches</Link>
          </Button>
        </div>
      </section>

      {/* Teams Section */}
      <section id="teams" className="reveal-left container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Users className="text-secondary" size={32} />
          <h2 className="text-4xl font-bold text-primary">All Teams</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(showAllTeams ? teams : teams.slice(0, 3)).map(team => <Card key={team.id} className="reveal-zoom-fade p-6 bg-gradient-team-card shadow-card hover:shadow-glow transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] cursor-pointer border-2 border-primary/20 bg-blue-500/5" onClick={() => handleTeamClick(team)}>
              <div className="flex items-start gap-4 mb-4">
                {team.logo_url && <div className="w-16 h-16 flex items-center justify-center flex-shrink-0 transition-transform duration-300 hover:scale-110 hover:rotate-6 overflow-hidden rounded-full border-2 border-primary/30">
                    <img src={team.logo_url} alt={team.name} width={64} height={64} loading="lazy" decoding="async" className="w-full h-full object-cover" />
                  </div>}
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-primary mb-1">
                    {team.name}
                  </h3>
                  {team.home_city && <p className="text-sm text-muted-foreground">
                      📍 {team.home_city}
                    </p>}
                </div>
              </div>

              {team.fun_fact && <div className="mb-4 p-3 bg-secondary/10 rounded-lg transition-all duration-300 hover:bg-secondary/20">
                  <p className="text-sm text-foreground italic">
                    💡 {team.fun_fact}
                  </p>
                </div>}

              <div className="mt-4 pt-4 border-t border-border/50">
                <p className="text-sm text-muted-foreground text-center">
                  Click to view complete squad
                </p>
              </div>
            </Card>)}
        </div>

        {teams.length > 3 && !showAllTeams && <div className="text-center mt-8">
            <Button asChild size="lg" className="font-semibold">
              <Link to="/teams">View All Teams</Link>
            </Button>
          </div>}
        {showAllTeams && <div className="text-center mt-8">
            <button onClick={() => setShowAllTeams(false)} className="px-8 py-3 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-glow">
              View Less
            </button>
          </div>}
      </section>

      {/* Community Section */}
      <section id="community">
        <CommunitySection />
      </section>

      {/* Sponsors Section */}
      <section id="sponsors">
        <SponsorsSection />
      </section>

      {/* Gallery Section */}
      <section id="gallery">
        <GallerySection />
      </section>

      <TeamDetailDialog team={selectedTeam} open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>;
};
export default Index;
