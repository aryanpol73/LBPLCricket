import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getMatchTime } from "@/lib/matchUtils";
import { supabase } from "@/integrations/supabase/client";

interface Player {
  id: string;
  name: string;
  role: string | null;
  team_id: string | null;
}

interface MatchDetailDialogProps {
  matchNo: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teamA?: string;
  teamB?: string;
}

export const MatchDetailDialog = ({
  matchNo,
  open,
  onOpenChange,
  teamA = "TBD",
  teamB = "TBD",
}: MatchDetailDialogProps) => {
  const [activeTab, setActiveTab] = useState("squad");
  const [teamASquad, setTeamASquad] = useState<Player[]>([]);
  const [teamBSquad, setTeamBSquad] = useState<Player[]>([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (open && matchNo && teamA !== 'TBD' && teamB !== 'TBD') {
      loadSquads();
    }
  }, [open, matchNo, teamA, teamB]);

  const loadSquads = async () => {
    setLoading(true);
    
    // Get team IDs from team names
    const { data: teamsData } = await supabase
      .from('teams')
      .select('id, name')
      .in('name', [teamA, teamB]);
    
    if (teamsData && teamsData.length > 0) {
      const teamAData = teamsData.find(t => t.name === teamA);
      const teamBData = teamsData.find(t => t.name === teamB);
      
      if (teamAData) {
        const { data: playersA } = await supabase
          .from('players')
          .select('id, name, role, team_id')
          .eq('team_id', teamAData.id)
          .order('role');
        
        if (playersA) setTeamASquad(playersA);
      }
      
      if (teamBData) {
        const { data: playersB } = await supabase
          .from('players')
          .select('id, name, role, team_id')
          .eq('team_id', teamBData.id)
          .order('role');
        
        if (playersB) setTeamBSquad(playersB);
      }
    }
    
    setLoading(false);
  };

  if (!matchNo) return null;

  const time = getMatchTime(matchNo);
  const day = matchNo <= 18 ? "Jan 3, 2026" : "Jan 4, 2026";

  const getCaptain = (squad: Player[]) => squad.find(p => p.role === 'Captain');
  const getViceCaptain = (squad: Player[]) => squad.find(p => p.role === 'Vice-Captain');
  const getSquadMembers = (squad: Player[]) => squad.filter(p => p.role !== 'Captain' && p.role !== 'Vice-Captain');

  const renderSquadSection = (squad: Player[], teamName: string) => {
    const captain = getCaptain(squad);
    const viceCaptain = getViceCaptain(squad);
    const members = getSquadMembers(squad);

    return (
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-white">{teamName}</h3>
        
        {/* Captain */}
        <div>
          <p className="text-xs font-semibold text-secondary uppercase tracking-wider mb-2">Captain</p>
          <div className="bg-gradient-to-r from-[#3d3520] to-[#2a2515] rounded-lg p-3 flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-orange-500"></span>
            <span className="text-white font-medium">{captain?.name || '--'}</span>
          </div>
        </div>

        {/* Vice-Captain */}
        <div>
          <p className="text-xs font-semibold text-orange-500 uppercase tracking-wider mb-2">Vice-Captain</p>
          <div className="bg-gradient-to-r from-[#3d3520] to-[#2a2515] rounded-lg p-3 flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-orange-500"></span>
            <span className="text-white font-medium">{viceCaptain?.name || '--'}</span>
          </div>
        </div>

        {/* Squad Members */}
        {members.length > 0 && (
          <div 
            className="space-y-2 max-h-[200px] overflow-y-auto"
            style={{ touchAction: 'pan-y', WebkitOverflowScrolling: 'touch' }}
          >
            {members.map((player) => (
              <div key={player.id} className="bg-[#1a2744] rounded-lg p-3 border border-border/30">
                <span className="text-white/80">{player.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-[#0F1B35] to-[#0A1325] border-border/50">
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-2xl font-bold text-white">
            Match {matchNo} - {teamA} vs {teamB}
          </DialogTitle>
          <p className="text-muted-foreground text-sm">
            {day} • {time} • Pune
          </p>
        </DialogHeader>

        {/* Tabs for Squad and Score */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-4">
          <TabsList className="grid w-full grid-cols-2 bg-[#1a2744]">
            <TabsTrigger 
              value="squad"
              className="data-[state=active]:bg-[#2a3f5f] data-[state=active]:text-white"
            >
              Squad
            </TabsTrigger>
            <TabsTrigger 
              value="score"
              className="data-[state=active]:bg-[#2a3f5f] data-[state=active]:text-white"
            >
              Score
            </TabsTrigger>
          </TabsList>

          {/* Squad Tab Content */}
          <TabsContent value="squad" className="mt-6">
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Loading squads...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderSquadSection(teamASquad, teamA)}
                {renderSquadSection(teamBSquad, teamB)}
              </div>
            )}
          </TabsContent>

          {/* Score Tab Content */}
          <TabsContent value="score" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Team A Score */}
              <div className="bg-[#1a2744] rounded-lg p-6 border border-border/30">
                <h3 className="text-xl font-bold text-white mb-4">{teamA}</h3>
                <div className="text-center py-8">
                  <p className="text-4xl font-bold text-secondary">--</p>
                  <p className="text-muted-foreground text-sm mt-2">Score will be updated</p>
                </div>
              </div>

              {/* Team B Score */}
              <div className="bg-[#1a2744] rounded-lg p-6 border border-border/30">
                <h3 className="text-xl font-bold text-white mb-4">{teamB}</h3>
                <div className="text-center py-8">
                  <p className="text-4xl font-bold text-secondary">--</p>
                  <p className="text-muted-foreground text-sm mt-2">Score will be updated</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};