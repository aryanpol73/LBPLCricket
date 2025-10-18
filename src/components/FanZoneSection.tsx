import { useEffect, useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { supabase } from "@/integrations/supabase/client";
import { BarChart3 } from "lucide-react";
import { toast } from "sonner";

interface Poll {
  id: string;
  question: string;
  options: Array<{
    id: string;
    option_text: string;
    team?: { name: string };
  }>;
}

export const FanZoneSection = () => {
  const [poll, setPoll] = useState<Poll | null>(null);
  const [voted, setVoted] = useState(false);
  const [results, setResults] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadActivePoll();
  }, []);

  const loadActivePoll = async () => {
    const { data: pollData } = await supabase
      .from('fan_polls')
      .select(`
        *,
        options:fan_poll_options(
          id,
          option_text,
          team:teams(name)
        )
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (pollData) {
      setPoll(pollData as any);
      checkIfVoted(pollData.id);
      loadResults(pollData.id);
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

  const checkIfVoted = async (pollId: string) => {
    const userIdentifier = getUserIdentifier();
    const { data } = await supabase
      .from('fan_poll_votes')
      .select('id')
      .eq('poll_id', pollId)
      .eq('user_identifier', userIdentifier)
      .single();

    setVoted(!!data);
  };

  const loadResults = async (pollId: string) => {
    const { data: votes } = await supabase
      .from('fan_poll_votes')
      .select('option_id')
      .eq('poll_id', pollId);

    if (votes) {
      const counts: Record<string, number> = {};
      votes.forEach(vote => {
        counts[vote.option_id] = (counts[vote.option_id] || 0) + 1;
      });
      setResults(counts);
    }
  };

  const vote = async (optionId: string) => {
    if (!poll || voted) return;

    setLoading(true);
    const userIdentifier = getUserIdentifier();

    const { error } = await supabase
      .from('fan_poll_votes')
      .insert({
        poll_id: poll.id,
        option_id: optionId,
        user_identifier: userIdentifier
      });

    if (error) {
      toast.error("Failed to submit vote");
    } else {
      toast.success("Vote submitted!");
      setVoted(true);
      loadResults(poll.id);
    }
    setLoading(false);
  };

  if (!poll) return null;

  const totalVotes = Object.values(results).reduce((sum, count) => sum + count, 0);

  return (
    <div className="container mx-auto px-4 mb-12">
      <Card className="p-6 bg-gradient-card shadow-card">
        <div className="flex items-center gap-2 mb-6">
          <BarChart3 className="text-primary" size={24} />
          <h2 className="text-2xl font-bold text-foreground">This Week's Fan Poll</h2>
        </div>

        <p className="text-lg font-semibold text-foreground mb-6">{poll.question}</p>

        {!voted ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {poll.options.map((option) => (
              <Button
                key={option.id}
                variant="outline"
                onClick={() => vote(option.id)}
                disabled={loading}
                className="h-auto py-4 text-left justify-start"
              >
                {option.team?.name || option.option_text}
              </Button>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {poll.options.map((option) => {
              const votes = results[option.id] || 0;
              const percentage = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;

              return (
                <div key={option.id} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-semibold text-foreground">
                      {option.team?.name || option.option_text}
                    </span>
                    <span className="text-muted-foreground">{percentage}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3">
                    <div 
                      className="bg-gradient-hero h-3 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
            <p className="text-sm text-muted-foreground text-center pt-2">
              Total votes: {totalVotes}
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};
