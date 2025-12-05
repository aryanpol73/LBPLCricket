import { Navigation } from "@/components/Navigation";
import { CountdownTimer } from "@/components/CountdownTimer";
import { MatchPredictionPoll } from "@/components/MatchPredictionPoll";
import { MatchTimeline } from "@/components/MatchTimeline";
import { SponsorsSection } from "@/components/SponsorsSection";
import { GallerySection } from "@/components/GallerySection";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { MatchesSection } from "@/components/MatchesSection";
import { LiveTicker } from "@/components/LiveTicker";
import { CommunitySection } from "@/components/CommunitySection";
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
import { Link } from "react-router-dom";

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
  const [showAllGroups, setShowAllGroups] = useState(false);
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
    const {
      data: live
    } = await supabase.from('matches').select(`
        *,
        team_a:teams!matches_team_a_id_fkey(*),
        team_b:teams!matches_team_b_id_fkey(*)
      `).eq('status', 'live').order('match_date', {
      ascending: true
    }).limit(1).single();
    const {
      data: upcoming
    } = await supabase.from('matches').select(`
        *,
        team_a:teams!matches_team_a_id_fkey(*),
        team_b:teams!matches_team_b_id_fkey(*)
      `).eq('status', 'upcoming').order('match_date', {
      ascending: true
    }).limit(1).single();
    setLiveMatch(live);
    setUpcomingMatch(upcoming);
  };
  const loadStats = async () => {
    const {
      data
    } = await supabase.from('site_stats').select('*').order('display_order');
    setStats(data || []);
  };
  const loadResults = async () => {
    const {
      data
    } = await supabase.from('matches').select(`
        *,
        team_a:teams!matches_team_a_id_fkey(*),
        team_b:teams!matches_team_b_id_fkey(*),
        winner:teams!matches_winner_id_fkey(*),
        player_of_match:players(*)
      `).eq('status', 'completed').order('match_no', {
      ascending: true
    }).limit(3);
    setResults(data || []);
  };
  const loadStandings = async () => {
    const {
      data
    } = await supabase.from('points_table').select(`
        *,
        team:teams(*)
      `).eq('round', 1).order('group_name', {
      ascending: true
    }).order('points', {
      ascending: false
    }).order('net_run_rate', {
      ascending: false
    });
    setRound1Standings(data || []);
  };
  const loadPlayerStats = async () => {
    const {
      data
    } = await supabase.from('players').select(`
        *,
        teams(name, logo_url)
      `).order('runs_scored', {
      ascending: false
    });
    setPlayers(data || []);
  };
  const loadTeams = async () => {
    const {
      data
    } = await supabase.from('teams').select(`
        *,
        players(*)
      `).order('name');
    setTeams(data || []);
  };
  const currentMatch = liveMatch || upcomingMatch;
  const groups = ['A', 'B', 'C', 'D', 'E', 'F'];
  const getGroupStandings = (groupName: string) => {
    return round1Standings.filter(row => row.group_name === groupName);
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

  // Dummy players for preview when no live data
  const dummyPlayers = [
    { id: 'd1', name: 'Rahul Sharma', teams: { name: 'Thunder Kings' }, runs_scored: 245, wickets_taken: 8, strike_rate: 142.5, batting_average: 48.2, economy_rate: 6.8, catches: 5, stumpings: 0 },
    { id: 'd2', name: 'Vikas Patel', teams: { name: 'Royal Strikers' }, runs_scored: 228, wickets_taken: 12, strike_rate: 138.4, batting_average: 45.6, economy_rate: 7.2, catches: 4, stumpings: 2 },
    { id: 'd3', name: 'Amit Kumar', teams: { name: 'Storm Warriors' }, runs_scored: 210, wickets_taken: 15, strike_rate: 135.2, batting_average: 42.0, economy_rate: 6.5, catches: 7, stumpings: 1 },
  ];

  // Dummy match results for preview
  const dummyResults = [
    { id: 'dr1', round_no: 1, match_no: 1, team_a: { name: 'Thunder Kings' }, team_b: { name: 'Royal Strikers' }, team_a_score: '156/4', team_b_score: '142/8', winner: { name: 'Thunder Kings' }, player_of_match: { name: 'Rahul Sharma' }, match_phase: 'league' },
    { id: 'dr2', round_no: 1, match_no: 2, team_a: { name: 'Storm Warriors' }, team_b: { name: 'Phoenix Rising' }, team_a_score: '178/6', team_b_score: '180/3', winner: { name: 'Phoenix Rising' }, player_of_match: { name: 'Amit Kumar' }, match_phase: 'league' },
    { id: 'dr3', round_no: 1, match_no: 3, team_a: { name: 'Golden Eagles' }, team_b: { name: 'Silver Sharks' }, team_a_score: '165/5', team_b_score: '160/7', winner: { name: 'Golden Eagles' }, player_of_match: { name: 'Vikas Patel' }, match_phase: 'league' },
  ];

  const getDummyTopBatsmen = () => dummyPlayers.sort((a, b) => b.runs_scored - a.runs_scored).slice(0, 3);
  const getDummyTopBowlers = () => dummyPlayers.sort((a, b) => b.wickets_taken - a.wickets_taken).slice(0, 3);
  const getDummyStrikeRate = () => dummyPlayers.sort((a, b) => b.strike_rate - a.strike_rate).slice(0, 3);
  const getDummyAverage = () => dummyPlayers.sort((a, b) => b.batting_average - a.batting_average).slice(0, 3);
  const getDummyEconomy = () => dummyPlayers.sort((a, b) => a.economy_rate - b.economy_rate).slice(0, 3);
  const getDummyFielders = () => dummyPlayers.sort((a, b) => (b.catches + b.stumpings) - (a.catches + a.stumpings)).slice(0, 3);

  const StatCard = ({
    title,
    players,
    stat,
    icon: Icon,
    dummyPlayers: dummyData,
    dummyStat
  }: any) => {
    const hasLiveData = players.length > 0;
    const displayPlayers = hasLiveData ? players.slice(0, 3) : dummyData?.slice(0, 3) || [];
    const statFn = hasLiveData ? stat : dummyStat || stat;
    
    return <Card className="p-4 md:p-6 bg-gradient-to-br from-[#0F1B35] via-[#0A1325] to-[#0F1B35] border-[#F9C846]/30 shadow-2xl hover:shadow-[0_0_40px_rgba(249,200,70,0.3)] transition-all duration-500 animate-fade-in-up backdrop-blur-sm h-full">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-[#F9C846]/10 border border-[#F9C846]/30">
            <Icon className="text-[#F9C846]" size={20} />
          </div>
          <h3 className="text-lg md:text-xl font-bold text-white">{title}</h3>
          {!hasLiveData && (
            <span className="ml-auto text-xs px-2 py-1 bg-[#F9C846]/20 text-[#F9C846] rounded-full">Preview</span>
          )}
        </div>
        
        <div className="space-y-2">
          {displayPlayers.map((player: any, index: number) => {
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
                  {statFn(player)}
                </div>
              </div>
            );
          })}
        </div>
      </Card>;
  };
  return <div className="min-h-screen bg-background relative">
      <AnimatedBackground />
      
      {/* Navigation */}
      <Navigation />
      
      {/* Live Ticker Banner */}
      <LiveTicker />

      {/* Hero Section */}
      <section id="home" className="relative z-10 bg-gradient-hero py-16 px-4 overflow-hidden">
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
      <section id="league-stats" className="reveal-scale container mx-auto px-4 py-12">
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
      <section id="matchTimeline" className="reveal-left">
        <MatchTimeline />
      </section>

      {/* Countdown and Prediction Section */}
      {upcomingMatch && (
        <section className="reveal-zoom-fade container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            <CountdownTimer 
              targetDate={new Date(upcomingMatch.match_date)}
              matchNo={upcomingMatch.match_no}
              matchLabel="Next Match"
            />
            <MatchPredictionPoll
              matchId={upcomingMatch.id}
              teamAId={upcomingMatch.team_a?.id}
              teamBId={upcomingMatch.team_b?.id}
              teamAName={upcomingMatch.team_a?.name || "Team A"}
              teamBName={upcomingMatch.team_b?.name || "Team B"}
            />
          </div>
        </section>
      )}

      {/* Points Table Section */}
      <section id="pointsTable" className="reveal-right container mx-auto px-4 py-12">
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
              {(showAllGroups ? groups : groups.slice(0, 2)).map(group => {
              const groupStandings = getGroupStandings(group);
              return <div key={group} className="bg-card rounded-xl shadow-card overflow-hidden">
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
                        {groupStandings.length > 0 ? groupStandings.map((row, index) => <TableRow key={row.id} className={`hover:bg-muted/50 transition-all duration-300 ${index < 2 ? 'bg-success/5' : ''}`}>
                              <TableCell>
                                <span className="font-bold">{index + 1}</span>
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
                            </TableRow>) : <TableRow>
                            <TableCell colSpan={7} className="text-center py-8 text-muted-foreground text-sm">
                              No teams yet
                            </TableCell>
                          </TableRow>}
                      </TableBody>
                    </Table>
                  </div>;
            })}
            </div>
            {groups.length > 2 && !showAllGroups && <div className="text-center mt-8">
                <Button asChild size="lg" className="font-semibold">
                  <Link to="/points-table">View Full Points Table</Link>
                </Button>
              </div>}
            {showAllGroups && <div className="text-center mt-8">
                <button onClick={() => setShowAllGroups(false)} className="px-8 py-3 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-glow">
                  View Less
                </button>
              </div>}
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
      <section id="results" className="reveal-blur container mx-auto px-4 py-12">
        <div className="flex items-center justify-center gap-3 mb-8">
          <Trophy className="text-[hsl(45,90%,55%)]" size={40} strokeWidth={2.5} />
          <h2 className="text-5xl font-bold bg-gradient-gold bg-clip-text text-transparent">
            Match Results
          </h2>
          <Crown className="text-[hsl(45,90%,55%)]" size={40} strokeWidth={2.5} />
          {results.length === 0 && (
            <span className="ml-2 text-xs px-2 py-1 bg-[#F9C846]/20 text-[#F9C846] rounded-full">Preview</span>
          )}
        </div>

        <div className="relative bg-gradient-to-br from-[hsl(220,25%,12%)] via-[hsl(220,30%,15%)] to-[hsl(220,25%,10%)] rounded-3xl p-8 shadow-premium border-2 border-[hsl(45,90%,50%)]/30">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[hsl(45,90%,50%)]/10 via-transparent to-[hsl(45,90%,50%)]/5 pointer-events-none" />
          
          <div className="relative overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-[hsl(45,70%,75%)] hover:bg-transparent">
                  <TableHead className="text-center font-bold text-[hsl(45,90%,55%)]">Round No.</TableHead>
                  <TableHead className="text-center font-bold text-[hsl(45,90%,55%)]">Match No.</TableHead>
                  <TableHead className="text-center font-bold text-[hsl(45,90%,55%)]">Teams</TableHead>
                  <TableHead className="text-center font-bold text-[hsl(45,90%,55%)]">Score</TableHead>
                  <TableHead className="text-center font-bold text-[hsl(45,90%,55%)]">Winner</TableHead>
                  <TableHead className="text-center font-bold text-[hsl(45,90%,55%)]">Player of the Match</TableHead>
                  <TableHead className="text-center font-bold text-[hsl(45,90%,55%)]">Phase</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(results.length > 0 ? results : dummyResults).map((match) => (
                  <TableRow key={match.id} className="border-[hsl(220,20%,25%)] hover:bg-[hsl(220,25%,18%)] transition-colors">
                    <TableCell className="text-center font-bold text-[hsl(45,90%,55%)] text-2xl">
                      {match.round_no || '-'}
                    </TableCell>
                    <TableCell className="text-center font-semibold text-white text-lg">
                      {match.match_no || '-'}
                    </TableCell>
                    <TableCell className="text-center font-semibold text-white">
                      {match.team_a?.name} vs {match.team_b?.name}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="font-mono text-xl font-bold text-white bg-[hsl(220,25%,18%)] rounded-lg px-3 py-1 inline-block">
                        {match.team_a_score} - {match.team_b_score}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {match.winner ? (
                        <div className="flex items-center justify-center gap-1">
                          <Trophy className="text-[hsl(45,90%,55%)]" size={18} />
                          <Badge className="bg-gradient-gold text-white border-0 shadow-gold-soft font-semibold px-3 py-1">
                            {match.winner.name}
                          </Badge>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {match.player_of_match ? (
                        <div className="flex items-center justify-center gap-1">
                          <Star className="text-[hsl(45,90%,55%)]" size={16} fill="hsl(45,90%,55%)" />
                          <Badge variant="outline" className="border-2 border-[hsl(45,80%,60%)] text-[hsl(45,90%,55%)] font-semibold bg-[hsl(220,25%,15%)]">
                            {match.player_of_match.name}
                          </Badge>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className="bg-primary text-primary-foreground font-semibold">
                        {match.match_phase?.toUpperCase()}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {/* View More Button for Results */}
          <div className="text-center mt-8">
            <Button asChild size="lg" className="font-semibold bg-secondary hover:bg-secondary/90">
              <Link to="/results">View More</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Player Stats Section */}
      <section id="playerStats" className="reveal-rotate container mx-auto px-4 py-12">
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
              <div className="min-w-[280px] lg:min-w-0 snap-start"><StatCard title="Top Run Scorers" players={getTopBatsmen()} stat={(p: any) => `${p.runs_scored} runs`} icon={Trophy} dummyPlayers={getDummyTopBatsmen()} dummyStat={(p: any) => `${p.runs_scored} runs`} /></div>
              <div className="min-w-[280px] lg:min-w-0 snap-start"><StatCard title="Highest Strike Rate" players={getHighestStrikeRate()} stat={(p: any) => `${p.strike_rate.toFixed(2)}`} icon={TrendingUp} dummyPlayers={getDummyStrikeRate()} dummyStat={(p: any) => `${p.strike_rate.toFixed(2)}`} /></div>
              <div className="min-w-[280px] lg:min-w-0 snap-start"><StatCard title="Best Batting Average" players={getHighestAverage()} stat={(p: any) => `${p.batting_average.toFixed(2)}`} icon={Award} dummyPlayers={getDummyAverage()} dummyStat={(p: any) => `${p.batting_average.toFixed(2)}`} /></div>
            </div>
          </TabsContent>

          <TabsContent value="bowling" className="space-y-6">
            <div className="flex lg:grid lg:grid-cols-2 gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory" style={{ touchAction: 'pan-y pan-x' }}>
              <div className="min-w-[280px] lg:min-w-0 snap-start"><StatCard title="Top Wicket Takers" players={getTopBowlers()} stat={(p: any) => `${p.wickets_taken} wickets`} icon={Target} dummyPlayers={getDummyTopBowlers()} dummyStat={(p: any) => `${p.wickets_taken} wickets`} /></div>
              <div className="min-w-[280px] lg:min-w-0 snap-start"><StatCard title="Best Economy Rate" players={getBestEconomy()} stat={(p: any) => `${p.economy_rate.toFixed(2)}`} icon={TrendingUp} dummyPlayers={getDummyEconomy()} dummyStat={(p: any) => `${p.economy_rate.toFixed(2)}`} /></div>
            </div>
          </TabsContent>

          <TabsContent value="fielding" className="space-y-6">
            <div className="flex lg:grid lg:grid-cols-1 max-w-2xl mx-auto gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory" style={{ touchAction: 'pan-y pan-x' }}>
              <div className="min-w-[280px] lg:min-w-0 snap-start"><StatCard title="Top Fielders" players={getTopFielders()} stat={(p: any) => `${p.catches + p.stumpings} dismissals`} icon={Award} dummyPlayers={getDummyFielders()} dummyStat={(p: any) => `${p.catches + p.stumpings} dismissals`} /></div>
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

      {/* Matches Section */}
      <section id="matches" className="reveal-scale">
        <MatchesSection />
      </section>

      {/* Teams Section */}
      <section id="teams" className="reveal-left container mx-auto px-4 py-12">
        <div className="flex items-center gap-3 mb-8">
          <Users className="text-secondary" size={32} />
          <h2 className="text-4xl font-bold text-primary">All Teams</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(showAllTeams ? teams : teams.slice(0, 3)).map(team => <Card key={team.id} className="reveal-zoom-fade p-6 bg-gradient-team-card shadow-card hover:shadow-glow transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] cursor-pointer border-2 border-primary/20 bg-blue-500/5" onClick={() => handleTeamClick(team)}>
              <div className="flex items-start gap-4 mb-4">
                {team.logo_url && <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 transition-transform duration-300 hover:scale-110 hover:rotate-6">
                    <img src={team.logo_url} alt={team.name} className="w-12 h-12 object-contain" />
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
      <section id="community" className="reveal-scale">
        <CommunitySection />
      </section>

      {/* Sponsors Section */}
      <section id="sponsors" className="reveal-right">
        <SponsorsSection />
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="reveal-blur">
        <GallerySection />
      </section>

      <TeamDetailDialog team={selectedTeam} open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>;
};
export default Index;
