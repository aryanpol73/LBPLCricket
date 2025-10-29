import { useEffect, useState } from "react";
import { Card } from "./ui/card";
import { supabase } from "@/integrations/supabase/client";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

interface Match {
  id: string;
  team_a: { name: string; logo_url?: string };
  team_b: { name: string; logo_url?: string };
  team_a_score?: string;
  team_b_score?: string;
  match_date: string;
  venue?: string;
  status: string;
  winner_id?: string;
}

export const MatchTimeline = () => {
  const [previousMatch, setPreviousMatch] = useState<Match | null>(null);
  const [currentMatch, setCurrentMatch] = useState<Match | null>(null);
  const [nextMatch, setNextMatch] = useState<Match | null>(null);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    // Get current/live match
    const { data: live } = await supabase
      .from('matches')
      .select(`
        *,
        team_a:teams!matches_team_a_id_fkey(*),
        team_b:teams!matches_team_b_id_fkey(*)
      `)
      .eq('status', 'live')
      .order('match_date', { ascending: true })
      .limit(1)
      .maybeSingle();

    // If no live match, get upcoming
    const { data: upcoming } = await supabase
      .from('matches')
      .select(`
        *,
        team_a:teams!matches_team_a_id_fkey(*),
        team_b:teams!matches_team_b_id_fkey(*)
      `)
      .eq('status', 'upcoming')
      .order('match_date', { ascending: true })
      .limit(1)
      .maybeSingle();

    const current = live || upcoming;
    setCurrentMatch(current as any);

    // Get previous match
    const { data: previous } = await supabase
      .from('matches')
      .select(`
        *,
        team_a:teams!matches_team_a_id_fkey(*),
        team_b:teams!matches_team_b_id_fkey(*)
      `)
      .eq('status', 'completed')
      .order('match_date', { ascending: false })
      .limit(1)
      .maybeSingle();

    setPreviousMatch(previous as any);

    // Get next match (after current)
    if (current) {
      const { data: next } = await supabase
        .from('matches')
        .select(`
          *,
          team_a:teams!matches_team_a_id_fkey(*),
          team_b:teams!matches_team_b_id_fkey(*)
        `)
        .eq('status', 'upcoming')
        .gt('match_date', current.match_date)
        .order('match_date', { ascending: true })
        .limit(1)
        .maybeSingle();

      setNextMatch(next as any);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const openMatchDetails = (match: Match) => {
    setSelectedMatch(match);
    setDialogOpen(true);
  };

  const MatchCard = ({ match, type }: { match: Match; type: 'previous' | 'current' | 'next' }) => {
    const isFaded = type !== 'current';
    const isLive = match.status === 'live';

    return (
      <Card 
        className={`p-4 cursor-pointer transition-all duration-300 ${
          isFaded 
            ? 'opacity-50 hover:opacity-75 bg-muted' 
            : 'bg-gradient-card shadow-glow hover:scale-105'
        }`}
        onClick={() => openMatchDetails(match)}
      >
        {isLive && (
          <div className="flex items-center gap-2 justify-center mb-3">
            <span className="animate-pulse text-destructive">🔴</span>
            <span className="text-xs font-bold text-destructive">LIVE NOW</span>
          </div>
        )}
        
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-1">
            {match.team_a.logo_url && (
              <img src={match.team_a.logo_url} alt={match.team_a.name} className="w-8 h-8 object-contain" />
            )}
            <div className="text-left">
              <p className={`font-bold ${isFaded ? 'text-muted-foreground' : 'text-foreground'}`}>
                {match.team_a.name}
              </p>
              {match.team_a_score && (
                <p className={`text-lg font-bold ${isFaded ? 'text-muted-foreground' : 'text-primary'}`}>
                  {match.team_a_score}
                </p>
              )}
            </div>
          </div>

          <div className="text-center px-2">
            <p className={`text-xs font-medium ${isFaded ? 'text-muted-foreground' : 'text-foreground'}`}>
              vs
            </p>
          </div>

          <div className="flex items-center gap-2 flex-1 justify-end">
            <div className="text-right">
              <p className={`font-bold ${isFaded ? 'text-muted-foreground' : 'text-foreground'}`}>
                {match.team_b.name}
              </p>
              {match.team_b_score && (
                <p className={`text-lg font-bold ${isFaded ? 'text-muted-foreground' : 'text-primary'}`}>
                  {match.team_b_score}
                </p>
              )}
            </div>
            {match.team_b.logo_url && (
              <img src={match.team_b.logo_url} alt={match.team_b.name} className="w-8 h-8 object-contain" />
            )}
          </div>
        </div>

        <div className="mt-3 text-center">
          <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
            <Clock size={12} />
            <span>{formatDate(match.match_date)}</span>
          </div>
          {match.venue && (
            <p className="text-xs text-muted-foreground mt-1">{match.venue}</p>
          )}
        </div>
      </Card>
    );
  };

  return (
    <>
      <div className="container mx-auto px-4 mb-12">
        <h2 className="text-3xl font-bold text-center text-primary mb-6">Match Timeline</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 justify-center mb-2">
              <ChevronLeft className="text-muted-foreground" size={20} />
              <h3 className="text-sm font-bold text-muted-foreground">Previous Match</h3>
            </div>
            {previousMatch ? (
              <MatchCard match={previousMatch} type="previous" />
            ) : (
              <Card className="p-4 bg-muted opacity-50">
                <p className="text-center text-muted-foreground text-sm">No previous match</p>
              </Card>
            )}
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-bold text-primary text-center mb-2">Current Match</h3>
            {currentMatch ? (
              <MatchCard match={currentMatch} type="current" />
            ) : (
              <Card className="p-4 bg-muted">
                <p className="text-center text-muted-foreground text-sm">No ongoing match</p>
              </Card>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 justify-center mb-2">
              <h3 className="text-sm font-bold text-muted-foreground">Next Match</h3>
              <ChevronRight className="text-muted-foreground" size={20} />
            </div>
            {nextMatch ? (
              <MatchCard match={nextMatch} type="next" />
            ) : (
              <Card className="p-4 bg-muted opacity-50">
                <p className="text-center text-muted-foreground text-sm">No upcoming match</p>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Match Details Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Match Details</DialogTitle>
          </DialogHeader>
          {selectedMatch && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {selectedMatch.team_a.logo_url && (
                    <img src={selectedMatch.team_a.logo_url} alt={selectedMatch.team_a.name} className="w-12 h-12 object-contain" />
                  )}
                  <div>
                    <p className="font-bold text-foreground">{selectedMatch.team_a.name}</p>
                    <p className="text-2xl font-bold text-primary">{selectedMatch.team_a_score || "-"}</p>
                  </div>
                </div>
                
                <div className="text-center px-4">
                  <p className="text-sm font-bold text-muted-foreground">vs</p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="font-bold text-foreground">{selectedMatch.team_b.name}</p>
                    <p className="text-2xl font-bold text-primary">{selectedMatch.team_b_score || "-"}</p>
                  </div>
                  {selectedMatch.team_b.logo_url && (
                    <img src={selectedMatch.team_b.logo_url} alt={selectedMatch.team_b.name} className="w-12 h-12 object-contain" />
                  )}
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Date:</span>
                  <span className="text-sm font-medium">{formatDate(selectedMatch.match_date)}</span>
                </div>
                {selectedMatch.venue && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Venue:</span>
                    <span className="text-sm font-medium">{selectedMatch.venue}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Status:</span>
                  <span className="text-sm font-medium capitalize">{selectedMatch.status}</span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
