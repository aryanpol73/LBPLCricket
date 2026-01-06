import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Trophy, Target, Shield, Star, TrendingUp, Award, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { PlayerProfileDialog } from "@/components/PlayerProfileDialog";

interface Player {
  id: string;
  name: string;
  role: string | null;
  runs_scored: number | null;
  batting_average: number | null;
  strike_rate: number | null;
  wickets_taken: number | null;
  bowling_average: number | null;
  economy_rate: number | null;
  catches: number | null;
  stumpings: number | null;
  matches_played: number | null;
  team_name: string | null;
}

interface FieldingStats {
  name: string;
  catches: number;
  stumpings: number;
  runOuts: number;
  total: number;
}

interface StatCardProps {
  rank: number;
  player: Player;
  statType: 'batting' | 'bowling' | 'mvp';
  onPlayerClick: (player: Player) => void;
}

interface FieldingCardProps {
  rank: number;
  stats: FieldingStats;
  onPlayerClick: (name: string) => void;
}

const StatCard = ({ rank, player, statType, onPlayerClick }: StatCardProps) => {
  const getRankBadge = () => {
    if (rank === 1) return "bg-gradient-to-br from-yellow-400 to-amber-600 text-black";
    if (rank === 2) return "bg-gradient-to-br from-gray-300 to-gray-500 text-black";
    if (rank === 3) return "bg-gradient-to-br from-orange-400 to-orange-700 text-white";
    return "bg-[#1a2744] text-muted-foreground";
  };

  const getPrimaryValue = () => {
    switch (statType) {
      case 'batting':
        return player.runs_scored ?? 0;
      case 'bowling':
        return player.wickets_taken ?? 0;
      case 'mvp':
        return calculateMVPScore(player);
      default:
        return 0;
    }
  };

  const getPrimaryLabel = () => {
    switch (statType) {
      case 'batting':
        return 'Runs';
      case 'bowling':
        return 'Wickets';
      case 'mvp':
        return 'MVP Points';
      default:
        return '';
    }
  };

  const calculateMVPScore = (p: Player) => {
    const runs = (p.runs_scored ?? 0) * 1;
    const wickets = (p.wickets_taken ?? 0) * 25;
    const catches = (p.catches ?? 0) * 10;
    const stumpings = (p.stumpings ?? 0) * 10;
    return Math.round(runs + wickets + catches + stumpings);
  };

  const renderStats = () => {
    switch (statType) {
      case 'batting':
        return (
          <div className="grid grid-cols-3 gap-2 mt-3 text-center">
            <div className="bg-[#1a2744]/50 rounded px-2 py-1.5">
              <div className="text-sm font-semibold text-white">{player.matches_played ?? 0}</div>
              <div className="text-[10px] text-muted-foreground">Mat</div>
            </div>
            <div className="bg-[#F9C846]/10 rounded px-2 py-1.5">
              <div className="text-sm font-semibold text-[#F9C846]">{player.batting_average?.toFixed(1) ?? '0.0'}</div>
              <div className="text-[10px] text-muted-foreground">Avg</div>
            </div>
            <div className="bg-primary/10 rounded px-2 py-1.5">
              <div className="text-sm font-semibold text-primary">{player.strike_rate?.toFixed(1) ?? '0.0'}</div>
              <div className="text-[10px] text-muted-foreground">SR</div>
            </div>
          </div>
        );
      case 'bowling':
        return (
          <div className="grid grid-cols-3 gap-2 mt-3 text-center">
            <div className="bg-[#1a2744]/50 rounded px-2 py-1.5">
              <div className="text-sm font-semibold text-white">{player.matches_played ?? 0}</div>
              <div className="text-[10px] text-muted-foreground">Mat</div>
            </div>
            <div className="bg-[#F9C846]/10 rounded px-2 py-1.5">
              <div className="text-sm font-semibold text-[#F9C846]">{player.bowling_average?.toFixed(1) ?? '0.0'}</div>
              <div className="text-[10px] text-muted-foreground">Avg</div>
            </div>
            <div className="bg-primary/10 rounded px-2 py-1.5">
              <div className="text-sm font-semibold text-primary">{player.economy_rate?.toFixed(2) ?? '0.00'}</div>
              <div className="text-[10px] text-muted-foreground">Econ</div>
            </div>
          </div>
        );
      case 'mvp':
        return (
          <div className="grid grid-cols-3 gap-2 mt-3 text-center">
            <div className="bg-[#F9C846]/10 rounded px-2 py-1.5">
              <div className="text-sm font-semibold text-[#F9C846]">{player.runs_scored ?? 0}</div>
              <div className="text-[10px] text-muted-foreground">Runs</div>
            </div>
            <div className="bg-primary/10 rounded px-2 py-1.5">
              <div className="text-sm font-semibold text-primary">{player.wickets_taken ?? 0}</div>
              <div className="text-[10px] text-muted-foreground">Wkts</div>
            </div>
            <div className="bg-[#1a2744]/50 rounded px-2 py-1.5">
              <div className="text-sm font-semibold text-white">{player.matches_played ?? 0}</div>
              <div className="text-[10px] text-muted-foreground">Mat</div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card 
      className={cn(
        "p-4 bg-gradient-to-br from-[#0F1B35] to-[#0A1325] border-[#F9C846]/20 hover:border-[#F9C846]/50 transition-all duration-300 cursor-pointer",
        rank <= 3 && "ring-1 ring-[#F9C846]/30"
      )}
      onClick={() => onPlayerClick(player)}
    >
      <div className="flex items-start gap-3">
        {/* Rank Badge */}
        <div className={cn(
          "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-lg",
          getRankBadge()
        )}>
          {rank <= 3 ? (
            <Trophy className="w-5 h-5" />
          ) : (
            rank
          )}
        </div>

        {/* Player Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white truncate hover:text-[#F9C846] transition-colors">{player.name}</h3>
          <p className="text-xs text-muted-foreground truncate">{player.team_name ?? 'Unknown Team'}</p>
        </div>

        {/* Primary Stat */}
        <div className="flex-shrink-0 text-right">
          <div className="text-2xl font-bold text-[#F9C846]">{getPrimaryValue()}</div>
          <div className="text-xs text-muted-foreground">{getPrimaryLabel()}</div>
        </div>
      </div>
      {renderStats()}
    </Card>
  );
};

const FieldingCard = ({ rank, stats, onPlayerClick }: FieldingCardProps) => {
  const getRankBadge = () => {
    if (rank === 1) return "bg-gradient-to-br from-yellow-400 to-amber-600 text-black";
    if (rank === 2) return "bg-gradient-to-br from-gray-300 to-gray-500 text-black";
    if (rank === 3) return "bg-gradient-to-br from-orange-400 to-orange-700 text-white";
    return "bg-[#1a2744] text-muted-foreground";
  };

  return (
    <Card 
      className={cn(
        "p-4 bg-gradient-to-br from-[#0F1B35] to-[#0A1325] border-[#F9C846]/20 hover:border-[#F9C846]/50 transition-all duration-300 cursor-pointer",
        rank <= 3 && "ring-1 ring-[#F9C846]/30"
      )}
      onClick={() => onPlayerClick(stats.name)}
    >
      <div className="flex items-start gap-3">
        {/* Rank Badge */}
        <div className={cn(
          "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-lg",
          getRankBadge()
        )}>
          {rank <= 3 ? (
            <Trophy className="w-5 h-5" />
          ) : (
            rank
          )}
        </div>

        {/* Player Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white truncate hover:text-[#F9C846] transition-colors">{stats.name}</h3>
          <p className="text-xs text-muted-foreground">Fielder</p>
        </div>

        {/* Primary Stat */}
        <div className="flex-shrink-0 text-right">
          <div className="text-2xl font-bold text-[#F9C846]">{stats.total}</div>
          <div className="text-xs text-muted-foreground">Dismissals</div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 mt-3 text-center">
        <div className="bg-[#F9C846]/10 rounded px-2 py-1.5">
          <div className="text-sm font-semibold text-[#F9C846]">{stats.catches}</div>
          <div className="text-[10px] text-muted-foreground">Catches</div>
        </div>
        <div className="bg-primary/10 rounded px-2 py-1.5">
          <div className="text-sm font-semibold text-primary">{stats.stumpings}</div>
          <div className="text-[10px] text-muted-foreground">Stumpings</div>
        </div>
        <div className="bg-[#1a2744]/50 rounded px-2 py-1.5">
          <div className="text-sm font-semibold text-white">{stats.runOuts}</div>
          <div className="text-[10px] text-muted-foreground">Run Outs</div>
        </div>
      </div>
    </Card>
  );
};

const TopThreeSection = ({ players, statType }: { players: Player[]; statType: 'batting' | 'bowling' | 'mvp' }) => {
  const topThree = players.slice(0, 3);
  
  if (topThree.length === 0) return null;

  const getStatValue = (player: Player) => {
    switch (statType) {
      case 'batting':
        return player.runs_scored ?? 0;
      case 'bowling':
        return player.wickets_taken ?? 0;
      case 'mvp':
        const runs = (player.runs_scored ?? 0) * 1;
        const wickets = (player.wickets_taken ?? 0) * 25;
        const catches = (player.catches ?? 0) * 10;
        const stumpings = (player.stumpings ?? 0) * 10;
        return Math.round(runs + wickets + catches + stumpings);
      default:
        return 0;
    }
  };

  const getStatLabel = () => {
    switch (statType) {
      case 'batting': return 'Runs';
      case 'bowling': return 'Wickets';
      case 'mvp': return 'MVP Points';
      default: return '';
    }
  };

  const getSecondaryStats = (player: Player) => {
    switch (statType) {
      case 'batting':
        return `Avg: ${player.batting_average?.toFixed(1) ?? '0'} | SR: ${player.strike_rate?.toFixed(1) ?? '0'}`;
      case 'bowling':
        return `Avg: ${player.bowling_average?.toFixed(1) ?? '0'} | Econ: ${player.economy_rate?.toFixed(2) ?? '0'}`;
      case 'mvp':
        return `R: ${player.runs_scored ?? 0} | W: ${player.wickets_taken ?? 0}`;
      default:
        return '';
    }
  };

  return (
    <div className="grid grid-cols-3 gap-3 mb-6">
      {/* 2nd Place */}
      <div className="order-1 md:order-1">
        {topThree[1] && (
          <Card className="p-3 bg-gradient-to-br from-[#1a2744] to-[#0F1B35] border-gray-400/30 text-center h-full">
            <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-gradient-to-br from-gray-300 to-gray-500 flex items-center justify-center">
              <span className="text-xl font-bold text-black">2</span>
            </div>
            <h4 className="font-semibold text-white text-sm truncate">{topThree[1].name}</h4>
            <p className="text-xs text-muted-foreground truncate mb-1">{topThree[1].team_name}</p>
            <div className="text-xl font-bold text-gray-300">{getStatValue(topThree[1])}</div>
            <div className="text-xs text-muted-foreground">{getStatLabel()}</div>
            <div className="text-[10px] text-muted-foreground mt-1">{getSecondaryStats(topThree[1])}</div>
          </Card>
        )}
      </div>
      
      {/* 1st Place */}
      <div className="order-2 md:order-2">
        {topThree[0] && (
          <Card className="p-4 bg-gradient-to-br from-[#2a3654] to-[#0F1B35] border-[#F9C846]/50 text-center h-full ring-2 ring-[#F9C846]/30 shadow-lg shadow-[#F9C846]/10">
            <div className="w-14 h-14 mx-auto mb-2 rounded-full bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center">
              <Trophy className="w-7 h-7 text-black" />
            </div>
            <h4 className="font-bold text-white text-sm truncate">{topThree[0].name}</h4>
            <p className="text-xs text-muted-foreground truncate mb-1">{topThree[0].team_name}</p>
            <div className="text-2xl font-bold text-[#F9C846]">{getStatValue(topThree[0])}</div>
            <div className="text-xs text-[#F9C846]/70">{getStatLabel()}</div>
            <div className="text-[10px] text-[#F9C846]/50 mt-1">{getSecondaryStats(topThree[0])}</div>
          </Card>
        )}
      </div>
      
      {/* 3rd Place */}
      <div className="order-3 md:order-3">
        {topThree[2] && (
          <Card className="p-3 bg-gradient-to-br from-[#1a2744] to-[#0F1B35] border-orange-500/30 text-center h-full">
            <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-gradient-to-br from-orange-400 to-orange-700 flex items-center justify-center">
              <span className="text-xl font-bold text-white">3</span>
            </div>
            <h4 className="font-semibold text-white text-sm truncate">{topThree[2].name}</h4>
            <p className="text-xs text-muted-foreground truncate mb-1">{topThree[2].team_name}</p>
            <div className="text-xl font-bold text-orange-400">{getStatValue(topThree[2])}</div>
            <div className="text-xs text-muted-foreground">{getStatLabel()}</div>
            <div className="text-[10px] text-muted-foreground mt-1">{getSecondaryStats(topThree[2])}</div>
          </Card>
        )}
      </div>
    </div>
  );
};

const FieldingTopThree = ({ stats }: { stats: FieldingStats[] }) => {
  const topThree = stats.slice(0, 3);
  
  if (topThree.length === 0) return null;

  return (
    <div className="grid grid-cols-3 gap-3 mb-6">
      {/* 2nd Place */}
      <div className="order-1 md:order-1">
        {topThree[1] && (
          <Card className="p-3 bg-gradient-to-br from-[#1a2744] to-[#0F1B35] border-gray-400/30 text-center h-full">
            <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-gradient-to-br from-gray-300 to-gray-500 flex items-center justify-center">
              <span className="text-xl font-bold text-black">2</span>
            </div>
            <h4 className="font-semibold text-white text-sm truncate">{topThree[1].name}</h4>
            <p className="text-xs text-muted-foreground mb-1">Fielder</p>
            <div className="text-xl font-bold text-gray-300">{topThree[1].total}</div>
            <div className="text-xs text-muted-foreground">Dismissals</div>
            <div className="text-[10px] text-muted-foreground mt-1">
              C: {topThree[1].catches} | St: {topThree[1].stumpings} | RO: {topThree[1].runOuts}
            </div>
          </Card>
        )}
      </div>
      
      {/* 1st Place */}
      <div className="order-2 md:order-2">
        {topThree[0] && (
          <Card className="p-4 bg-gradient-to-br from-[#2a3654] to-[#0F1B35] border-[#F9C846]/50 text-center h-full ring-2 ring-[#F9C846]/30 shadow-lg shadow-[#F9C846]/10">
            <div className="w-14 h-14 mx-auto mb-2 rounded-full bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center">
              <Trophy className="w-7 h-7 text-black" />
            </div>
            <h4 className="font-bold text-white text-sm truncate">{topThree[0].name}</h4>
            <p className="text-xs text-muted-foreground mb-1">Fielder</p>
            <div className="text-2xl font-bold text-[#F9C846]">{topThree[0].total}</div>
            <div className="text-xs text-[#F9C846]/70">Dismissals</div>
            <div className="text-[10px] text-[#F9C846]/50 mt-1">
              C: {topThree[0].catches} | St: {topThree[0].stumpings} | RO: {topThree[0].runOuts}
            </div>
          </Card>
        )}
      </div>
      
      {/* 3rd Place */}
      <div className="order-3 md:order-3">
        {topThree[2] && (
          <Card className="p-3 bg-gradient-to-br from-[#1a2744] to-[#0F1B35] border-orange-500/30 text-center h-full">
            <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-gradient-to-br from-orange-400 to-orange-700 flex items-center justify-center">
              <span className="text-xl font-bold text-white">3</span>
            </div>
            <h4 className="font-semibold text-white text-sm truncate">{topThree[2].name}</h4>
            <p className="text-xs text-muted-foreground mb-1">Fielder</p>
            <div className="text-xl font-bold text-orange-400">{topThree[2].total}</div>
            <div className="text-xs text-muted-foreground">Dismissals</div>
            <div className="text-[10px] text-muted-foreground mt-1">
              C: {topThree[2].catches} | St: {topThree[2].stumpings} | RO: {topThree[2].runOuts}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

const Stats = () => {
  const [battingLeaders, setBattingLeaders] = useState<Player[]>([]);
  const [bowlingLeaders, setBowlingLeaders] = useState<Player[]>([]);
  const [fieldingStats, setFieldingStats] = useState<FieldingStats[]>([]);
  const [mvpLeaders, setMvpLeaders] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("batting");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlayer, setSelectedPlayer] = useState<any | null>(null);
  const [playerDialogOpen, setPlayerDialogOpen] = useState(false);

  useEffect(() => {
    loadStats();
  }, []);

  const parseFieldingFromScorecards = (scorecards: any[]) => {
    const fieldingMap: Record<string, { catches: number; stumpings: number; runOuts: number }> = {};

    scorecards.forEach(scorecard => {
      const allBatting = [...(scorecard.team_a_batting || []), ...(scorecard.team_b_batting || [])];
      
      allBatting.forEach((batter: any) => {
        const dismissal = batter.dismissal || batter.how_out || '';
        
        // Parse catches: "c PlayerName b BowlerName" or "c&b PlayerName"
        const catchMatch = dismissal.match(/^c\s+([^b]+?)\s+b\s+/i);
        const catchAndBowledMatch = dismissal.match(/^c&b\s+(.+)/i);
        const stumpedMatch = dismissal.match(/^st\s+†?([^\sb]+)/i) || dismissal.match(/stumped\s+(.+)/i);
        const runOutMatch = dismissal.match(/run out\s+([^/]+)/i);
        
        if (catchMatch) {
          const fielderName = catchMatch[1].replace(/†/g, '').trim();
          if (fielderName && fielderName.length > 1) {
            if (!fieldingMap[fielderName]) fieldingMap[fielderName] = { catches: 0, stumpings: 0, runOuts: 0 };
            fieldingMap[fielderName].catches++;
          }
        }
        
        if (catchAndBowledMatch) {
          const fielderName = catchAndBowledMatch[1].trim();
          if (fielderName && fielderName.length > 1) {
            if (!fieldingMap[fielderName]) fieldingMap[fielderName] = { catches: 0, stumpings: 0, runOuts: 0 };
            fieldingMap[fielderName].catches++;
          }
        }
        
        if (stumpedMatch) {
          const keeperName = stumpedMatch[1].replace(/†/g, '').trim();
          if (keeperName && keeperName.length > 1) {
            if (!fieldingMap[keeperName]) fieldingMap[keeperName] = { catches: 0, stumpings: 0, runOuts: 0 };
            fieldingMap[keeperName].stumpings++;
          }
        }
        
        if (runOutMatch) {
          const fielderName = runOutMatch[1].replace(/†/g, '').trim();
          if (fielderName && fielderName.length > 1) {
            if (!fieldingMap[fielderName]) fieldingMap[fielderName] = { catches: 0, stumpings: 0, runOuts: 0 };
            fieldingMap[fielderName].runOuts++;
          }
        }
      });
    });

    return Object.entries(fieldingMap)
      .map(([name, stats]) => ({
        name,
        catches: stats.catches,
        stumpings: stats.stumpings,
        runOuts: stats.runOuts,
        total: stats.catches + stats.stumpings + stats.runOuts
      }))
      .filter(s => s.total > 0)
      .sort((a, b) => b.total - a.total);
  };

  const loadStats = async () => {
    try {
      // Fetch batting leaders
      const { data: battingData } = await supabase
        .from('players')
        .select(`
          id, name, role, runs_scored, batting_average, strike_rate,
          wickets_taken, bowling_average, economy_rate,
          catches, stumpings, matches_played,
          teams!inner(name)
        `)
        .gt('runs_scored', 0)
        .order('runs_scored', { ascending: false })
        .limit(50);

      // Fetch bowling leaders
      const { data: bowlingData } = await supabase
        .from('players')
        .select(`
          id, name, role, runs_scored, batting_average, strike_rate,
          wickets_taken, bowling_average, economy_rate,
          catches, stumpings, matches_played,
          teams!inner(name)
        `)
        .gt('wickets_taken', 0)
        .order('wickets_taken', { ascending: false })
        .limit(50);

      // Fetch all players for MVP calculation
      const { data: allPlayersData } = await supabase
        .from('players')
        .select(`
          id, name, role, runs_scored, batting_average, strike_rate,
          wickets_taken, bowling_average, economy_rate,
          catches, stumpings, matches_played,
          teams!inner(name)
        `)
        .limit(200);

      // Fetch scorecards for fielding stats
      const { data: scorecards } = await supabase
        .from('match_scorecards')
        .select('team_a_batting, team_b_batting');

      // Process data
      const mapPlayerData = (data: any[]): Player[] => {
        return (data || []).map(p => ({
          id: p.id,
          name: p.name,
          role: p.role,
          runs_scored: p.runs_scored,
          batting_average: p.batting_average,
          strike_rate: p.strike_rate,
          wickets_taken: p.wickets_taken,
          bowling_average: p.bowling_average,
          economy_rate: p.economy_rate,
          catches: p.catches,
          stumpings: p.stumpings,
          matches_played: p.matches_played,
          team_name: p.teams?.name || null
        }));
      };

      const batting = mapPlayerData(battingData || []);
      // Sort bowling: primary by wickets DESC, secondary by bowling_average ASC (lower is better)
      const bowling = mapPlayerData(bowlingData || []).sort((a, b) => {
        if ((b.wickets_taken ?? 0) !== (a.wickets_taken ?? 0)) {
          return (b.wickets_taken ?? 0) - (a.wickets_taken ?? 0);
        }
        // For same wickets, lower bowling average is better
        return (a.bowling_average ?? 999) - (b.bowling_average ?? 999);
      });
      
      // Parse fielding from scorecards
      const fielding = parseFieldingFromScorecards(scorecards || []);

      // Calculate MVP scores
      const mvp = mapPlayerData(allPlayersData || [])
        .map(p => ({
          ...p,
          mvpScore: 
            (p.runs_scored ?? 0) * 1 + 
            (p.wickets_taken ?? 0) * 25 + 
            (p.catches ?? 0) * 10 + 
            (p.stumpings ?? 0) * 10
        }))
        .filter(p => p.mvpScore > 0)
        .sort((a, b) => b.mvpScore - a.mvpScore)
        .slice(0, 50);

      setBattingLeaders(batting);
      setBowlingLeaders(bowling);
      setFieldingStats(fielding);
      setMvpLeaders(mvp);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A1325] via-[#0F1B35] to-[#0A1325] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#F9C846]/30 border-t-[#F9C846] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading statistics...</p>
        </div>
      </div>
    );
  }

  const hasData = battingLeaders.length > 0 || bowlingLeaders.length > 0;

  const handlePlayerClick = async (player: Player) => {
    const { data } = await supabase
      .from('players')
      .select(`*, teams(name, logo_url)`)
      .eq('id', player.id)
      .maybeSingle();
    
    if (data) {
      setSelectedPlayer(data);
      setPlayerDialogOpen(true);
    }
  };

  const handleFieldingPlayerClick = async (playerName: string) => {
    const { data } = await supabase
      .from('players')
      .select(`*, teams(name, logo_url)`)
      .ilike('name', `%${playerName}%`)
      .maybeSingle();
    
    if (data) {
      setSelectedPlayer(data);
      setPlayerDialogOpen(true);
    }
  };

  // Filter functions for search
  const filterPlayers = (players: Player[]) => {
    if (!searchQuery.trim()) return players;
    return players.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.team_name?.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  };

  const filterFielding = (stats: FieldingStats[]) => {
    if (!searchQuery.trim()) return stats;
    return stats.filter(s => 
      s.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  // Get original rank for a player even after filtering
  const getOriginalRank = (player: Player, allPlayers: Player[]) => {
    return allPlayers.findIndex(p => p.id === player.id) + 1;
  };

  const getOriginalFieldingRank = (name: string, allStats: FieldingStats[]) => {
    return allStats.findIndex(s => s.name === name) + 1;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A1325] via-[#0F1B35] to-[#0A1325]">
      <div className="container mx-auto px-4 py-6 md:py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6 md:mb-8">
          <div className="p-2 rounded-lg bg-[#F9C846]/10 border border-[#F9C846]/30">
            <Trophy className="text-[#F9C846]" size={28} />
          </div>
          <div>
            <h1 className="text-2xl md:text-4xl font-bold text-white">Player Statistics</h1>
            <p className="text-sm text-muted-foreground">LBPL Season 3 Leaderboard</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <Input
            placeholder="Search players..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-[#0F1B35] border-[#F9C846]/20 text-white placeholder:text-muted-foreground focus:border-[#F9C846]/50"
          />
        </div>

        {!hasData ? (
          <Card className="p-8 bg-gradient-to-br from-[#0F1B35] to-[#0A1325] border-[#F9C846]/30 text-center">
            <Trophy className="mx-auto mb-4 text-[#F9C846]" size={48} />
            <p className="text-muted-foreground text-lg">Statistics will be available once the tournament starts</p>
          </Card>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full grid grid-cols-4 bg-[#0F1B35] border border-[#F9C846]/20 mb-6">
              <TabsTrigger 
                value="batting" 
                className="data-[state=active]:bg-[#F9C846] data-[state=active]:text-black flex gap-1.5 items-center"
              >
                <TrendingUp className="w-4 h-4" />
                <span className="hidden sm:inline">Batting</span>
                <span className="sm:hidden">BAT</span>
              </TabsTrigger>
              <TabsTrigger 
                value="bowling"
                className="data-[state=active]:bg-[#F9C846] data-[state=active]:text-black flex gap-1.5 items-center"
              >
                <Target className="w-4 h-4" />
                <span className="hidden sm:inline">Bowling</span>
                <span className="sm:hidden">BOWL</span>
              </TabsTrigger>
              <TabsTrigger 
                value="fielding"
                className="data-[state=active]:bg-[#F9C846] data-[state=active]:text-black flex gap-1.5 items-center"
              >
                <Shield className="w-4 h-4" />
                <span className="hidden sm:inline">Fielding</span>
                <span className="sm:hidden">FIELD</span>
              </TabsTrigger>
              <TabsTrigger 
                value="mvp"
                className="data-[state=active]:bg-[#F9C846] data-[state=active]:text-black flex gap-1.5 items-center"
              >
                <Star className="w-4 h-4" />
                <span className="hidden sm:inline">MVP</span>
                <span className="sm:hidden">MVP</span>
              </TabsTrigger>
            </TabsList>

            {/* Batting Tab */}
            <TabsContent value="batting" className="mt-0">
              {!searchQuery && <TopThreeSection players={battingLeaders} statType="batting" />}
              <div className="space-y-3">
                {(searchQuery ? filterPlayers(battingLeaders) : battingLeaders.slice(3)).map((player) => (
                  <StatCard 
                    key={player.id} 
                    rank={getOriginalRank(player, battingLeaders)} 
                    player={player} 
                    statType="batting"
                    onPlayerClick={handlePlayerClick}
                  />
                ))}
              </div>
              {filterPlayers(battingLeaders).length === 0 && searchQuery && (
                <Card className="p-6 bg-[#0F1B35] border-[#F9C846]/20 text-center">
                  <p className="text-muted-foreground">No players found matching "{searchQuery}"</p>
                </Card>
              )}
              {battingLeaders.length === 0 && !searchQuery && (
                <Card className="p-6 bg-[#0F1B35] border-[#F9C846]/20 text-center">
                  <p className="text-muted-foreground">No batting stats available yet</p>
                </Card>
              )}
            </TabsContent>

            {/* Bowling Tab */}
            <TabsContent value="bowling" className="mt-0">
              {!searchQuery && <TopThreeSection players={bowlingLeaders} statType="bowling" />}
              <div className="space-y-3">
                {(searchQuery ? filterPlayers(bowlingLeaders) : bowlingLeaders.slice(3)).map((player) => (
                  <StatCard 
                    key={player.id} 
                    rank={getOriginalRank(player, bowlingLeaders)} 
                    player={player} 
                    statType="bowling"
                    onPlayerClick={handlePlayerClick}
                  />
                ))}
              </div>
              {filterPlayers(bowlingLeaders).length === 0 && searchQuery && (
                <Card className="p-6 bg-[#0F1B35] border-[#F9C846]/20 text-center">
                  <p className="text-muted-foreground">No players found matching "{searchQuery}"</p>
                </Card>
              )}
              {bowlingLeaders.length === 0 && !searchQuery && (
                <Card className="p-6 bg-[#0F1B35] border-[#F9C846]/20 text-center">
                  <p className="text-muted-foreground">No bowling stats available yet</p>
                </Card>
              )}
            </TabsContent>

            {/* Fielding Tab */}
            <TabsContent value="fielding" className="mt-0">
              {!searchQuery && <FieldingTopThree stats={fieldingStats} />}
              <div className="space-y-3">
                {(searchQuery ? filterFielding(fieldingStats) : fieldingStats.slice(3)).map((stats) => (
                  <FieldingCard 
                    key={stats.name} 
                    rank={getOriginalFieldingRank(stats.name, fieldingStats)} 
                    stats={stats}
                    onPlayerClick={handleFieldingPlayerClick}
                  />
                ))}
              </div>
              {filterFielding(fieldingStats).length === 0 && searchQuery && (
                <Card className="p-6 bg-[#0F1B35] border-[#F9C846]/20 text-center">
                  <p className="text-muted-foreground">No players found matching "{searchQuery}"</p>
                </Card>
              )}
              {fieldingStats.length === 0 && !searchQuery && (
                <Card className="p-6 bg-[#0F1B35] border-[#F9C846]/20 text-center">
                  <p className="text-muted-foreground">No fielding stats available yet</p>
                </Card>
              )}
            </TabsContent>

            {/* MVP Tab */}
            <TabsContent value="mvp" className="mt-0">
              <div className="mb-4 p-3 bg-[#F9C846]/10 border border-[#F9C846]/30 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-[#F9C846]">
                  <Award className="w-4 h-4" />
                  <span className="font-medium">MVP Score Calculation:</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  1 point per run + 25 points per wicket + 10 points per catch/stumping
                </p>
              </div>
              {!searchQuery && <TopThreeSection players={mvpLeaders} statType="mvp" />}
              <div className="space-y-3">
                {(searchQuery ? filterPlayers(mvpLeaders) : mvpLeaders.slice(3)).map((player) => (
                  <StatCard 
                    key={player.id} 
                    rank={getOriginalRank(player, mvpLeaders)} 
                    player={player} 
                    statType="mvp"
                    onPlayerClick={handlePlayerClick}
                  />
                ))}
              </div>
              {filterPlayers(mvpLeaders).length === 0 && searchQuery && (
                <Card className="p-6 bg-[#0F1B35] border-[#F9C846]/20 text-center">
                  <p className="text-muted-foreground">No players found matching "{searchQuery}"</p>
                </Card>
              )}
              {mvpLeaders.length === 0 && !searchQuery && (
                <Card className="p-6 bg-[#0F1B35] border-[#F9C846]/20 text-center">
                  <p className="text-muted-foreground">No MVP stats available yet</p>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>

      <PlayerProfileDialog
        player={selectedPlayer}
        open={playerDialogOpen}
        onOpenChange={setPlayerDialogOpen}
      />
    </div>
  );
};

export default Stats;
