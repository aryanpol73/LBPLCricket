import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar, Clock, Trophy } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface Match {
  id: string;
  match_no: number | null;
  match_date: string;
  team_a_id: string;
  team_b_id: string;
  team_a_score: string | null;
  team_b_score: string | null;
  status: string | null;
  winner_id: string | null;
  scorer_link: string | null;
  group_name: string | null;
  round_no: number | null;
}

interface Team {
  id: string;
  name: string;
  short_name: string | null;
  logo_url: string | null;
}

const MATCH_TIMES: Record<number, string> = {
  1: "8:00 AM", 2: "8:45 AM", 3: "9:30 AM", 4: "10:15 AM", 5: "11:00 AM",
  6: "11:45 AM", 7: "12:30 PM", 8: "1:15 PM", 9: "2:00 PM", 10: "2:45 PM",
  11: "3:30 PM", 12: "4:15 PM", 13: "5:00 PM", 14: "5:45 PM", 15: "6:30 PM",
  16: "7:15 PM", 17: "8:00 PM", 18: "8:45 PM", 19: "9:30 PM", 20: "10:15 PM"
};

const Matches = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [matchDialogOpen, setMatchDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
    
    // Real-time subscription
    const channel = supabase
      .channel('matches-page-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'matches' }, () => {
        loadData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadData = async () => {
    const [matchesRes, teamsRes] = await Promise.all([
      supabase.from('matches').select('*').order('match_no', { ascending: true }),
      supabase.from('teams').select('*')
    ]);

    if (matchesRes.data) setMatches(matchesRes.data);
    if (teamsRes.data) setTeams(teamsRes.data);
    setLoading(false);
  };

  const getTeamName = (teamId: string) => {
    const team = teams.find(t => t.id === teamId);
    return team?.short_name || team?.name || 'TBD';
  };

  const getTeamLogo = (teamId: string) => {
    const team = teams.find(t => t.id === teamId);
    return team?.logo_url;
  };

  const getMatchTime = (matchNo: number | null) => {
    if (!matchNo) return '';
    return MATCH_TIMES[matchNo] || '';
  };

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'live': return 'bg-red-500 text-white';
      case 'completed': return 'bg-green-500/20 text-green-400';
      default: return 'bg-secondary/20 text-secondary';
    }
  };

  const getStatusText = (status: string | null) => {
    switch (status) {
      case 'live': return 'LIVE';
      case 'completed': return 'Completed';
      default: return 'Upcoming';
    }
  };

  const handleMatchClick = (match: Match) => {
    setSelectedMatch(match);
    setMatchDialogOpen(true);
  };

  // Group matches by round
  const round1Matches = matches.filter(m => m.round_no === 1);
  const round2Matches = matches.filter(m => m.round_no === 2);

  const MatchCard = ({ match }: { match: Match }) => (
    <Card
      className="min-w-[280px] p-4 bg-card/80 border border-border/50 hover:border-secondary/50 cursor-pointer transition-all hover:scale-[1.02]"
      onClick={() => handleMatchClick(match)}
    >
      <div className="flex justify-between items-center mb-3">
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(match.status)}`}>
          {getStatusText(match.status)}
        </span>
        <span className="text-xs text-muted-foreground">
          Match {match.match_no}
        </span>
      </div>

      <div className="space-y-3">
        {/* Team A */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getTeamLogo(match.team_a_id) ? (
              <img src={getTeamLogo(match.team_a_id)!} alt="" className="w-8 h-8 rounded-full object-cover" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <Trophy className="w-4 h-4 text-primary" />
              </div>
            )}
            <span className={`font-medium ${match.winner_id === match.team_a_id ? 'text-secondary' : 'text-foreground'}`}>
              {getTeamName(match.team_a_id)}
            </span>
          </div>
          {match.team_a_score && (
            <span className="font-bold text-foreground">{match.team_a_score}</span>
          )}
        </div>

        <div className="text-center text-xs text-muted-foreground">vs</div>

        {/* Team B */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getTeamLogo(match.team_b_id) ? (
              <img src={getTeamLogo(match.team_b_id)!} alt="" className="w-8 h-8 rounded-full object-cover" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <Trophy className="w-4 h-4 text-primary" />
              </div>
            )}
            <span className={`font-medium ${match.winner_id === match.team_b_id ? 'text-secondary' : 'text-foreground'}`}>
              {getTeamName(match.team_b_id)}
            </span>
          </div>
          {match.team_b_score && (
            <span className="font-bold text-foreground">{match.team_b_score}</span>
          )}
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-border/30 flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {format(new Date(match.match_date), 'MMM d')}
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {getMatchTime(match.match_no)}
        </div>
        {match.group_name && (
          <span className="text-secondary">{match.group_name}</span>
        )}
      </div>
    </Card>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading matches...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Trophy className="text-secondary" size={32} />
          <h1 className="text-4xl font-bold text-primary">Fixtures</h1>
        </div>

        <Tabs defaultValue="round1" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
            <TabsTrigger value="round1">Round 1 ({round1Matches.length})</TabsTrigger>
            <TabsTrigger value="round2">Round 2 ({round2Matches.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="round1">
            {round1Matches.length > 0 ? (
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide" style={{ touchAction: 'pan-y pan-x' }}>
                {round1Matches.map((match) => (
                  <MatchCard key={match.id} match={match} />
                ))}
              </div>
            ) : (
              <Card className="p-8 bg-card border border-border text-center">
                <Calendar className="mx-auto mb-4 text-secondary" size={48} />
                <p className="text-muted-foreground text-lg">Round 1 fixtures will be updated soon</p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="round2">
            {round2Matches.length > 0 ? (
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide" style={{ touchAction: 'pan-y pan-x' }}>
                {round2Matches.map((match) => (
                  <MatchCard key={match.id} match={match} />
                ))}
              </div>
            ) : (
              <Card className="p-8 bg-card border border-border text-center">
                <Calendar className="mx-auto mb-4 text-secondary" size={48} />
                <p className="text-muted-foreground text-lg">Round 2 fixtures will be updated soon</p>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Match Details Dialog with CricHeroes Iframe */}
      <Dialog open={matchDialogOpen} onOpenChange={setMatchDialogOpen}>
        <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trophy className="text-secondary" />
              Match {selectedMatch?.match_no}: {selectedMatch && getTeamName(selectedMatch.team_a_id)} vs {selectedMatch && getTeamName(selectedMatch.team_b_id)}
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 overflow-hidden">
            {selectedMatch?.scorer_link ? (
              <iframe
                src={selectedMatch.scorer_link}
                className="w-full h-full border-0 rounded-lg"
                title="Live Score"
                allow="fullscreen"
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <Trophy className="text-secondary mb-4" size={64} />
                <p className="text-muted-foreground text-lg mb-2">Live score not available yet</p>
                <p className="text-sm text-muted-foreground">
                  Score link will be added once the match begins
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Matches;
