import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Trophy, TrendingUp, Target, Award } from "lucide-react";
import { PlayerProfileDialog } from "@/components/PlayerProfileDialog";

interface PlayerStats {
  id: string;
  name: string;
  team_id: string;
  role: string;
  matches_played: number;
  runs_scored: number;
  wickets_taken: number;
  batting_average: number;
  strike_rate: number;
  bowling_average: number;
  economy_rate: number;
  catches: number;
  stumpings: number;
  teams: {
    name: string;
    logo_url: string;
  };
}

const Stats = () => {
  const [players, setPlayers] = useState<PlayerStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [playerDialogOpen, setPlayerDialogOpen] = useState(false);

  const handlePlayerClick = (playerId: string) => {
    setSelectedPlayerId(playerId);
    setPlayerDialogOpen(true);
  };

  useEffect(() => {
    loadPlayerStats();
  }, []);

  const loadPlayerStats = async () => {
    const { data } = await supabase
      .from('players')
      .select(`
        *,
        teams(name, logo_url)
      `)
      .order('runs_scored', { ascending: false });

    setPlayers(data || []);
    setLoading(false);
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
                    {/* Shield Badge */}
                    <div className="relative w-32 h-40 bg-gradient-to-b from-[#0A1325] to-[#0F1B35] rounded-t-full flex flex-col items-center justify-center border-2 border-[#F9C846] shadow-[0_0_20px_rgba(249,200,70,0.4)] transition-all duration-300 group-hover:shadow-[0_0_30px_rgba(249,200,70,0.6)] group-hover:scale-105">
                      {/* Player Silhouette */}
                      <div className="w-16 h-16 rounded-full bg-[#2E73FF]/30 border-2 border-[#F9C846]/50 flex items-center justify-center mb-2">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-b from-[#F9C846]/40 to-transparent"></div>
                      </div>
                      
                      {/* Rank Badge */}
                      <div className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-br from-gray-300 to-gray-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg border-2 border-white">
                        2
                      </div>
                      
                      {/* Stats */}
                      <div className="mt-2 text-center">
                        <p className="text-xl font-bold text-[#F9C846]">{stat(topThree[1])}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* First Place - Larger */}
              {topThree[0] && (
                <div className="flex flex-col items-center animate-fade-in-up mb-8" style={{ animationDelay: '0s', animationFillMode: 'both' }}>
                  <div className="relative group">
                    {/* Shield Badge */}
                    <div className="relative w-40 h-48 bg-gradient-to-b from-[#0A1325] to-[#0F1B35] rounded-t-full flex flex-col items-center justify-center border-[3px] border-[#F9C846] shadow-[0_0_30px_rgba(249,200,70,0.5)] transition-all duration-300 group-hover:shadow-[0_0_40px_rgba(249,200,70,0.7)] group-hover:scale-105 animate-pulse-glow">
                      {/* Player Silhouette */}
                      <div className="w-20 h-20 rounded-full bg-[#2E73FF]/40 border-2 border-[#F9C846]/60 flex items-center justify-center mb-3">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-b from-[#F9C846]/50 to-transparent"></div>
                      </div>
                      
                      {/* Rank Badge */}
                      <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-[#F9C846] to-[#d4a837] rounded-full flex items-center justify-center text-[#0A1325] font-bold text-xl shadow-xl border-2 border-white">
                        1
                      </div>
                      
                      {/* Crown */}
                      <Trophy className="absolute -top-8 text-[#F9C846] animate-bounce-subtle" size={24} />
                      
                      {/* Stats */}
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
                    {/* Shield Badge */}
                    <div className="relative w-32 h-40 bg-gradient-to-b from-[#0A1325] to-[#0F1B35] rounded-t-full flex flex-col items-center justify-center border-2 border-[#F9C846] shadow-[0_0_20px_rgba(249,200,70,0.4)] transition-all duration-300 group-hover:shadow-[0_0_30px_rgba(249,200,70,0.6)] group-hover:scale-105">
                      {/* Player Silhouette */}
                      <div className="w-16 h-16 rounded-full bg-[#2E73FF]/30 border-2 border-[#F9C846]/50 flex items-center justify-center mb-2">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-b from-[#F9C846]/40 to-transparent"></div>
                      </div>
                      
                      {/* Rank Badge */}
                      <div className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-br from-amber-700 to-amber-900 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg border-2 border-white">
                        3
                      </div>
                      
                      {/* Stats */}
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8 text-center">
          <p>Loading statistics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A1325] via-[#0F1B35] to-[#0A1325]">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8 animate-slide-in-left">
          <div className="p-2 rounded-lg bg-[#F9C846]/10 border border-[#F9C846]/30">
            <Trophy className="text-[#F9C846]" size={32} />
          </div>
          <h1 className="text-4xl font-bold text-white">Player Statistics</h1>
        </div>

        <Tabs defaultValue="batting" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid animate-fade-in-up bg-[#0F1B35] border-[#F9C846]/30" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
            <TabsTrigger value="batting" className="transition-all duration-300 hover:scale-105 data-[state=active]:bg-[#2E73FF] data-[state=active]:text-white">Batting</TabsTrigger>
            <TabsTrigger value="bowling" className="transition-all duration-300 hover:scale-105 data-[state=active]:bg-[#2E73FF] data-[state=active]:text-white">Bowling</TabsTrigger>
            <TabsTrigger value="fielding" className="transition-all duration-300 hover:scale-105 data-[state=active]:bg-[#2E73FF] data-[state=active]:text-white">Fielding</TabsTrigger>
          </TabsList>

          <TabsContent value="batting" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <StatCard
                title="Top Run Scorers"
                players={getTopBatsmen()}
                stat={(p: PlayerStats) => `${p.runs_scored} runs`}
                icon={Trophy}
              />
              <StatCard
                title="Highest Strike Rate"
                players={getHighestStrikeRate()}
                stat={(p: PlayerStats) => `${p.strike_rate.toFixed(2)}`}
                icon={TrendingUp}
              />
            </div>
            <StatCard
              title="Best Batting Average"
              players={getHighestAverage()}
              stat={(p: PlayerStats) => `${p.batting_average.toFixed(2)}`}
              icon={Award}
            />
          </TabsContent>

          <TabsContent value="bowling" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <StatCard
                title="Top Wicket Takers"
                players={getTopBowlers()}
                stat={(p: PlayerStats) => `${p.wickets_taken} wickets`}
                icon={Target}
              />
              <StatCard
                title="Best Economy Rate"
                players={getBestEconomy()}
                stat={(p: PlayerStats) => `${p.economy_rate.toFixed(2)}`}
                icon={TrendingUp}
              />
            </div>
          </TabsContent>

          <TabsContent value="fielding" className="space-y-6">
            <StatCard
              title="Top Fielders"
              players={getTopFielders()}
              stat={(p: PlayerStats) => `${p.catches + p.stumpings} dismissals`}
              icon={Award}
            />
          </TabsContent>
        </Tabs>
      </div>

      <PlayerProfileDialog 
        playerId={selectedPlayerId}
        open={playerDialogOpen}
        onOpenChange={setPlayerDialogOpen}
      />
    </div>
  );
};

export default Stats;
