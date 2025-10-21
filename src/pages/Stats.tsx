import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Trophy, TrendingUp, Target, Award } from "lucide-react";

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

  const StatCard = ({ title, players, stat, icon: Icon }: any) => (
    <Card className="p-6 bg-gradient-card shadow-card">
      <div className="flex items-center gap-3 mb-6">
        <Icon className="text-secondary" size={28} />
        <h3 className="text-2xl font-bold text-primary">{title}</h3>
      </div>
      <div className="space-y-3">
        {players.map((player: PlayerStats, index: number) => (
          <div
            key={player.id}
            className="flex items-center justify-between p-3 bg-background/50 rounded-lg hover:bg-background/80 transition-all"
          >
            <div className="flex items-center gap-3">
              <Badge variant={index < 3 ? "default" : "outline"} className="w-8 h-8 flex items-center justify-center">
                {index + 1}
              </Badge>
              <div>
                <p className="font-semibold text-foreground">{player.name}</p>
                <div className="flex items-center gap-2">
                  {player.teams?.logo_url && (
                    <img src={player.teams.logo_url} alt="" className="w-4 h-4 object-contain" />
                  )}
                  <p className="text-sm text-muted-foreground">{player.teams?.name}</p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-secondary">{stat(player)}</p>
              {player.role && (
                <Badge variant="outline" className="text-xs mt-1">
                  {player.role}
                </Badge>
              )}
            </div>
          </div>
        ))}
        {players.length === 0 && (
          <p className="text-center text-muted-foreground py-8">No statistics available yet</p>
        )}
      </div>
    </Card>
  );

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
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Trophy className="text-secondary" size={32} />
          <h1 className="text-4xl font-bold text-primary">Player Statistics</h1>
        </div>

        <Tabs defaultValue="batting" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
            <TabsTrigger value="batting">Batting</TabsTrigger>
            <TabsTrigger value="bowling">Bowling</TabsTrigger>
            <TabsTrigger value="fielding">Fielding</TabsTrigger>
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
    </div>
  );
};

export default Stats;
