import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Trophy, Target, Shield, Star, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface Player {
  id: string;
  name: string;
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

const TopPlayerCard = ({ rank, name, teamName, value, label, isFirst }: { 
  rank: number; 
  name: string; 
  teamName: string | null;
  value: number | string; 
  label: string;
  isFirst?: boolean;
}) => {
  const getRankStyle = () => {
    if (rank === 1) return "from-yellow-400 to-amber-600 text-black";
    if (rank === 2) return "from-gray-300 to-gray-500 text-black";
    if (rank === 3) return "from-orange-400 to-orange-700 text-white";
    return "from-[#1a2744] to-[#0F1B35] text-muted-foreground";
  };

  return (
    <Card className={cn(
      "p-3 bg-gradient-to-br from-[#0F1B35] to-[#0A1325] border-[#F9C846]/20 hover:border-[#F9C846]/40 transition-all",
      isFirst && "ring-1 ring-[#F9C846]/30"
    )}>
      <div className="flex items-center gap-3">
        <div className={cn(
          "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-lg bg-gradient-to-br",
          getRankStyle()
        )}>
          {rank <= 3 ? <Trophy className="w-4 h-4" /> : rank}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-white text-sm truncate">{name}</h4>
          <p className="text-[10px] text-muted-foreground truncate">{teamName}</p>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-[#F9C846]">{value}</div>
          <div className="text-[10px] text-muted-foreground">{label}</div>
        </div>
      </div>
    </Card>
  );
};

export const StatsPreview = () => {
  const [battingLeaders, setBattingLeaders] = useState<Player[]>([]);
  const [bowlingLeaders, setBowlingLeaders] = useState<Player[]>([]);
  const [fieldingStats, setFieldingStats] = useState<FieldingStats[]>([]);
  const [mvpLeaders, setMvpLeaders] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("batting");

  useEffect(() => {
    loadStats();
  }, []);

  const parseFieldingFromScorecards = (scorecards: any[]) => {
    const fieldingMap: Record<string, { catches: number; stumpings: number; runOuts: number }> = {};

    scorecards.forEach(scorecard => {
      const allBatting = [...(scorecard.team_a_batting || []), ...(scorecard.team_b_batting || [])];
      
      allBatting.forEach((batter: any) => {
        const dismissal = batter.dismissal || batter.how_out || '';
        
        const catchMatch = dismissal.match(/^c\s+([^b]+?)\s+b\s+/i);
        const catchAndBowledMatch = dismissal.match(/^c&b\s+(.+)/i);
        const stumpedMatch = dismissal.match(/^st\s+†?([^\sb]+)/i);
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

  const calculateMVPScore = (p: Player) => {
    return (p.runs_scored ?? 0) + (p.wickets_taken ?? 0) * 25 + (p.catches ?? 0) * 10 + (p.stumpings ?? 0) * 10;
  };

  const loadStats = async () => {
    try {
      const [battingRes, bowlingRes, allPlayersRes, scorecardsRes] = await Promise.all([
        supabase
          .from('players')
          .select('id, name, runs_scored, batting_average, strike_rate, wickets_taken, bowling_average, economy_rate, catches, stumpings, matches_played, teams!inner(name)')
          .gt('runs_scored', 0)
          .order('runs_scored', { ascending: false })
          .limit(5),
        supabase
          .from('players')
          .select('id, name, runs_scored, batting_average, strike_rate, wickets_taken, bowling_average, economy_rate, catches, stumpings, matches_played, teams!inner(name)')
          .gt('wickets_taken', 0)
          .order('wickets_taken', { ascending: false })
          .limit(5),
        supabase
          .from('players')
          .select('id, name, runs_scored, batting_average, strike_rate, wickets_taken, bowling_average, economy_rate, catches, stumpings, matches_played, teams!inner(name)')
          .limit(100),
        supabase
          .from('match_scorecards')
          .select('team_a_batting, team_b_batting')
      ]);

      const mapPlayerData = (data: any[]): Player[] => {
        return (data || []).map(p => ({
          id: p.id,
          name: p.name,
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

      setBattingLeaders(mapPlayerData(battingRes.data || []));
      setBowlingLeaders(mapPlayerData(bowlingRes.data || []));
      setFieldingStats(parseFieldingFromScorecards(scorecardsRes.data || []).slice(0, 5));
      
      const allPlayers = mapPlayerData(allPlayersRes.data || []);
      const mvpSorted = allPlayers
        .filter(p => calculateMVPScore(p) > 0)
        .sort((a, b) => calculateMVPScore(b) - calculateMVPScore(a))
        .slice(0, 5);
      setMvpLeaders(mvpSorted);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-10 h-10 border-4 border-[#F9C846]/30 border-t-[#F9C846] rounded-full animate-spin" />
      </div>
    );
  }

  const hasData = battingLeaders.length > 0 || bowlingLeaders.length > 0;

  if (!hasData) {
    return (
      <Card className="p-8 bg-gradient-to-br from-[#0F1B35] to-[#0A1325] border-[#F9C846]/30 text-center">
        <Trophy className="mx-auto mb-4 text-[#F9C846]" size={48} />
        <p className="text-muted-foreground text-lg">Statistics will be available once the tournament starts</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full grid grid-cols-4 bg-[#0F1B35] border border-[#F9C846]/20 mb-4">
          <TabsTrigger 
            value="batting" 
            className="data-[state=active]:bg-[#F9C846] data-[state=active]:text-black flex gap-1 items-center text-xs sm:text-sm"
          >
            <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Batting</span>
            <span className="sm:hidden">BAT</span>
          </TabsTrigger>
          <TabsTrigger 
            value="bowling"
            className="data-[state=active]:bg-[#F9C846] data-[state=active]:text-black flex gap-1 items-center text-xs sm:text-sm"
          >
            <Target className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Bowling</span>
            <span className="sm:hidden">BOWL</span>
          </TabsTrigger>
          <TabsTrigger 
            value="fielding"
            className="data-[state=active]:bg-[#F9C846] data-[state=active]:text-black flex gap-1 items-center text-xs sm:text-sm"
          >
            <Shield className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Fielding</span>
            <span className="sm:hidden">FIELD</span>
          </TabsTrigger>
          <TabsTrigger 
            value="mvp"
            className="data-[state=active]:bg-[#F9C846] data-[state=active]:text-black flex gap-1 items-center text-xs sm:text-sm"
          >
            <Star className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>MVP</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="batting" className="mt-0 space-y-2">
          {battingLeaders.map((player, index) => (
            <TopPlayerCard
              key={player.id}
              rank={index + 1}
              name={player.name}
              teamName={player.team_name}
              value={player.runs_scored ?? 0}
              label="Runs"
              isFirst={index === 0}
            />
          ))}
        </TabsContent>

        <TabsContent value="bowling" className="mt-0 space-y-2">
          {bowlingLeaders.map((player, index) => (
            <TopPlayerCard
              key={player.id}
              rank={index + 1}
              name={player.name}
              teamName={player.team_name}
              value={player.wickets_taken ?? 0}
              label="Wickets"
              isFirst={index === 0}
            />
          ))}
        </TabsContent>

        <TabsContent value="fielding" className="mt-0 space-y-2">
          {fieldingStats.map((stats, index) => (
            <TopPlayerCard
              key={stats.name}
              rank={index + 1}
              name={stats.name}
              teamName={`C: ${stats.catches} | St: ${stats.stumpings} | RO: ${stats.runOuts}`}
              value={stats.total}
              label="Dismissals"
              isFirst={index === 0}
            />
          ))}
          {fieldingStats.length === 0 && (
            <Card className="p-4 bg-[#0F1B35] border-[#F9C846]/20 text-center">
              <p className="text-muted-foreground text-sm">No fielding stats available yet</p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="mvp" className="mt-0 space-y-2">
          {mvpLeaders.map((player, index) => (
            <TopPlayerCard
              key={player.id}
              rank={index + 1}
              name={player.name}
              teamName={`R: ${player.runs_scored ?? 0} | W: ${player.wickets_taken ?? 0}`}
              value={calculateMVPScore(player)}
              label="Points"
              isFirst={index === 0}
            />
          ))}
        </TabsContent>
      </Tabs>

      <div className="text-center">
        <Button asChild size="lg" className="font-semibold">
          <Link to="/stats">View Full Statistics</Link>
        </Button>
      </div>
    </div>
  );
};
