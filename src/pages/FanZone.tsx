import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { TrendingUp, Trophy, Users } from "lucide-react";

const FanZone = () => {
  const [polls, setPolls] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPolls();
    loadLeaderboard();
  }, []);

  const getUserIdentifier = () => {
    let identifier = localStorage.getItem('user_identifier');
    if (!identifier) {
      identifier = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('user_identifier', identifier);
    }
    return identifier;
  };

  const loadPolls = async () => {
    const { data } = await supabase
      .from('fan_polls')
      .select(`
        *,
        fan_poll_options(*)
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    setPolls(data || []);
    setLoading(false);
  };

  const loadLeaderboard = async () => {
    const { data } = await supabase
      .from('fan_leaderboard')
      .select('*')
      .order('points', { ascending: false })
      .limit(10);

    setLeaderboard(data || []);
  };

  const votePoll = async (pollId: string, optionId: string) => {
    const identifier = getUserIdentifier();

    const { error } = await supabase
      .from('fan_poll_votes')
      .insert({ poll_id: pollId, option_id: optionId, user_identifier: identifier });

    if (error) {
      toast.error("Failed to submit vote or already voted");
    } else {
      toast.success("Vote submitted!");
      loadPolls();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <TrendingUp className="text-secondary" size={32} />
          <h1 className="text-4xl font-bold text-primary">Fan Zone</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Polls Section */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Users size={24} />
              Fan Polls
            </h2>

            {loading ? (
              <p className="text-muted-foreground">Loading polls...</p>
            ) : polls.length > 0 ? (
              polls.map((poll) => (
                <Card key={poll.id} className="p-6 bg-gradient-card shadow-card">
                  <h3 className="text-lg font-bold text-foreground mb-4">{poll.question}</h3>

                  <div className="space-y-3">
                    {poll.fan_poll_options?.map((option: any) => (
                      <Button
                        key={option.id}
                        onClick={() => votePoll(poll.id, option.id)}
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                      >
                        {option.option_text}
                      </Button>
                    ))}
                  </div>

                  {poll.ends_at && (
                    <p className="text-sm text-muted-foreground mt-4">
                      Ends: {new Date(poll.ends_at).toLocaleDateString()}
                    </p>
                  )}
                </Card>
              ))
            ) : (
              <Card className="p-8 bg-gradient-card shadow-card text-center">
                <p className="text-muted-foreground">No active polls at the moment</p>
              </Card>
            )}
          </div>

          {/* Leaderboard */}
          <div>
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2 mb-6">
              <Trophy size={24} />
              Top Fans
            </h2>

            <Card className="p-6 bg-gradient-card shadow-card">
              <div className="space-y-3">
                {leaderboard.length > 0 ? (
                  leaderboard.map((fan, index) => (
                    <div
                      key={fan.id}
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        index < 3 ? 'bg-secondary/10' : 'bg-muted/30'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Badge 
                          className={`
                            font-bold
                            ${index === 0 ? 'bg-secondary' : ''}
                            ${index === 1 ? 'bg-primary/70' : ''}
                            ${index === 2 ? 'bg-primary/50' : ''}
                          `}
                        >
                          #{index + 1}
                        </Badge>
                        <div>
                          <p className="font-medium text-foreground">
                            {fan.username || `Fan ${fan.user_identifier.slice(0, 8)}`}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {fan.correct_predictions}/{fan.total_predictions} correct
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className="font-bold">
                        {fan.points} pts
                      </Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-4">
                    No fans on leaderboard yet
                  </p>
                )}
              </div>
            </Card>

            <Card className="p-4 bg-muted/50 mt-4">
              <p className="text-sm text-muted-foreground">
                <strong>How to earn points:</strong>
                <br />
                • Make correct match predictions
                <br />
                • Participate in weekly polls
                <br />
                • Vote for Player of the Match
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FanZone;
