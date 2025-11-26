import { Navigation } from "@/components/Navigation";
import { CountdownTimer } from "@/components/CountdownTimer";
import { MatchPredictionPoll } from "@/components/MatchPredictionPoll";
import { MatchTimeline } from "@/components/MatchTimeline";
import { SponsorsSection } from "@/components/SponsorsSection";
import { GallerySection } from "@/components/GallerySection";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { MatchesSection } from "@/components/MatchesSection";
import { LiveTicker } from "@/components/LiveTicker";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Users, Calendar, Crown, Award, Star, TrendingUp, Target } from "lucide-react";
import { useCountUp } from "@/hooks/useCountUp";
import { TeamDetailDialog } from "@/components/TeamDetailDialog";

const Index = () => {
  const [liveMatch, setLiveMatch] = useState<any>(null);
  const [upcomingMatch, setUpcomingMatch] = useState<any>(null);
  const [stats, setStats] = useState<any[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [round1Standings, setRound1Standings] = useState<any[]>([]);
  const [players, setPlayers] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [showAllTeams, setShowAllTeams] = useState(false);
  const [showAllGroupA, setShowAllGroupA] = useState(false);
  const [showAllGroupB, setShowAllGroupB] = useState(false);
  const [showAllGroupC, setShowAllGroupC] = useState(false);
  const [showAllGroupD, setShowAllGroupD] = useState(false);
  const [showAllGroupE, setShowAllGroupE] = useState(false);
  const [showAllGroupF, setShowAllGroupF] = useState(false);
  
  const { count: teamsCount, startCounting: startTeamsCount } = useCountUp(0, 500);
  const { count: matchesCount, startCounting: startMatchesCount } = useCountUp(0, 500);
  const { count: seasonCount, startCounting: startSeasonCount } = useCountUp(0, 500);

  useEffect(() => {
    loadMatches();
    loadStats();
    loadResults();
    loadStandings();
    loadPlayerStats();
    loadTeams();
  }, []);

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

  const loadMatches = async () => {
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
  };

  const loadStats = async () => {
    const { data } = await supabase
      .from('site_stats')
      .select('*')
      .order('display_order');
    setStats(data || []);
  };

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
      .order('match_date', { ascending: false });

    setResults(data || []);
  };

  const loadStandings = async () => {
    const { data } = await supabase
      .from('points_table')
      .select(`
        *,
        team:teams(*)
      `)
      .eq('round', 1)
      .order('group_name', { ascending: true })
      .order('points', { ascending: false })
      .order('net_run_rate', { ascending: false });

    setRound1Standings(data || []);
  };

  const loadPlayerStats = async () => {
    const { data } = await supabase
      .from('players')
      .select(`
        *,
        teams(name, logo_url)
      `)
      .order('runs_scored', { ascending: false });

    setPlayers(data || []);
  };

  const loadTeams = async () => {
    const { data } = await supabase
      .from('teams')
      .select(`
        *,
        players(*)
      `)
      .order('name');

    setTeams(data || []);
  };

  const currentMatch = liveMatch || upcomingMatch;
  const groups = ['A', 'B', 'C', 'D', 'E', 'F'];
  
  const getGroupStandings = (groupName: string) => {
    return round1Standings.filter(row => row.group_name === groupName);
  };

  const getTopBatsmen = () => {
    return [...players]
      .filter(p => p.runs_scored > 0)
      .sort((a, b) => b.runs_scored - a.runs_scored)
      .slice(0, 10);
  };

  const getTopBowlers = () => {
    return [...players]
      .filter(p => p.wickets_taken > 0)
      .sort((a, b) => b.wickets_taken - a.wickets_taken)
      .slice(0, 10);
  };

  const getHighestStrikeRate = () => {
    return [...players]
      .filter(p => p.strike_rate > 0)
      .sort((a, b) => b.strike_rate - a.strike_rate)
      .slice(0, 10);
  };

  const getHighestAverage = () => {
    return [...players]
      .filter(p => p.batting_average > 0)
      .sort((a, b) => b.batting_average - a.batting_average)
      .slice(0, 10);
  };

  const getBestEconomy = () => {
    return [...players]
      .filter(p => p.economy_rate > 0)
      .sort((a, b) => a.economy_rate - b.economy_rate)
      .slice(0, 10);
  };

  const getTopFielders = () => {
    return [...players]
      .filter(p => (p.catches + p.stumpings) > 0)
      .sort((a, b) => (b.catches + b.stumpings) - (a.catches + a.stumpings))
      .slice(0, 10);
  };

  const handleTeamClick = (team: any) => {
    setSelectedTeam(team);
    setDialogOpen(true);
  };

  const StatCard = ({ title, players, stat, icon: Icon }: any) => {
    const topThree = players.slice(0, 3);
    
    return (
      <Card className="p-8 bg-gradient-to-br from-[#2E73FF]/20 via-[#2E73FF]/10 to-transparent border-[#F9C846]/30 shadow-2xl hover:shadow-[0_0_40px_rgba(249,200,70,0.3)] transition-all duration-500 animate-fade-in-up backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 rounded-lg bg-[#F9C846]/10 border border-[#F9C846]/30">
            <Icon className="text-[#F9C846]" size={28} />
          </div>
          <h3 className="text-2xl font-bold text-white">{title}</h3>
        </div>
        
        <div className="flex justify-center items-end gap-6 min-h-[320px]">
          {topThree.length === 0 ? (
            <p className="text-center text-gray-400 py-12">No statistics available yet</p>
          ) : (
            <>
              {/* Second Place */}
              {topThree[1] && (
                <div className="flex flex-col items-center animate-fade-in-up" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
                  <div className="relative group">
                    <div className="relative w-32 h-40 bg-gradient-to-b from-[#0A1325] to-[#0F1B35] rounded-t-full flex flex-col items-center justify-center border-2 border-[#F9C846] shadow-[0_0_20px_rgba(249,200,70,0.4)] transition-all duration-300 group-hover:shadow-[0_0_30px_rgba(249,200,70,0.6)] group-hover:scale-105">
                      <div className="w-16 h-16 rounded-full bg-[#2E73FF]/30 border-2 border-[#F9C846]/50 flex items-center justify-center mb-2">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-b from-[#F9C846]/40 to-transparent"></div>
                      </div>
                      <div className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-br from-gray-300 to-gray-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg border-2 border-white">
                        2
                      </div>
                      <div className="mt-2 text-center">
                        <p className="text-xl font-bold text-[#F9C846]">{stat(topThree[1])}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* First Place */}
              {topThree[0] && (
                <div className="flex flex-col items-center animate-fade-in-up mb-8" style={{ animationDelay: '0s', animationFillMode: 'both' }}>
                  <div className="relative group">
                    <div className="relative w-40 h-48 bg-gradient-to-b from-[#0A1325] to-[#0F1B35] rounded-t-full flex flex-col items-center justify-center border-[3px] border-[#F9C846] shadow-[0_0_30px_rgba(249,200,70,0.5)] transition-all duration-300 group-hover:shadow-[0_0_40px_rgba(249,200,70,0.7)] group-hover:scale-105 animate-pulse-glow">
                      <div className="w-20 h-20 rounded-full bg-[#2E73FF]/40 border-2 border-[#F9C846]/60 flex items-center justify-center mb-3">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-b from-[#F9C846]/50 to-transparent"></div>
                      </div>
                      <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-[#F9C846] to-[#d4a837] rounded-full flex items-center justify-center text-[#0A1325] font-bold text-xl shadow-xl border-2 border-white">
                        1
                      </div>
                      <Trophy className="absolute -top-8 text-[#F9C846] animate-bounce-subtle" size={24} />
                      <div className="mt-2 text-center">
                        <p className="text-2xl font-bold text-[#F9C846]">{stat(topThree[0])}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Third Place */}
              {topThree[2] && (
                <div className="flex flex-col items-center animate-fade-in-up" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
                  <div className="relative group">
                    <div className="relative w-32 h-40 bg-gradient-to-b from-[#0A1325] to-[#0F1B35] rounded-t-full flex flex-col items-center justify-center border-2 border-[#F9C846] shadow-[0_0_20px_rgba(249,200,70,0.4)] transition-all duration-300 group-hover:shadow-[0_0_30px_rgba(249,200,70,0.6)] group-hover:scale-105">
                      <div className="w-16 h-16 rounded-full bg-[#2E73FF]/30 border-2 border-[#F9C846]/50 flex items-center justify-center mb-2">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-b from-[#F9C846]/40 to-transparent"></div>
                      </div>
                      <div className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-br from-amber-700 to-amber-900 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg border-2 border-white">
                        3
                      </div>
                      <div className="mt-2 text-center">
                        <p className="text-xl font-bold text-[#F9C846]">{stat(topThree[2])}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-background relative">
      <AnimatedBackground />
      <Navigation />
      
      {/* Live Ticker Banner */}
      <LiveTicker />

      {/* Hero Section */}
      <section id="home" className="relative z-10 bg-gradient-hero py-16 px-4 overflow-hidden">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 animate-fade-in-down">
            LBPL SEASON 3 - 2026
          </h1>
          <p className="text-xl md:text-2xl text-secondary mb-6 animate-fade-in-up" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
            18 Teams • One Champion
          </p>
          
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
                className="flex items-center gap-2"
              >
                <span className="animate-pulse">🔴</span>
                <span>Watch Live</span>
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* League Stats Section */}
      <section id="league-stats" className="reveal container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6 bg-card shadow-card hover:shadow-glow hover:-translate-y-2 transition-all duration-300">
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

          <Card className="p-6 bg-card shadow-card hover:shadow-gold hover:-translate-y-2 transition-all duration-300">
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
      <section id="timeline" className="reveal">
        <MatchTimeline />
      </section>

      {/* Points Table Section */}
      <section id="points" className="reveal container mx-auto px-4 py-12">
        <div className="flex items-center gap-3 mb-8">
          <Trophy className="text-secondary" size={32} />
          <h2 className="text-4xl font-bold text-primary">Points Table - Season 3</h2>
        </div>

        <Tabs defaultValue="round1" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-6">
            <TabsTrigger value="round1">Round 1</TabsTrigger>
            <TabsTrigger value="round2">Round 2</TabsTrigger>
          </TabsList>

          <TabsContent value="round1" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {groups.map((group) => {
                const groupStandings = getGroupStandings(group);
                const showAllMap: Record<string, boolean> = {
                  'A': showAllGroupA,
                  'B': showAllGroupB,
                  'C': showAllGroupC,
                  'D': showAllGroupD,
                  'E': showAllGroupE,
                  'F': showAllGroupF,
                };
                const setShowAllMap: Record<string, (val: boolean) => void> = {
                  'A': setShowAllGroupA,
                  'B': setShowAllGroupB,
                  'C': setShowAllGroupC,
                  'D': setShowAllGroupD,
                  'E': setShowAllGroupE,
                  'F': setShowAllGroupF,
                };
                const showAll = showAllMap[group];
                const setShowAll = setShowAllMap[group];
                const displayedStandings = showAll ? groupStandings : groupStandings.slice(0, 2);
                
                return (
                  <div key={group} className="bg-card rounded-xl shadow-card overflow-hidden">
                    <div className="bg-gradient-hero p-4">
                      <h3 className="text-xl font-bold text-white">Group {group}</h3>
                    </div>
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead className="font-bold">Rank</TableHead>
                          <TableHead className="font-bold">Team</TableHead>
                          <TableHead className="font-bold text-center">P</TableHead>
                          <TableHead className="font-bold text-center">W</TableHead>
                          <TableHead className="font-bold text-center">L</TableHead>
                          <TableHead className="font-bold text-center">NRR</TableHead>
                          <TableHead className="font-bold text-center">Pts</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {displayedStandings.length > 0 ? (
                          displayedStandings.map((row, index) => (
                            <TableRow 
                              key={row.id} 
                              className={`hover:bg-muted/50 transition-all duration-300 ${index < 2 ? 'bg-success/5' : ''}`}
                            >
                              <TableCell>
                                <span className="font-bold">{groupStandings.indexOf(row) + 1}</span>
                              </TableCell>
                              <TableCell>
                                <div className="font-bold text-foreground text-sm">
                                  {row.team?.name}
                                </div>
                              </TableCell>
                              <TableCell className="text-center font-medium text-sm">
                                {row.matches_played}
                              </TableCell>
                              <TableCell className="text-center font-medium text-success text-sm">
                                {row.wins}
                              </TableCell>
                              <TableCell className="text-center font-medium text-destructive text-sm">
                                {row.losses}
                              </TableCell>
                              <TableCell className="text-center font-mono text-sm">
                                {row.net_run_rate.toFixed(2)}
                              </TableCell>
                              <TableCell className="text-center">
                                <Badge className="bg-primary font-bold">
                                  {row.points}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center py-8 text-muted-foreground text-sm">
                              No teams yet
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                    {groupStandings.length > 2 && (
                      <div className="text-center p-4 bg-muted/20">
                        <button
                          onClick={() => setShowAll(!showAll)}
                          className="px-6 py-2 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-glow text-sm"
                        >
                          {showAll ? 'View Less' : `View More (${groupStandings.length - 2} more)`}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="round2">
            <div className="text-center py-12">
              <Trophy className="text-secondary mx-auto mb-4" size={48} />
              <h3 className="text-2xl font-bold text-primary mb-2">Round 2 Coming Soon</h3>
              <p className="text-muted-foreground">
                Round 2 will feature the top 12 teams from Round 1, divided into 4 groups.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* Results Section */}
      <section id="results" className="reveal container mx-auto px-4 py-12">
        <div className="flex items-center justify-center gap-3 mb-8">
          <Trophy className="text-[hsl(45,90%,55%)]" size={40} strokeWidth={2.5} />
          <h2 className="text-5xl font-bold bg-gradient-gold bg-clip-text text-transparent">
            Match Results
          </h2>
          <Crown className="text-[hsl(45,90%,55%)]" size={40} strokeWidth={2.5} />
        </div>

        <div className="relative bg-gradient-gold-premium rounded-3xl p-8 shadow-premium">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/40 via-transparent to-white/20 pointer-events-none" />
          
          <div className="relative space-y-6">
            {results.length > 0 ? (
              results.map((match) => (
                <Card key={match.id} className="bg-card/95 backdrop-blur-sm border-2 border-[hsl(45,70%,75%)] shadow-gold-soft hover:shadow-gold hover:scale-[1.02] transition-all duration-300">
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-center">
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

                      <div className="md:col-span-2">
                        <div className="font-semibold text-lg text-foreground">
                          {match.team_a?.name}
                          <span className="text-muted-foreground mx-2">vs</span>
                          {match.team_b?.name}
                        </div>
                      </div>

                      <div className="md:col-span-1 text-center">
                        <div className="text-xs text-muted-foreground font-medium mb-1">Score</div>
                        <div className="font-mono text-2xl font-bold text-foreground bg-muted/50 rounded-lg px-3 py-1 inline-block">
                          {match.team_a_score} - {match.team_b_score}
                        </div>
                      </div>

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

                      <div className="md:col-span-1 text-center">
                        <div className="text-xs text-muted-foreground font-medium mb-1">Phase</div>
                        <Badge className="bg-primary text-primary-foreground font-semibold">
                          {match.match_phase?.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <Card className="bg-card/95 backdrop-blur-sm border-2 border-[hsl(45,70%,75%)] shadow-gold-soft">
                <div className="p-12 text-center">
                  <Award className="mx-auto text-[hsl(45,70%,60%)] mb-4" size={48} />
                  <p className="text-muted-foreground text-lg">No completed matches yet</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* Player Stats Section */}
      <section id="player-stats" className="reveal container mx-auto px-4 py-12">
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
            <div className="relative">
              <div className="flex gap-6 overflow-x-auto overflow-y-visible pb-4 snap-x snap-mandatory scroll-smooth touch-pan-x scrollbar-thin scrollbar-thumb-[#F9C846]/50 scrollbar-track-[#0F1B35]/50 hover:scrollbar-thumb-[#F9C846]">
                <div className="flex-none w-[90vw] md:w-[45vw] lg:w-[30vw] snap-center">
                  <StatCard
                    title="Top Run Scorers"
                    players={getTopBatsmen()}
                    stat={(p: any) => `${p.runs_scored} runs`}
                    icon={Trophy}
                  />
                </div>
                <div className="flex-none w-[90vw] md:w-[45vw] lg:w-[30vw] snap-center">
                  <StatCard
                    title="Highest Strike Rate"
                    players={getHighestStrikeRate()}
                    stat={(p: any) => `${p.strike_rate.toFixed(2)}`}
                    icon={TrendingUp}
                  />
                </div>
                <div className="flex-none w-[90vw] md:w-[45vw] lg:w-[30vw] snap-center">
                  <StatCard
                    title="Best Batting Average"
                    players={getHighestAverage()}
                    stat={(p: any) => `${p.batting_average.toFixed(2)}`}
                    icon={Award}
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="bowling" className="space-y-6">
            <div className="relative">
              <div className="flex gap-6 overflow-x-auto overflow-y-visible pb-4 snap-x snap-mandatory scroll-smooth touch-pan-x scrollbar-thin scrollbar-thumb-[#F9C846]/50 scrollbar-track-[#0F1B35]/50 hover:scrollbar-thumb-[#F9C846]">
                <div className="flex-none w-[90vw] md:w-[45vw] lg:w-[30vw] snap-center">
                  <StatCard
                    title="Top Wicket Takers"
                    players={getTopBowlers()}
                    stat={(p: any) => `${p.wickets_taken} wickets`}
                    icon={Target}
                  />
                </div>
                <div className="flex-none w-[90vw] md:w-[45vw] lg:w-[30vw] snap-center">
                  <StatCard
                    title="Best Economy Rate"
                    players={getBestEconomy()}
                    stat={(p: any) => `${p.economy_rate.toFixed(2)}`}
                    icon={TrendingUp}
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="fielding" className="space-y-6">
            <StatCard
              title="Top Fielders"
              players={getTopFielders()}
              stat={(p: any) => `${p.catches + p.stumpings} dismissals`}
              icon={Award}
            />
          </TabsContent>
        </Tabs>
      </section>

      {/* Matches Section */}
      <section id="matches" className="reveal">
        <MatchesSection />
      </section>

      {/* Teams Section */}
      <section id="teams" className="reveal container mx-auto px-4 py-12">
        <div className="flex items-center gap-3 mb-8">
          <Users className="text-secondary" size={32} />
          <h2 className="text-4xl font-bold text-primary">All Teams</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(showAllTeams ? teams : teams.slice(0, 3)).map((team) => (
            <Card 
              key={team.id} 
              className="p-6 bg-gradient-team-card shadow-card hover:shadow-glow transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] cursor-pointer border-2 border-primary/20 bg-blue-500/5"
              onClick={() => handleTeamClick(team)}
            >
              <div className="flex items-start gap-4 mb-4">
                {team.logo_url && (
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 transition-transform duration-300 hover:scale-110 hover:rotate-6">
                    <img 
                      src={team.logo_url} 
                      alt={team.name} 
                      className="w-12 h-12 object-contain"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-primary mb-1">
                    {team.name}
                  </h3>
                  {team.home_city && (
                    <p className="text-sm text-muted-foreground">
                      📍 {team.home_city}
                    </p>
                  )}
                </div>
              </div>

              {team.fun_fact && (
                <div className="mb-4 p-3 bg-secondary/10 rounded-lg transition-all duration-300 hover:bg-secondary/20">
                  <p className="text-sm text-foreground italic">
                    💡 {team.fun_fact}
                  </p>
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-border/50">
                <p className="text-sm text-muted-foreground text-center">
                  Click to view complete squad
                </p>
              </div>
            </Card>
          ))}
        </div>

        {teams.length > 3 && (
          <div className="text-center mt-8">
            <button
              onClick={() => setShowAllTeams(!showAllTeams)}
              className="px-8 py-3 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-glow"
            >
              {showAllTeams ? 'View Less' : `View More (${teams.length - 3} more teams)`}
            </button>
          </div>
        )}
      </section>

      {/* Sponsors Section */}
      <section id="sponsors" className="reveal">
        <SponsorsSection />
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="reveal">
        <GallerySection />
      </section>

      <TeamDetailDialog
        team={selectedTeam}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
};

export default Index;
