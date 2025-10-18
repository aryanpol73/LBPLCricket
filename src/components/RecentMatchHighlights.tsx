import { useEffect, useState } from "react";
import { Card } from "./ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Trophy, TrendingUp } from "lucide-react";

interface Match {
  id: string;
  team_a: { name: string; logo_url?: string };
  team_b: { name: string; logo_url?: string };
  team_a_score?: string;
  team_b_score?: string;
  winner_id?: string;
  player_of_match?: { name: string };
}

export const RecentMatchHighlights = () => {
  const [matches, setMatches] = useState<Match[]>([]);

  useEffect(() => {
    loadRecentMatches();
  }, []);

  const loadRecentMatches = async () => {
    const { data } = await supabase
      .from('matches')
      .select(`
        *,
        team_a:teams!matches_team_a_id_fkey(name, logo_url),
        team_b:teams!matches_team_b_id_fkey(name, logo_url),
        player_of_match:players!matches_player_of_match_id_fkey(name)
      `)
      .eq('status', 'completed')
      .order('match_date', { ascending: false })
      .limit(3);

    if (data) {
      setMatches(data as any);
    }
  };

  const getPredictionStats = async (matchId: string, winnerId?: string) => {
    if (!winnerId) return 0;

    const { count: totalVotes } = await supabase
      .from('match_predictions')
      .select('*', { count: 'exact', head: true })
      .eq('match_id', matchId);

    const { count: correctVotes } = await supabase
      .from('match_predictions')
      .select('*', { count: 'exact', head: true })
      .eq('match_id', matchId)
      .eq('team_id', winnerId);

    if (!totalVotes || totalVotes === 0) return 0;
    return Math.round(((correctVotes || 0) / totalVotes) * 100);
  };

  return (
    <div className="container mx-auto px-4 mb-12">
      <h2 className="text-3xl font-bold text-center text-primary mb-6">
        Recent Match Highlights
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {matches.map((match) => (
          <Card key={match.id} className="p-6 bg-gradient-card shadow-card hover:shadow-glow transition-all">
            <div className="space-y-4">
              {/* Teams and Scores */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  {match.team_a.logo_url && (
                    <img src={match.team_a.logo_url} alt={match.team_a.name} className="w-10 h-10 object-contain" />
                  )}
                  <div>
                    <p className="font-bold text-foreground">{match.team_a.name}</p>
                    <p className="text-2xl font-bold text-primary">{match.team_a_score || "0"}</p>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">vs</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <p className="font-bold text-foreground">{match.team_b.name}</p>
                    <p className="text-2xl font-bold text-primary">{match.team_b_score || "0"}</p>
                  </div>
                  {match.team_b.logo_url && (
                    <img src={match.team_b.logo_url} alt={match.team_b.name} className="w-10 h-10 object-contain" />
                  )}
                </div>
              </div>

              {/* Winner */}
              {match.winner_id && (
                <div className="flex items-center gap-2 justify-center py-2 bg-secondary/10 rounded-lg">
                  <Trophy className="text-secondary" size={16} />
                  <p className="text-sm font-semibold text-secondary">
                    {match.winner_id === match.team_a.name ? match.team_a.name : match.team_b.name} Won
                  </p>
                </div>
              )}

              {/* Player of the Match */}
              {match.player_of_match && (
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Player of the Match</p>
                  <p className="font-bold text-foreground">{match.player_of_match.name}</p>
                </div>
              )}

              {/* Fan Predictions - Placeholder for now */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <TrendingUp className="text-success" size={14} />
                  <p className="text-xs text-muted-foreground">Fan Predictions</p>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-success h-2 rounded-full" style={{ width: "65%" }} />
                </div>
                <p className="text-xs text-center text-muted-foreground">65% predicted correctly</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
