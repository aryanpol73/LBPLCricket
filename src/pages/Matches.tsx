import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { getMatchTime, getMatchPhase, getMatchStyle, getMatchTextColors } from "@/lib/matchUtils";
import { MatchDetailDialog } from "@/components/MatchDetailDialog";

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

interface MatchCardProps {
  matchNo: number;
  teamA?: string;
  teamB?: string;
  group?: string;
  onClick?: () => void;
}

const MatchCard = ({ matchNo, teamA = "TBD", teamB = "TBD", group, onClick }: MatchCardProps) => {
  const phase = getMatchPhase(matchNo);
  const time = getMatchTime(matchNo);
  const style = getMatchStyle(matchNo);
  const colors = getMatchTextColors(matchNo);

  return (
    <div 
      className="rounded-xl p-5 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl cursor-pointer"
      style={style}
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className={`font-bold text-lg ${colors.text}`}>{teamA}</h3>
          <h3 className={`font-bold text-lg ${colors.text}`}>{teamB}</h3>
          <p className={`text-sm mt-1 ${colors.subtext}`}>{phase}{group ? ` • Group ${group}` : ''}</p>
        </div>
        <div className="text-right">
          <p className={`font-bold text-lg ${colors.text}`}>Match {matchNo}</p>
          <p className={`text-sm ${colors.subtext}`}>{time}</p>
        </div>
      </div>
    </div>
  );
};

const Matches = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedMatchNo, setSelectedMatchNo] = useState<number | null>(null);
  const [selectedTeamA, setSelectedTeamA] = useState<string>('TBD');
  const [selectedTeamB, setSelectedTeamB] = useState<string>('TBD');
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
    return team?.name || team?.short_name || 'TBD';
  };

  const handleMatchClick = (matchNo: number, teamA: string, teamB: string) => {
    setSelectedMatchNo(matchNo);
    setSelectedTeamA(teamA);
    setSelectedTeamB(teamB);
    setMatchDialogOpen(true);
  };

  // Create match data with fallback for TBD
  const getMatchData = (matchNo: number) => {
    const match = matches.find(m => m.match_no === matchNo);
    if (match) {
      return {
        match,
        teamA: getTeamName(match.team_a_id),
        teamB: getTeamName(match.team_b_id),
        group: match.group_name || ''
      };
    }
    return { match: null, teamA: "TBD", teamB: "TBD", group: '' };
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
      <div className="container mx-auto px-4 pt-20 pb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-primary italic mb-8">Fixtures</h1>

        <Tabs defaultValue="day1" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
            <TabsTrigger value="day1">Day 1 Fixtures</TabsTrigger>
            <TabsTrigger value="day2">Day 2 Fixtures</TabsTrigger>
          </TabsList>

          <TabsContent value="day1">
            <div className="space-y-4 max-w-4xl mx-auto">
              {day1Matches.map((matchNo) => {
                const { teamA, teamB, group } = getMatchData(matchNo);
                return (
                  <MatchCard 
                    key={matchNo} 
                    matchNo={matchNo} 
                    teamA={teamA}
                    teamB={teamB}
                    group={group}
                    onClick={() => handleMatchClick(matchNo, teamA, teamB)}
                  />
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="day2">
            <div className="space-y-4 max-w-4xl mx-auto">
              {day2Matches.map((matchNo) => {
                const { teamA, teamB, group } = getMatchData(matchNo);
                return (
                  <MatchCard 
                    key={matchNo} 
                    matchNo={matchNo}
                    teamA={teamA}
                    teamB={teamB}
                    group={group}
                    onClick={() => handleMatchClick(matchNo, teamA, teamB)}
                  />
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Match Detail Dialog - now uses ScorecardView with proper scorecard data */}
      <MatchDetailDialog
        matchNo={selectedMatchNo}
        open={matchDialogOpen}
        onOpenChange={setMatchDialogOpen}
        teamA={selectedTeamA}
        teamB={selectedTeamB}
      />
    </div>
  );
};

export default Matches;
