import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { TrendingUp } from "lucide-react";

interface MatchPredictionPollProps {
  matchId: string;
  teamAId: string;
  teamBId: string;
  teamAName: string;
  teamBName: string;
}

export const MatchPredictionPoll = ({ 
  matchId, 
  teamAId, 
  teamBId, 
  teamAName, 
  teamBName 
}: MatchPredictionPollProps) => {
  const [voted, setVoted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState({ teamA: 0, teamB: 0 });

  useEffect(() => {
    loadResults();
    checkIfVoted();
    
    // Set up real-time subscription for prediction updates
    const channel = supabase
      .channel('match-predictions')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'match_predictions',
          filter: `match_id=eq.${matchId}`
        },
        () => {
          loadResults();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [matchId]);

  const getUserIdentifier = () => {
    let identifier = localStorage.getItem('user_identifier');
    if (!identifier) {
      identifier = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('user_identifier', identifier);
    }
    return identifier;
  };

  const checkIfVoted = async () => {
    const identifier = getUserIdentifier();
    const { data } = await supabase
      .from('match_predictions')
      .select('id')
      .eq('match_id', matchId)
      .eq('user_identifier', identifier)
      .single();
    
    if (data) setVoted(true);
  };

  const loadResults = async () => {
    const { data } = await supabase
      .from('match_predictions')
      .select('team_id')
      .eq('match_id', matchId);

    if (data) {
      const teamAVotes = data.filter(v => v.team_id === teamAId).length;
      const teamBVotes = data.filter(v => v.team_id === teamBId).length;
      setResults({ teamA: teamAVotes, teamB: teamBVotes });
    }
  };

  const vote = async (teamId: string) => {
    if (voted) {
      toast.error("You've already voted!");
      return;
    }

    setLoading(true);
    const identifier = getUserIdentifier();

    const { error } = await supabase
      .from('match_predictions')
      .insert({ match_id: matchId, team_id: teamId, user_identifier: identifier });

    if (error) {
      toast.error("Failed to submit vote");
    } else {
      toast.success("Vote submitted!");
      setVoted(true);
      loadResults();
    }
    setLoading(false);
  };

  const total = results.teamA + results.teamB;
  const teamAPercent = total > 0 ? Math.round((results.teamA / total) * 100) : 0;
  const teamBPercent = total > 0 ? Math.round((results.teamB / total) * 100) : 0;

  return (
    <Card className="p-4 bg-gradient-card shadow-card">
      <div className="flex items-center gap-2 mb-3">
        <TrendingUp className="text-[hsl(45,90%,55%)]" size={20} />
        <h3 className="font-bold text-foreground text-base">Who will win?</h3>
      </div>

      <div className="space-y-2">
        <button
          onClick={() => vote(teamAId)}
          disabled={voted || loading}
          className="w-full relative overflow-hidden rounded-lg border border-border/50 bg-gradient-hero/20 hover:bg-gradient-hero/30 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed p-3"
        >
          <div 
            className="absolute inset-0 bg-gradient-hero transition-all duration-500"
            style={{ width: `${teamAPercent}%` }}
          />
          <div className="relative flex items-center justify-between text-white font-semibold text-sm">
            <span className="truncate mr-2">{teamAName}</span>
            <span>({teamAPercent}%)</span>
          </div>
        </button>

        <button
          onClick={() => vote(teamBId)}
          disabled={voted || loading}
          className="w-full relative overflow-hidden rounded-lg border border-border/50 bg-gradient-hero/20 hover:bg-gradient-hero/30 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed p-3"
        >
          <div 
            className="absolute inset-0 bg-gradient-hero transition-all duration-500"
            style={{ width: `${teamBPercent}%` }}
          />
          <div className="relative flex items-center justify-between text-white font-semibold text-sm">
            <span className="truncate mr-2">{teamBName}</span>
            <span>({teamBPercent}%)</span>
          </div>
        </button>
      </div>

      <p className="text-xs text-muted-foreground mt-3 text-center">
        Total votes: {total}
      </p>
    </Card>
  );
};
