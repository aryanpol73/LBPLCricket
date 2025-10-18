import { useEffect, useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface TeamStanding {
  id: string;
  team: {
    name: string;
    logo_url?: string;
  };
  points: number;
  matches_played: number;
  wins: number;
}

export const LeaderboardSnapshot = () => {
  const [standings, setStandings] = useState<TeamStanding[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadTopTeams();
  }, []);

  const loadTopTeams = async () => {
    const { data } = await supabase
      .from('points_table')
      .select(`
        *,
        team:teams(name, logo_url)
      `)
      .order('points', { ascending: false })
      .order('net_run_rate', { ascending: false })
      .limit(4);

    if (data) {
      setStandings(data as any);
    }
  };

  const getRankColor = (index: number) => {
    if (index === 0) return "text-secondary";
    if (index === 1) return "text-primary";
    return "text-muted-foreground";
  };

  return (
    <div className="container mx-auto px-4 mb-12">
      <Card className="p-6 bg-gradient-card shadow-card">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Trophy className="text-secondary" size={24} />
            <h2 className="text-2xl font-bold text-foreground">Top Teams</h2>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/points-table')}
          >
            View Full Table
          </Button>
        </div>

        <div className="space-y-3">
          {standings.map((standing, index) => (
            <div 
              key={standing.id}
              className="flex items-center gap-4 p-3 bg-background rounded-lg hover:bg-accent/50 transition-colors"
            >
              <div className={`text-2xl font-bold ${getRankColor(index)} w-8`}>
                {index + 1}
              </div>
              
              {standing.team.logo_url && (
                <img 
                  src={standing.team.logo_url} 
                  alt={standing.team.name}
                  className="w-10 h-10 object-contain"
                />
              )}
              
              <div className="flex-1">
                <p className="font-bold text-foreground">{standing.team.name}</p>
                <p className="text-xs text-muted-foreground">
                  {standing.matches_played} matches • {standing.wins} wins
                </p>
              </div>
              
              <div className="text-right">
                <p className="text-2xl font-bold text-primary">{standing.points}</p>
                <p className="text-xs text-muted-foreground">points</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
