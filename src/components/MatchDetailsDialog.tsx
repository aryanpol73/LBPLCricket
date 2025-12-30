import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { PlayerProfileDialog } from "./PlayerProfileDialog";
import { toast } from "sonner";
import { Save, ExternalLink } from "lucide-react";

interface Player {
  id: string;
  name: string;
  role: string;
  is_key_player: boolean;
}

interface Match {
  id: string;
  match_no?: number;
  match_date: string;
  venue?: string;
  status?: string;
  team_a?: { id: string; name: string; short_name?: string };
  team_b?: { id: string; name: string; short_name?: string };
  team_a_score?: string;
  team_b_score?: string;
  scorer_link?: string;
}

interface MatchDetailsDialogProps {
  match: Match | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  getTeamName: (team: any, match: any) => string;
  formatMatchTime: (matchDate: string, matchNo: number) => string;
}

const MATCH_TIMES: Record<number, string> = {
  1: "7:00 AM - 7:40 AM", 2: "7:50 AM - 8:30 AM", 3: "8:40 AM - 9:20 AM",
  4: "9:30 AM - 10:10 AM", 5: "10:20 AM - 11:00 AM", 6: "11:10 AM - 11:50 AM",
  7: "12:00 PM - 12:40 PM", 8: "12:50 PM - 1:30 PM", 9: "1:40 PM - 2:20 PM",
  10: "2:30 PM - 3:10 PM", 11: "3:20 PM - 4:00 PM", 12: "4:10 PM - 4:50 PM",
  13: "5:00 PM - 5:40 PM", 14: "5:50 PM - 6:30 PM", 15: "6:40 PM - 7:20 PM",
  16: "7:30 PM - 8:10 PM", 17: "8:20 PM - 9:00 PM", 18: "9:10 PM - 9:50 PM",
  19: "7:00 AM - 7:40 AM", 20: "7:50 AM - 8:30 AM", 21: "8:40 AM - 9:20 AM",
  22: "9:30 AM - 10:10 AM", 23: "10:20 AM - 11:00 AM", 24: "11:10 AM - 11:50 AM",
  25: "12:00 PM - 12:40 PM", 26: "12:50 PM - 1:30 PM", 27: "1:40 PM - 2:20 PM",
  28: "2:30 PM - 3:10 PM", 29: "3:20 PM - 4:00 PM", 30: "4:10 PM - 4:50 PM",
  31: "5:10 PM - 5:50 PM", 32: "6:00 PM - 6:40 PM", 33: "7:00 PM - 7:40 PM",
};

export const MatchDetailsDialog = ({ 
  match, 
  open, 
  onOpenChange, 
  getTeamName,
  formatMatchTime 
}: MatchDetailsDialogProps) => {
  const [teamASquad, setTeamASquad] = useState<Player[]>([]);
  const [teamBSquad, setTeamBSquad] = useState<Player[]>([]);
  const [scorerLink, setScorerLink] = useState("");
  const [savedScorerLink, setSavedScorerLink] = useState("");
  const [selectedPlayer, setSelectedPlayer] = useState<any | null>(null);
  const [playerDialogOpen, setPlayerDialogOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handlePlayerClick = async (playerId: string) => {
    const { data } = await supabase
      .from('players')
      .select(`
        *,
        teams(name, logo_url)
      `)
      .eq('id', playerId)
      .single();
    
    if (data) {
      setSelectedPlayer(data);
      setPlayerDialogOpen(true);
    }
  };

  useEffect(() => {
    if (match && open) {
      loadSquads(match.team_a?.id, match.team_b?.id);
      loadScorerLink(match.id);
    }
  }, [match, open]);

  useEffect(() => {
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
    
    checkAdminStatus();
  }, []);

  const loadScorerLink = async (matchId: string) => {
    const { data } = await supabase
      .from('matches')
      .select('scorer_link')
      .eq('id', matchId)
      .maybeSingle();
    
    if (data?.scorer_link) {
      setScorerLink(data.scorer_link);
      setSavedScorerLink(data.scorer_link);
    } else {
      setScorerLink("");
      setSavedScorerLink("");
    }
  };

  const saveScorerLink = async () => {
    if (!match) return;
    
    setIsSaving(true);
    const { error } = await supabase
      .from('matches')
      .update({ scorer_link: scorerLink })
      .eq('id', match.id);
    
    setIsSaving(false);
    
    if (error) {
      toast.error("Failed to save scorer link");
    } else {
      setSavedScorerLink(scorerLink);
      toast.success("Scorer link saved successfully");
    }
  };

  const loadSquads = async (teamAId?: string, teamBId?: string) => {
    if (!teamAId || !teamBId) {
      setTeamASquad([]);
      setTeamBSquad([]);
      return;
    }

    const { data: playersData } = await supabase
      .from('players')
      .select('*')
      .in('team_id', [teamAId, teamBId])
      .order('is_key_player', { ascending: false });

    if (playersData) {
      setTeamASquad(playersData.filter(p => p.team_id === teamAId));
      setTeamBSquad(playersData.filter(p => p.team_id === teamBId));
    }
  };

  const PlayerList = ({ players, teamName }: { players: Player[]; teamName: string }) => {
    if (players.length === 0) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          No squad information available
        </div>
      );
    }

    const captains = players.filter(p => p.role === 'Captain');
    const viceCaptains = players.filter(p => p.role === 'Vice-Captain');
    const otherPlayers = players.filter(p => !p.role || (p.role !== 'Captain' && p.role !== 'Vice-Captain'));

    return (
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">{teamName}</h3>
        
        {captains.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-yellow-500 uppercase">{captains.length > 1 ? 'Captains' : 'Captain'}</h4>
            {captains.map((player) => (
              <div 
                key={player.id} 
                onClick={() => handlePlayerClick(player.id)}
                className="flex items-center justify-between p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30 hover:bg-yellow-500/20 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-yellow-500" />
                  <span className="font-medium hover:text-primary transition-colors">{player.name}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {viceCaptains.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-orange-500 uppercase">{viceCaptains.length > 1 ? 'Vice-Captains' : 'Vice-Captain'}</h4>
            {viceCaptains.map((player) => (
              <div 
                key={player.id} 
                onClick={() => handlePlayerClick(player.id)}
                className="flex items-center justify-between p-3 rounded-lg bg-orange-500/10 border border-orange-500/30 hover:bg-orange-500/20 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-orange-500" />
                  <span className="font-medium hover:text-primary transition-colors">{player.name}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {otherPlayers.length > 0 && (
          <div 
            className="space-y-2 max-h-[200px] overflow-y-auto scrollbar-hide scroll-smooth-ios"
            style={{ touchAction: 'pan-y' }}
          >
            {otherPlayers.map((player) => (
              <div 
                key={player.id} 
                onClick={() => handlePlayerClick(player.id)}
                className="flex items-center p-3 rounded-lg bg-card/50 border border-border/50 hover:bg-card/80 transition-all cursor-pointer"
              >
                <span className="hover:text-primary transition-colors">{player.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  if (!match) return null;

  const teamAName = getTeamName(match.team_a, match);
  const teamBName = getTeamName(match.team_b, match);
  const matchTime = MATCH_TIMES[match.match_no || 0] || "Time TBD";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            Match {match.match_no || '-'} - {teamAName} vs {teamBName}
          </DialogTitle>
          <DialogDescription>
            {formatMatchTime(match.match_date, match.match_no || 0)} • {matchTime} • Venue {match.venue || "TBD"}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="squad" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="squad">Squad</TabsTrigger>
            <TabsTrigger value="score">Score</TabsTrigger>
          </TabsList>

          <TabsContent value="squad" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="pt-6">
                  <PlayerList players={teamASquad} teamName={teamAName} />
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <PlayerList players={teamBSquad} teamName={teamBName} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="score" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Live Score</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isAdmin && (
                  <div className="flex gap-2">
                    <Input
                      placeholder="Paste scorer link URL here..."
                      value={scorerLink}
                      onChange={(e) => setScorerLink(e.target.value)}
                      className="flex-1"
                    />
                    <Button 
                      onClick={saveScorerLink} 
                      disabled={isSaving || scorerLink === savedScorerLink}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {isSaving ? "Saving..." : "Save"}
                    </Button>
                  </div>
                )}
                {savedScorerLink ? (
                  <div className="space-y-4">
                    <div className="w-full aspect-video rounded-lg overflow-hidden border">
                      <iframe
                        src={savedScorerLink}
                        className="w-full h-full"
                        title="Live Score"
                        allowFullScreen
                      />
                    </div>
                    <a 
                      href={savedScorerLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Open in new tab
                    </a>
                  </div>
                ) : (
                  <div className="w-full aspect-video rounded-lg border border-dashed flex items-center justify-center text-muted-foreground">
                    {isAdmin ? "Paste a scorer link URL and save to display live scores" : "No live score available for this match"}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>

      <PlayerProfileDialog 
        player={selectedPlayer}
        open={playerDialogOpen}
        onOpenChange={setPlayerDialogOpen}
      />
    </Dialog>
  );
};
