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
    <Card className="p-6 bg-gradient-card shadow-card">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="text-secondary" size={20} />
        <h3 className="font-bold text-foreground">Who will win?</h3>
      </div>

      <div className="space-y-3">
        <Button
          onClick={() => vote(teamAId)}
          disabled={voted || loading}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          {teamAName}
          {voted && <span className="ml-2">({teamAPercent}%)</span>}
        </Button>

        <Button
          onClick={() => vote(teamBId)}
          disabled={voted || loading}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          {teamBName}
          {voted && <span className="ml-2">({teamBPercent}%)</span>}
        </Button>
      </div>

      {voted && (
        <p className="text-sm text-muted-foreground mt-4 text-center">
          Total votes: {total}
        </p>
      )}
    </Card>
  );
};
