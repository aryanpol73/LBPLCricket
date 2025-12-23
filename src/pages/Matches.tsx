import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Trophy } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";

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

// Match time slots
const getMatchTime = (matchNo: number): string => {
  const times: Record<number, string> = {
    1: "7:00 AM - 7:40 AM",
    2: "7:50 AM - 8:30 AM",
    3: "8:40 AM - 9:20 AM",
    4: "9:30 AM - 10:10 AM",
    5: "10:20 AM - 11:00 AM",
    6: "11:10 AM - 11:50 AM",
    7: "12:00 PM - 12:40 PM",
    8: "12:50 PM - 1:30 PM",
    9: "1:40 PM - 2:20 PM",
    10: "2:30 PM - 3:10 PM",
    11: "3:20 PM - 4:00 PM",
    12: "4:10 PM - 4:50 PM",
    13: "5:00 PM - 5:40 PM",
    14: "5:50 PM - 6:30 PM",
    15: "6:40 PM - 7:20 PM",
    16: "7:30 PM - 8:10 PM",
    17: "8:20 PM - 9:00 PM",
    18: "9:10 PM - 9:50 PM",
    19: "7:00 AM - 7:40 AM",
    20: "7:50 AM - 8:30 AM",
    21: "8:40 AM - 9:20 AM",
    22: "9:30 AM - 10:10 AM",
    23: "10:20 AM - 11:00 AM",
    24: "11:10 AM - 11:50 AM",
    25: "12:00 PM - 12:40 PM",
    26: "12:50 PM - 1:30 PM",
    27: "1:40 PM - 2:20 PM",
    28: "2:30 PM - 3:10 PM",
    29: "3:20 PM - 4:00 PM",
    30: "4:10 PM - 4:50 PM",
    31: "5:10 PM - 5:50 PM",
    32: "6:00 PM - 6:40 PM",
    33: "7:00 PM - 7:40 PM",
  };
  return times[matchNo] || "TBD";
};

// Get match phase label
const getMatchPhase = (matchNo: number): string => {
  if (matchNo >= 1 && matchNo <= 18) return "Match yet to begin";
  if (matchNo >= 19 && matchNo <= 30) return "Match yet to begin";
  if (matchNo >= 31 && matchNo <= 32) return "Semi Final";
  if (matchNo === 33) return "Grand Final";
  return "";
};

// Get background color style based on match number
const getMatchStyle = (matchNo: number): React.CSSProperties => {
  // Match 1-18: Blue
  if (matchNo >= 1 && matchNo <= 18) {
    return {
      background: "linear-gradient(135deg, #1e3a5f 0%, #2a5298 50%, #1e3a5f 100%)",
      border: "2px solid #3b82f6",
    };
  }
  // Match 19-30: Purple
  if (matchNo >= 19 && matchNo <= 30) {
    return {
      background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #7c3aed 100%)",
      border: "2px solid #a855f7",
    };
  }
  // Match 31-32: Orange (Semi Finals)
  if (matchNo >= 31 && matchNo <= 32) {
    return {
      background: "linear-gradient(135deg, #ea580c 0%, #f97316 50%, #ea580c 100%)",
      border: "2px solid #f97316",
    };
  }
  // Match 33: Yellow (Final)
  if (matchNo === 33) {
    return {
      background: "linear-gradient(135deg, #eab308 0%, #facc15 50%, #eab308 100%)",
      border: "2px solid #facc15",
    };
  }
  return {};
};

interface MatchCardProps {
  matchNo: number;
  teamA?: string;
  teamB?: string;
  match?: Match | null;
  onMatchClick?: (match: Match) => void;
}

const MatchCard = ({ matchNo, teamA = "TBD", teamB = "TBD", match, onMatchClick }: MatchCardProps) => {
  const phase = getMatchPhase(matchNo);
  const time = getMatchTime(matchNo);
  const style = getMatchStyle(matchNo);
  
  // Text color for final match (yellow bg needs dark text)
  const textColor = matchNo === 33 ? "text-gray-900" : "text-white";
  const subtextColor = matchNo === 33 ? "text-gray-700" : "text-white/80";

  const handleClick = () => {
    if (match && onMatchClick) {
      onMatchClick(match);
    }
  };

  return (
    <div 
      className="rounded-xl p-5 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl cursor-pointer"
      style={style}
      onClick={handleClick}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className={`font-bold text-lg ${textColor}`}>{teamA}</h3>
          <h3 className={`font-bold text-lg ${textColor}`}>{teamB}</h3>
          <p className={`text-sm mt-1 ${subtextColor}`}>{phase}</p>
        </div>
        <div className="text-right">
          <p className={`font-bold text-lg ${textColor}`}>Match {matchNo}</p>
          <p className={`text-sm ${subtextColor}`}>{time}</p>
        </div>
      </div>
    </div>
  );
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

  const handleMatchClick = (match: Match) => {
    setSelectedMatch(match);
    setMatchDialogOpen(true);
  };

  // Create match data with fallback for TBD
  const getMatchData = (matchNo: number) => {
    const match = matches.find(m => m.match_no === matchNo);
    if (match) {
      return {
        match,
        teamA: getTeamName(match.team_a_id),
        teamB: getTeamName(match.team_b_id)
      };
    }
    return { match: null, teamA: "TBD", teamB: "TBD" };
  };

  // Day 1 matches (1-18)
  const day1Matches = Array.from({ length: 18 }, (_, i) => i + 1);
  
  // Day 2 matches (19-33)
  const day2Matches = Array.from({ length: 15 }, (_, i) => i + 19);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading matches...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl md:text-5xl font-bold text-primary italic mb-8">Fixtures</h1>

        <Tabs defaultValue="day1" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
            <TabsTrigger value="day1">Day 1 Fixtures</TabsTrigger>
            <TabsTrigger value="day2">Day 2 Fixtures</TabsTrigger>
          </TabsList>

          <TabsContent value="day1">
            <div className="space-y-4 max-w-4xl mx-auto">
              {day1Matches.map((matchNo) => {
                const { match, teamA, teamB } = getMatchData(matchNo);
                return (
                  <MatchCard 
                    key={matchNo} 
                    matchNo={matchNo} 
                    teamA={teamA}
                    teamB={teamB}
                    match={match}
                    onMatchClick={handleMatchClick}
                  />
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="day2">
            <div className="space-y-4 max-w-4xl mx-auto">
              {day2Matches.map((matchNo) => {
                const { match, teamA, teamB } = getMatchData(matchNo);
                return (
                  <MatchCard 
                    key={matchNo} 
                    matchNo={matchNo}
                    teamA={teamA}
                    teamB={teamB}
                    match={match}
                    onMatchClick={handleMatchClick}
                  />
                );
              })}
            </div>
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
