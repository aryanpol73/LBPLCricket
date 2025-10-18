import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Trophy } from "lucide-react";
import { toast } from "sonner";

interface Player {
  id: string;
  name: string;
  team_id: string;
}

interface PlayerOfMatchVotingProps {
  matchId: string;
}

export const PlayerOfMatchVoting = ({ matchId }: PlayerOfMatchVotingProps) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [voted, setVoted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPlayers();
    checkIfVoted();
  }, [matchId]);

  const loadPlayers = async () => {
    const { data: match } = await supabase
      .from('matches')
      .select('team_a_id, team_b_id')
      .eq('id', matchId)
      .single();

    if (match) {
      const { data: playerData } = await supabase
        .from('players')
        .select('*')
        .in('team_id', [match.team_a_id, match.team_b_id])
        .eq('is_key_player', true);

      if (playerData) {
        setPlayers(playerData);
      }
    }
  };

  const getUserIdentifier = () => {
    let identifier = localStorage.getItem('user_identifier');
    if (!identifier) {
      identifier = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('user_identifier', identifier);
    }
    return identifier;
  };

  const checkIfVoted = async () => {
    const userIdentifier = getUserIdentifier();
    const { data } = await supabase
      .from('potm_votes')
      .select('id')
      .eq('match_id', matchId)
      .eq('user_identifier', userIdentifier)
      .single();

    setVoted(!!data);
  };

  const vote = async (playerId: string) => {
    if (voted) {
      toast.error("You have already voted for this match!");
      return;
    }

    setLoading(true);
    const userIdentifier = getUserIdentifier();

    const { error } = await supabase
      .from('potm_votes')
      .insert({
        match_id: matchId,
        player_id: playerId,
        user_identifier: userIdentifier
      });

    if (error) {
      toast.error("Failed to submit vote");
    } else {
      toast.success("Vote submitted successfully!");
      setVoted(true);
    }
    setLoading(false);
  };

  if (voted) {
    return (
      <Card className="p-4 bg-gradient-card shadow-card">
        <p className="text-center text-muted-foreground">Thanks for voting!</p>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-gradient-card shadow-card">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="text-secondary" size={20} />
        <h3 className="font-bold text-foreground">Vote Player of the Match</h3>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {players.map((player) => (
          <Button
            key={player.id}
            variant="outline"
            onClick={() => vote(player.id)}
            disabled={loading}
            className="h-auto py-3"
          >
            {player.name}
          </Button>
        ))}
      </div>
    </Card>
  );
};
