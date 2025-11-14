import { useEffect, useState } from "react";
import { Card } from "./ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { format, isToday, isTomorrow } from "date-fns";

interface Match {
  id: string;
  match_no?: number;
  team_a: { name: string; logo_url?: string; id: string };
  team_b: { name: string; logo_url?: string; id: string };
  team_a_score?: string;
  team_b_score?: string;
  team_a_id: string;
  team_b_id: string;
  match_date: string;
  venue?: string;
  status: string;
  winner_id?: string;
}

interface Player {
  id: string;
  name: string;
  role?: string;
  team_id?: string;
}

export const MatchTimeline = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [teamAPlayers, setTeamAPlayers] = useState<Player[]>([]);
  const [teamBPlayers, setTeamBPlayers] = useState<Player[]>([]);
  const [iframeUrl, setIframeUrl] = useState("");

  useEffect(() => {
    loadMatches();
  }, []);

  useEffect(() => {
    if (selectedMatch) {
      loadSquads(selectedMatch.team_a_id, selectedMatch.team_b_id);
    }
  }, [selectedMatch]);

  const loadMatches = async () => {
    const { data } = await supabase
      .from('matches')
      .select(`
        *,
        team_a:teams!matches_team_a_id_fkey(*),
        team_b:teams!matches_team_b_id_fkey(*)
      `)
      .in('status', ['live', 'upcoming', 'completed'])
      .order('match_date', { ascending: true })
      .limit(20);

    setMatches(data as any || []);
  };

  const loadSquads = async (teamAId: string, teamBId: string) => {
    const { data: playersA } = await supabase
      .from('players')
      .select('*')
      .eq('team_id', teamAId);
    
    const { data: playersB } = await supabase
      .from('players')
      .select('*')
      .eq('team_id', teamBId);

    setTeamAPlayers(playersA || []);
    setTeamBPlayers(playersB || []);
  };

  const formatMatchTime = (dateString: string) => {
    const date = new Date(dateString);
    const time = format(date, 'h:mm a');

    if (isToday(date)) {
      return `Today • ${time}`;
    } else if (isTomorrow(date)) {
      return `Tomorrow • ${time}`;
    } else {
      return `${format(date, 'MMM d, yyyy')} • ${time}`;
    }
  };

  const openMatchDetails = (match: Match) => {
    setSelectedMatch(match);
    setIframeUrl(""); // Reset iframe URL, user will paste their link
    setDialogOpen(true);
  };

  const MatchCard = ({ match }: { match: Match }) => {
    const isLive = match.status === 'live';

    return (
      <Card 
        className="p-4 cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-card border border-border"
        onClick={() => openMatchDetails(match)}
      >
        <div className="flex flex-col gap-3">
          {/* Match Number */}
          <div className="text-xs font-medium text-primary">
            Match {match.match_no || 'TBD'}
          </div>

          {/* Teams */}
          <div className="space-y-1">
            <div className="text-sm font-semibold text-foreground">
              {match.team_a?.name || 'TBD'}
            </div>
            <div className="text-xs text-muted-foreground">vs</div>
            <div className="text-sm font-semibold text-foreground">
              {match.team_b?.name || 'TBD'}
            </div>
          </div>

          {/* Time and Status */}
          <div className="flex items-center gap-2 text-xs">
            {isLive ? (
              <div className="flex items-center gap-1.5">
                <span className="text-destructive font-bold">LIVE</span>
                <span className="animate-pulse text-destructive">🔴</span>
              </div>
            ) : (
              <span className="text-muted-foreground">
                {formatMatchTime(match.match_date)}
              </span>
            )}
          </div>
        </div>
      </Card>
    );
  };

  return (
    <section className="container mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-center mb-8 text-foreground">Match Timeline</h2>
      
      {/* Match Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {matches.map((match) => (
          <MatchCard key={match.id} match={match} />
        ))}
      </div>

      {matches.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No matches scheduled yet</p>
        </div>
      )}

      {/* Match Details Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {selectedMatch?.team_a?.name} vs {selectedMatch?.team_b?.name}
            </DialogTitle>
          </DialogHeader>
          
          {selectedMatch && (
            <Tabs defaultValue="squad" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="squad">Squad</TabsTrigger>
                <TabsTrigger value="score">Score</TabsTrigger>
              </TabsList>

              <TabsContent value="squad" className="space-y-6 mt-4">
                {/* Team A Squad */}
                <div>
                  <h3 className="font-bold text-lg mb-3 text-primary">
                    {selectedMatch.team_a?.name}
                  </h3>
                  {teamAPlayers.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {teamAPlayers.map((player) => (
                        <Card key={player.id} className="p-3">
                          <div className="font-medium text-sm">{player.name}</div>
                          {player.role && (
                            <div className="text-xs text-muted-foreground">{player.role}</div>
                          )}
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No players added yet</p>
                  )}
                </div>

                {/* Team B Squad */}
                <div>
                  <h3 className="font-bold text-lg mb-3 text-secondary">
                    {selectedMatch.team_b?.name}
                  </h3>
                  {teamBPlayers.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {teamBPlayers.map((player) => (
                        <Card key={player.id} className="p-3">
                          <div className="font-medium text-sm">{player.name}</div>
                          {player.role && (
                            <div className="text-xs text-muted-foreground">{player.role}</div>
                          )}
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No players added yet</p>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="score" className="mt-4">
                <div className="space-y-4">
                  <div className="bg-muted p-3 rounded-md">
                    <label className="text-sm font-medium mb-2 block">
                      Paste your Criceroes iframe URL below:
                    </label>
                    <input
                      type="text"
                      value={iframeUrl}
                      onChange={(e) => setIframeUrl(e.target.value)}
                      placeholder="https://www.cricheroes.in/..."
                      className="w-full px-3 py-2 rounded-md border border-border bg-background text-sm"
                    />
                  </div>

                  {iframeUrl ? (
                    <div className="w-full h-[500px] border border-border rounded-md overflow-hidden">
                      <iframe
                        src={iframeUrl}
                        className="w-full h-full"
                        frameBorder="0"
                        title="Match Score"
                      />
                    </div>
                  ) : (
                    <div className="text-center py-12 border border-dashed border-border rounded-md">
                      <p className="text-sm text-muted-foreground">
                        Enter a Criceroes URL above to view live scores
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};
