import { useEffect, useState } from "react";
import { Card } from "./ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { format, isToday, isTomorrow } from "date-fns";

// Team name mapping from T1-T18 to actual names
const TEAM_MAPPING: Record<string, string> = {
  "T1": "Akot Avengers",
  "T2": "Puneri Paltan",
  "T3": "Damdar Dongaon",
  "T4": "Jagadamb Sakharkherda",
  "T5": "Nagpur Tigers",
  "T6": "Shree Balaji Mehkar",
  "T7": "Wardha Reloaded 3.0",
  "T8": "Dhamakedar Mumbai",
  "T9": "Buldhana Blasters",
  "T10": "Ajeya Akola",
  "T11": "Nagpur Gladiators",
  "T12": "Puneri Katta",
  "T13": "Aflatoon Akola",
  "T14": "DeulgaonRaja Warriors",
  "T15": "Sharangdhar Mehkar",
  "T16": "Shandaar Chikhali",
  "T17": "Malkapur Risers",
  "T18": "Dhurandhar SambhajiNagar",
};

// Round color mapping
const ROUND_COLORS: Record<string, string> = {
  "1": "#1E3A8A", // Dark Blue
  "2": "#8E24AA", // Purple
  "3": "#FB8C00", // Orange - Semi Finals
  "4": "#F9A825", // Gold - Final
};

// Time ranges for matches
const MATCH_TIMES: Record<number, string> = {
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

interface Match {
  id: string;
  match_no?: number;
  team_a: { name: string; logo_url?: string; id: string; short_name?: string };
  team_b: { name: string; logo_url?: string; id: string; short_name?: string };
  team_a_score?: string;
  team_b_score?: string;
  team_a_id: string;
  team_b_id: string;
  match_date: string;
  venue?: string;
  status: string;
  winner_id?: string;
  round_no?: number;
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
    
    // Set up realtime subscription for match updates
    const channel = supabase
      .channel('match-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'matches'
        },
        () => {
          loadMatches();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    if (selectedMatch && selectedMatch.team_a_id !== selectedMatch.team_b_id) {
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
      .in('status', ['live', 'upcoming'])
      .order('match_no', { ascending: true });

    setMatches((data as any) || []);
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

  // Get team name with TBD logic
  const getTeamName = (team: any, match: Match) => {
    if (!team) return "TBD";
    
    // Check if this is a Round 2+ match that hasn't been determined yet
    const roundNo = getRoundNumber(match);
    if (roundNo !== "1" && match.team_a_id === match.team_b_id) {
      return "TBD";
    }
    
    const mappedName = TEAM_MAPPING[team.short_name || team.name];
    return mappedName || team.name || "TBD";
  };

  // Get round number from match_no
  const getRoundNumber = (match: Match) => {
    const matchNo = match.match_no || 0;
    if (matchNo >= 1 && matchNo <= 18) return "1";
    if (matchNo >= 19 && matchNo <= 30) return "2";
    if (matchNo >= 31 && matchNo <= 32) return "3";
    if (matchNo === 33) return "4";
    return "1";
  };

  const formatMatchTime = (match: Match) => {
    const matchNo = match.match_no || 0;
    const timeRange = MATCH_TIMES[matchNo] || "TBD";
    const date = new Date(match.match_date);

    if (isToday(date)) {
      return `Today • ${timeRange}`;
    } else if (isTomorrow(date)) {
      return `Tomorrow • ${timeRange}`;
    } else {
      return `${format(date, 'MMM d')} • ${timeRange}`;
    }
  };

  const openMatchDetails = (match: Match) => {
    setSelectedMatch(match);
    setIframeUrl("");
    setDialogOpen(true);
  };

  const MatchCard = ({ match }: { match: Match }) => {
    const isLive = match.status?.toLowerCase() === 'live';
    const roundNo = getRoundNumber(match);
    const roundColor = ROUND_COLORS[roundNo] || ROUND_COLORS["1"];
    const teamAName = getTeamName(match.team_a, match);
    const teamBName = getTeamName(match.team_b, match);
    
    // Get status text
    const getStatusText = () => {
      const matchNo = match.match_no || 0;
      if (matchNo >= 31 && matchNo <= 32) return 'Semi Final';
      if (matchNo === 33) return 'Grand Final';
      if (isLive) return 'Live Now';
      return 'Upcoming';
    };

    return (
      <Card 
        onClick={() => openMatchDetails(match)} 
        className={`
          flex-shrink-0 w-72 cursor-pointer transition-all duration-300 overflow-hidden
          ${isLive 
            ? 'border-2 border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.4)] animate-pulse-slow' 
            : 'hover:shadow-xl hover:-translate-y-1 border-border'
          }
        `}
        style={{ borderTopColor: roundColor, borderTopWidth: '4px' }}
      >
        <div className="p-4">
          {/* Live Badge or Status */}
          {isLive ? (
            <div className="flex items-center gap-2 mb-3">
              <div className="relative">
                <span className="flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
              </div>
              <span className="text-red-500 font-bold text-sm">LIVE NOW</span>
            </div>
          ) : (
            <div className="mb-3">
              <span className="text-xs font-semibold px-2 py-1 rounded" style={{ backgroundColor: `${roundColor}20`, color: roundColor }}>
                {getStatusText()}
              </span>
            </div>
          )}

          {/* Match Number & Time */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-primary">
              Match {match.match_no}
            </span>
            <span className="text-xs text-muted-foreground">
              {formatMatchTime(match)}
            </span>
          </div>

          {/* Teams */}
          <div className="space-y-3">
            {/* Team A */}
            <div className="flex items-center gap-3">
              {match.team_a?.logo_url && teamAName !== "TBD" && (
                <img 
                  src={match.team_a.logo_url} 
                  alt={teamAName}
                  className="w-8 h-8 rounded-full object-cover"
                />
              )}
              <div className="flex-1">
                <p className="font-semibold text-sm">{teamAName}</p>
                {match.team_a_score && (
                  <p className="text-xs text-muted-foreground">{match.team_a_score}</p>
                )}
              </div>
            </div>

            {/* VS Divider */}
            <div className="flex items-center gap-2">
              <div className="h-px flex-1 bg-border"></div>
              <span className="text-xs font-bold text-muted-foreground px-2">VS</span>
              <div className="h-px flex-1 bg-border"></div>
            </div>

            {/* Team B */}
            <div className="flex items-center gap-3">
              {match.team_b?.logo_url && teamBName !== "TBD" && (
                <img 
                  src={match.team_b.logo_url} 
                  alt={teamBName}
                  className="w-8 h-8 rounded-full object-cover"
                />
              )}
              <div className="flex-1">
                <p className="font-semibold text-sm">{teamBName}</p>
                {match.team_b_score && (
                  <p className="text-xs text-muted-foreground">{match.team_b_score}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <section className="container mx-auto px-4 mb-12">
      <h2 className="text-3xl font-bold mb-6 text-center">Match Timeline</h2>
      
      {/* Horizontal Scrollable Timeline */}
      <div className="relative">
        <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory" style={{ scrollbarWidth: 'thin' }}>
          {matches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      </div>

      {/* Match Details Dialog */}
      {selectedMatch && (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                Match {selectedMatch.match_no} - {getTeamName(selectedMatch.team_a, selectedMatch)} vs {getTeamName(selectedMatch.team_b, selectedMatch)}
              </DialogTitle>
              <DialogDescription>
                {formatMatchTime(selectedMatch)} • {selectedMatch.venue || 'Venue TBD'}
              </DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="squad" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="squad">Squad</TabsTrigger>
                <TabsTrigger value="score">Score</TabsTrigger>
              </TabsList>

              <TabsContent value="squad" className="mt-4">
                {getTeamName(selectedMatch.team_a, selectedMatch) === "TBD" ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Teams will be determined based on previous round results</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Team A Squad */}
                    <div>
                      <h3 className="font-bold text-lg mb-3">{getTeamName(selectedMatch.team_a, selectedMatch)}</h3>
                      {teamAPlayers.length > 0 ? (
                        <div className="space-y-2">
                          {teamAPlayers.map((player) => (
                            <div key={player.id} className="p-3 bg-muted rounded-lg">
                              <p className="font-semibold">{player.name}</p>
                              <p className="text-sm text-muted-foreground">{player.role || 'Player'}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground">No squad information available</p>
                      )}
                    </div>

                    {/* Team B Squad */}
                    <div>
                      <h3 className="font-bold text-lg mb-3">{getTeamName(selectedMatch.team_b, selectedMatch)}</h3>
                      {teamBPlayers.length > 0 ? (
                        <div className="space-y-2">
                          {teamBPlayers.map((player) => (
                            <div key={player.id} className="p-3 bg-muted rounded-lg">
                              <p className="font-semibold">{player.name}</p>
                              <p className="text-sm text-muted-foreground">{player.role || 'Player'}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground">No squad information available</p>
                      )}
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="score" className="mt-4">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Paste Score iframe URL
                    </label>
                    <input
                      type="text"
                      value={iframeUrl}
                      onChange={(e) => setIframeUrl(e.target.value)}
                      placeholder="Enter iframe URL here..."
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  {iframeUrl && (
                    <div className="border rounded-lg overflow-hidden" style={{ height: '500px' }}>
                      <iframe
                        src={iframeUrl}
                        className="w-full h-full"
                        title="Match Score"
                        frameBorder="0"
                        allowFullScreen
                      />
                    </div>
                  )}
                  {!iframeUrl && (
                    <div className="text-center py-12 text-muted-foreground">
                      <p>Enter an iframe URL above to view live scores</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}
    </section>
  );
};
