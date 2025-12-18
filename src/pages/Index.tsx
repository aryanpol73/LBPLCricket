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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Users, Calendar, Crown, Award, Star, TrendingUp, Target } from "lucide-react";
import { useCountUp } from "@/hooks/useCountUp";
import { TeamDetailDialog } from "@/components/TeamDetailDialog";
import { Link } from "react-router-dom";

const Index = () => {
  const location = useLocation();
  const [liveMatch, setLiveMatch] = useState<any>(null);
  const [stats, setStats] = useState<any[]>([]);
  const [players, setPlayers] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [showAllTeams, setShowAllTeams] = useState(false);
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
    loadPlayerStats();
    loadTeams();
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

  const loadPlayerStats = async () => {
    const { data } = await supabase.from('players').select(`
        *,
        teams(name, logo_url)
      `).order('runs_scored', { ascending: false });
    setPlayers(data || []);
  };

  const loadTeams = async () => {
    const { data } = await supabase.from('teams').select(`
        *,
        players(*)
      `).order('name');
    setTeams(data || []);
  };

  const getTopBatsmen = () => {
    return [...players].filter(p => p.runs_scored > 0).sort((a, b) => b.runs_scored - a.runs_scored).slice(0, 10);
  };
  const getTopBowlers = () => {
    return [...players].filter(p => p.wickets_taken > 0).sort((a, b) => b.wickets_taken - a.wickets_taken).slice(0, 10);
  };
  const getHighestStrikeRate = () => {
    return [...players].filter(p => p.strike_rate > 0).sort((a, b) => b.strike_rate - a.strike_rate).slice(0, 10);
  };
  const getHighestAverage = () => {
    return [...players].filter(p => p.batting_average > 0).sort((a, b) => b.batting_average - a.batting_average).slice(0, 10);
  };
  const getBestEconomy = () => {
    return [...players].filter(p => p.economy_rate > 0).sort((a, b) => a.economy_rate - b.economy_rate).slice(0, 10);
  };
  const getTopFielders = () => {
    return [...players].filter(p => p.catches + p.stumpings > 0).sort((a, b) => b.catches + b.stumpings - (a.catches + a.stumpings)).slice(0, 10);
  };
  const handleTeamClick = (team: any) => {
    setSelectedTeam(team);
    setDialogOpen(true);
  };
  const getRankBadgeStyles = (rank: number) => {
    if (rank === 1) {
      return {
        bg: 'from-[#F9C846] to-[#d4a837]',
        border: 'border-[#F9C846]',
        shadow: 'shadow-[0_0_20px_rgba(249,200,70,0.6)]',
        text: 'text-[#0A1325]',
        icon: <Crown className="w-4 h-4" />
      };
    } else if (rank === 2) {
      return {
        bg: 'from-gray-300 to-gray-500',
        border: 'border-gray-400',
        shadow: 'shadow-[0_0_15px_rgba(200,200,200,0.4)]',
        text: 'text-white',
        icon: <Award className="w-4 h-4" />
      };
    } else if (rank === 3) {
      return {
        bg: 'from-amber-700 to-amber-900',
        border: 'border-amber-600',
        shadow: 'shadow-[0_0_15px_rgba(217,119,6,0.4)]',
        text: 'text-white',
        icon: <Star className="w-4 h-4" />
      };
    }
    return {
      bg: 'from-[#2E73FF]/30 to-[#2E73FF]/10',
      border: 'border-[#2E73FF]/40',
      shadow: '',
      text: 'text-[#F9C846]',
      icon: null
    };
  };


  const StatCard = ({
    title,
    players,
    stat,
    icon: Icon
  }: any) => {
    const hasLiveData = players.length > 0;
    
    return <Card className="p-4 md:p-6 bg-gradient-to-br from-[#0F1B35] via-[#0A1325] to-[#0F1B35] border-[#F9C846]/30 shadow-2xl hover:shadow-[0_0_40px_rgba(249,200,70,0.3)] transition-all duration-500 animate-fade-in-up backdrop-blur-sm h-full">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-[#F9C846]/10 border border-[#F9C846]/30">
            <Icon className="text-[#F9C846]" size={20} />
          </div>
          <h3 className="text-lg md:text-xl font-bold text-white">{title}</h3>
        </div>
        
        {hasLiveData ? (
          <div className="space-y-2">
            {players.slice(0, 3).map((player: any, index: number) => {
              const rank = index + 1;
              const rankStyles = getRankBadgeStyles(rank);
              
              return (
                <div 
                  key={player.id}
                  className={`
                    group relative flex items-center gap-2 md:gap-3 p-2 md:p-3 rounded-lg
                    bg-gradient-to-r from-[#2E73FF]/10 via-[#2E73FF]/5 to-transparent
                    border border-[#F9C846]/20
                    hover:border-[#F9C846]/50 hover:bg-[#2E73FF]/20
                    transition-all duration-300
                    ${rank <= 3 ? 'hover:shadow-[0_0_15px_rgba(249,200,70,0.2)]' : ''}
                  `}
                >
                  {/* Rank Badge */}
                  <div className={`
                    relative flex-shrink-0 w-8 h-8 md:w-10 md:h-10
                    rounded-full bg-gradient-to-br ${rankStyles.bg}
                    border-2 ${rankStyles.border} ${rankStyles.shadow}
                    flex items-center justify-center
                    font-bold text-sm md:text-base ${rankStyles.text}
                  `}>
                    {rank <= 3 && rankStyles.icon && (
                      <div className="absolute -top-1 -right-1 scale-75">
                        {rankStyles.icon}
                      </div>
                    )}
                    {rank}
                  </div>

                  {/* Player Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-white text-xs md:text-sm truncate group-hover:text-[#F9C846] transition-colors">
                      {player.name}
                    </p>
                    {player.teams && (
                      <p className="text-[10px] md:text-xs text-gray-400 truncate">
                        {player.teams.name}
                      </p>
                    )}
                  </div>

                  {/* Stat Value */}
                  <div className={`
                    flex-shrink-0 px-2 md:px-3 py-1 rounded-full
                    ${rank === 1 ? 'bg-gradient-to-r from-[#F9C846]/30 to-[#F9C846]/10 border border-[#F9C846]/50' : 'bg-[#2E73FF]/20 border border-[#2E73FF]/30'}
                    font-bold text-xs md:text-sm
                    ${rank === 1 ? 'text-[#F9C846]' : 'text-white'}
                  `}>
                    {stat(player)}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Statistics will be available once the tournament starts</p>
          </div>
        )}
      </Card>;
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

      {/* Points Table Section - Coming Soon */}
      <section id="pointsTable" className="reveal-right container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Trophy className="text-secondary" size={32} />
          <h2 className="text-4xl font-bold text-primary">Points Table - Season 3</h2>
        </div>

        <Card className="p-8 bg-card border border-border text-center">
          <Trophy className="mx-auto mb-4 text-secondary" size={48} />
          <p className="text-muted-foreground text-lg">Points table will be available once the tournament starts</p>
        </Card>
        
        <div className="text-center mt-8">
          <Button asChild size="lg" className="font-semibold">
            <Link to="/points-table">View Points Table</Link>
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

        <Tabs defaultValue="batting" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid bg-[#0F1B35] border-[#F9C846]/30">
            <TabsTrigger value="batting">Batting</TabsTrigger>
            <TabsTrigger value="bowling">Bowling</TabsTrigger>
            <TabsTrigger value="fielding">Fielding</TabsTrigger>
          </TabsList>

          <TabsContent value="batting" className="space-y-6">
            <div className="flex lg:grid lg:grid-cols-3 gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory" style={{ touchAction: 'pan-y pan-x' }}>
              <div className="min-w-[280px] lg:min-w-0 snap-start"><StatCard title="Top Run Scorers" players={getTopBatsmen()} stat={(p: any) => `${p.runs_scored} runs`} icon={Trophy} /></div>
              <div className="min-w-[280px] lg:min-w-0 snap-start"><StatCard title="Highest Strike Rate" players={getHighestStrikeRate()} stat={(p: any) => `${p.strike_rate.toFixed(2)}`} icon={TrendingUp} /></div>
              <div className="min-w-[280px] lg:min-w-0 snap-start"><StatCard title="Best Batting Average" players={getHighestAverage()} stat={(p: any) => `${p.batting_average.toFixed(2)}`} icon={Award} /></div>
            </div>
          </TabsContent>

          <TabsContent value="bowling" className="space-y-6">
            <div className="flex lg:grid lg:grid-cols-2 gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory" style={{ touchAction: 'pan-y pan-x' }}>
              <div className="min-w-[280px] lg:min-w-0 snap-start"><StatCard title="Top Wicket Takers" players={getTopBowlers()} stat={(p: any) => `${p.wickets_taken} wickets`} icon={Target} /></div>
              <div className="min-w-[280px] lg:min-w-0 snap-start"><StatCard title="Best Economy Rate" players={getBestEconomy()} stat={(p: any) => `${p.economy_rate.toFixed(2)}`} icon={TrendingUp} /></div>
            </div>
          </TabsContent>

          <TabsContent value="fielding" className="space-y-6">
            <div className="flex lg:grid lg:grid-cols-1 max-w-2xl mx-auto gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory" style={{ touchAction: 'pan-y pan-x' }}>
              <div className="min-w-[280px] lg:min-w-0 snap-start"><StatCard title="Top Fielders" players={getTopFielders()} stat={(p: any) => `${p.catches + p.stumpings} dismissals`} icon={Award} /></div>
            </div>
          </TabsContent>
        </Tabs>
        
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
