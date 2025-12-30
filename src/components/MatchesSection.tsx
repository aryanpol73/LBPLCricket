import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { MatchDetailDialog } from "@/components/MatchDetailDialog";
import { getMatchTime, getMatchPhase, getMatchStyle, getMatchTextColors } from "@/lib/matchUtils";
import { supabase } from "@/integrations/supabase/client";

interface Match {
  id: string;
  match_no: number | null;
  team_a_id: string;
  team_b_id: string;
  group_name: string | null;
  status: string | null;
}

interface Team {
  id: string;
  name: string;
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
          <p className={`text-sm mt-1 ${colors.subtext}`}>{phase} {group ? `• Group ${group}` : ''}</p>
        </div>
        <div className="text-right">
          <p className={`font-bold text-lg ${colors.text}`}>Match {matchNo}</p>
          <p className={`text-sm ${colors.subtext}`}>{time}</p>
        </div>
      </div>
    </div>
  );
};

interface MatchesSectionProps {
  limit?: number;
}

export const MatchesSection = ({ limit }: MatchesSectionProps) => {
  const [selectedMatch, setSelectedMatch] = useState<number | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [matches, setMatches] = useState<Match[]>([]);
  const [teams, setTeams] = useState<Record<string, string>>({});
  const [selectedTeamA, setSelectedTeamA] = useState<string>('TBD');
  const [selectedTeamB, setSelectedTeamB] = useState<string>('TBD');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    // Load teams
    const { data: teamsData } = await supabase
      .from('teams')
      .select('id, name');
    
    if (teamsData) {
      const teamMap: Record<string, string> = {};
      teamsData.forEach((team: Team) => {
        teamMap[team.id] = team.name;
      });
      setTeams(teamMap);
    }

    // Load matches
    const { data: matchesData } = await supabase
      .from('matches')
      .select('id, match_no, team_a_id, team_b_id, group_name, status')
      .order('match_no');
    
    if (matchesData) {
      setMatches(matchesData);
    }
  };

  const getMatchData = (matchNo: number) => {
    const match = matches.find(m => m.match_no === matchNo);
    if (match) {
      return {
        teamA: teams[match.team_a_id] || 'TBD',
        teamB: teams[match.team_b_id] || 'TBD',
        group: match.group_name || ''
      };
    }
    return { teamA: 'TBD', teamB: 'TBD', group: '' };
  };

  // Day 1 matches (1-18)
  const day1Matches = Array.from({ length: 18 }, (_, i) => i + 1);
  
  // Day 2 matches (19-33)
  const day2Matches = Array.from({ length: 15 }, (_, i) => i + 19);

  // Apply limit if provided
  const displayedDay1Matches = limit ? day1Matches.slice(0, limit) : day1Matches;
  const displayedDay2Matches = limit ? day2Matches.slice(0, limit) : day2Matches;
  const hasMoreMatches = limit && (day1Matches.length > limit || day2Matches.length > limit);

  const handleMatchClick = (matchNo: number) => {
    const matchData = getMatchData(matchNo);
    setSelectedTeamA(matchData.teamA);
    setSelectedTeamB(matchData.teamB);
    setSelectedMatch(matchNo);
    setDialogOpen(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-4xl md:text-5xl font-bold text-primary mb-8 text-center">Match Fixtures</h2>

      <Tabs defaultValue="day1" className="w-full">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
          <TabsTrigger value="day1">Day 1 Fixtures</TabsTrigger>
          <TabsTrigger value="day2">Day 2 Fixtures</TabsTrigger>
        </TabsList>

        <TabsContent value="day1">
          <div className="space-y-4 max-w-4xl mx-auto">
            {displayedDay1Matches.map((matchNo) => {
              const matchData = getMatchData(matchNo);
              return (
                <MatchCard 
                  key={matchNo} 
                  matchNo={matchNo}
                  teamA={matchData.teamA}
                  teamB={matchData.teamB}
                  group={matchData.group}
                  onClick={() => handleMatchClick(matchNo)}
                />
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="day2">
          <div className="space-y-4 max-w-4xl mx-auto">
            {displayedDay2Matches.map((matchNo) => {
              const matchData = getMatchData(matchNo);
              return (
                <MatchCard 
                  key={matchNo} 
                  matchNo={matchNo}
                  teamA={matchData.teamA}
                  teamB={matchData.teamB}
                  group={matchData.group}
                  onClick={() => handleMatchClick(matchNo)}
                />
              );
            })}
          </div>
        </TabsContent>
      </Tabs>

      <div className="text-center mt-8">
        <Button asChild size="lg" className="font-semibold">
          <Link to="/matches">{hasMoreMatches ? "View More" : "View All Matches"}</Link>
        </Button>
      </div>

      {/* Match Detail Dialog */}
      <MatchDetailDialog
        matchNo={selectedMatch}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        teamA={selectedTeamA}
        teamB={selectedTeamB}
      />
    </div>
  );
};