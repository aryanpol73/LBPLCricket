import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getMatchTime } from "@/lib/matchUtils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Save, ExternalLink } from "lucide-react";

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
  const [activeTab, setActiveTab] = useState("score");
  const [teamASquad, setTeamASquad] = useState<Player[]>([]);
  const [teamBSquad, setTeamBSquad] = useState<Player[]>([]);
  const [loading, setLoading] = useState(false);
  const [scorerLink, setScorerLink] = useState("");
  const [savedScorerLink, setSavedScorerLink] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [matchId, setMatchId] = useState<string | null>(null);
  
  useEffect(() => {
    if (open && matchNo) {
      loadMatchData();
      checkAdminStatus();
      if (teamA !== 'TBD' && teamB !== 'TBD') {
        loadSquads();
      }
    }
  }, [open, matchNo, teamA, teamB]);

  const checkAdminStatus = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .maybeSingle();
      setIsAdmin(!!data);
    }
  };

  const loadMatchData = async () => {
    const { data } = await supabase
      .from('matches')
      .select('id, scorer_link')
      .eq('match_no', matchNo)
      .maybeSingle();
    
    if (data) {
      setMatchId(data.id);
      setScorerLink(data.scorer_link || "");
      setSavedScorerLink(data.scorer_link || "");
    }
  };

  const saveScorerLink = async () => {
    if (!matchId) return;
    
    setIsSaving(true);
    const { error } = await supabase
      .from('matches')
      .update({ scorer_link: scorerLink })
      .eq('id', matchId);
    
    setIsSaving(false);
    
    if (error) {
      toast.error("Failed to save match link");
    } else {
      setSavedScorerLink(scorerLink);
      toast.success("Match link saved successfully");
    }
  };

  const loadSquads = async () => {
    setLoading(true);
    
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
      <div className="space-y-3">
        <h3 className="text-xl font-bold text-white">{teamName}</h3>
        
        {/* All players in one scrollable container */}
        <div 
          className="space-y-2 max-h-[280px] overflow-y-auto scrollbar-hide scroll-smooth-ios"
          style={{ touchAction: 'pan-y' }}
        >
          {/* Captain */}
          {captain && (
            <div className="bg-gradient-to-r from-[#3d3520] to-[#2a2515] rounded-lg p-3 flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
              <span className="text-white font-medium">{captain.name}</span>
              <span className="text-xs text-yellow-500 ml-auto">(C)</span>
            </div>
          )}

          {/* Vice-Captain */}
          {viceCaptain && (
            <div className="bg-gradient-to-r from-[#3d3520] to-[#2a2515] rounded-lg p-3 flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-orange-500"></span>
              <span className="text-white font-medium">{viceCaptain.name}</span>
              <span className="text-xs text-orange-500 ml-auto">(VC)</span>
            </div>
          )}

          {/* Squad Members */}
          {members.length > 0 ? (
            members.map((player) => (
              <div key={player.id} className="bg-[#1a2744] rounded-lg p-3 border border-border/30">
                <span className="text-white/80">{player.name}</span>
              </div>
            ))
          ) : (
            !captain && !viceCaptain && (
              <div className="bg-[#1a2744] rounded-lg p-3 border border-border/30">
                <span className="text-white/80">No squad data</span>
              </div>
            )
          )}
        </div>
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

        {/* Tabs for Score and Squad */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-4">
          <TabsList className="grid w-full grid-cols-2 bg-[#1a2744]">
            <TabsTrigger 
              value="score"
              className="data-[state=active]:bg-[#2a3f5f] data-[state=active]:text-white"
            >
              Score
            </TabsTrigger>
            <TabsTrigger 
              value="squad"
              className="data-[state=active]:bg-[#2a3f5f] data-[state=active]:text-white"
            >
              Squad
            </TabsTrigger>
          </TabsList>

          {/* Score Tab Content */}
          <TabsContent value="score" className="mt-6 space-y-4">
            {isAdmin && (
              <div className="flex gap-2">
                <Input
                  placeholder="Paste CricHeroes match URL here..."
                  value={scorerLink}
                  onChange={(e) => setScorerLink(e.target.value)}
                  className="flex-1 bg-[#1a2744] border-border/30"
                />
                <Button 
                  onClick={saveScorerLink} 
                  disabled={isSaving || scorerLink === savedScorerLink}
                  className="bg-secondary hover:bg-secondary/80"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? "Saving..." : "Save"}
                </Button>
              </div>
            )}
            
            {savedScorerLink ? (
              <div className="space-y-4">
                <div className="w-full h-[60vh] rounded-lg overflow-hidden border border-[#F9C846]/30">
                  <iframe
                    src={savedScorerLink}
                    className="w-full h-full border-0"
                    title={`Match ${matchNo} Details`}
                    allow="fullscreen"
                  />
                </div>
                <div className="text-center">
                  <a 
                    href={savedScorerLink.replace('tournament-embed/1/', 'tournament/')} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-[#F9C846] underline"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Open Match Details in Browser
                  </a>
                </div>
              </div>
            ) : (
              <div className="bg-[#1a2744] rounded-lg p-8 border border-border/30 text-center">
                <p className="text-muted-foreground">
                  {isAdmin 
                    ? "Paste a CricHeroes match URL above and save to display match details" 
                    : "Match details will be available once the match starts on CricHeroes"}
                </p>
              </div>
            )}
          </TabsContent>

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
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};