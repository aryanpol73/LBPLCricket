import { Navigation } from "@/components/Navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Trophy } from "lucide-react";

const Results = () => {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = async () => {
    const { data } = await supabase
      .from('matches')
      .select(`
        *,
        team_a:teams!matches_team_a_id_fkey(*),
        team_b:teams!matches_team_b_id_fkey(*),
        winner:teams!matches_winner_id_fkey(*),
        player_of_match:players(*)
      `)
      .eq('status', 'completed')
      .order('match_date', { ascending: false });

    setResults(data || []);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8 text-center">
          <p>Loading results...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Trophy className="text-secondary" size={32} />
          <h1 className="text-4xl font-bold text-primary">Match Results</h1>
        </div>

        <div className="bg-card rounded-xl shadow-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-primary/5">
                <TableHead className="font-bold">Date</TableHead>
                <TableHead className="font-bold">Teams</TableHead>
                <TableHead className="font-bold">Score</TableHead>
                <TableHead className="font-bold">Winner</TableHead>
                <TableHead className="font-bold">Player of Match</TableHead>
                <TableHead className="font-bold">Phase</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.length > 0 ? (
                results.map((match) => (
                  <TableRow key={match.id} className="hover:bg-muted/50 transition-colors">
                    <TableCell className="text-muted-foreground">
                      {format(new Date(match.match_date), "PP")}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        {match.team_a?.name} vs {match.team_b?.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-mono">
                        {match.team_a_score} - {match.team_b_score}
                      </div>
                    </TableCell>
                    <TableCell>
                      {match.winner ? (
                        <Badge variant="default" className="bg-success">
                          {match.winner.name}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {match.player_of_match ? (
                        <Badge variant="outline" className="border-secondary text-secondary">
                          {match.player_of_match.name}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {match.match_phase?.toUpperCase()}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No completed matches yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Results;
