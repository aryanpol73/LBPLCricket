import { Navigation } from "@/components/Navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Trophy, Award } from "lucide-react";

const PointsTable = () => {
  const [standings, setStandings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStandings();
  }, []);

  const loadStandings = async () => {
    const { data } = await supabase
      .from('points_table')
      .select(`
        *,
        team:teams(*)
      `)
      .order('points', { ascending: false })
      .order('net_run_rate', { ascending: false });

    setStandings(data || []);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8 text-center">
          <p>Loading standings...</p>
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
          <h1 className="text-4xl font-bold text-primary">Points Table</h1>
        </div>

        <div className="bg-card rounded-xl shadow-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gradient-hero">
                <TableHead className="font-bold text-white">Rank</TableHead>
                <TableHead className="font-bold text-white">Team</TableHead>
                <TableHead className="font-bold text-white text-center">Played</TableHead>
                <TableHead className="font-bold text-white text-center">Won</TableHead>
                <TableHead className="font-bold text-white text-center">Lost</TableHead>
                <TableHead className="font-bold text-white text-center">NRR</TableHead>
                <TableHead className="font-bold text-white text-center">Points</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {standings.length > 0 ? (
                standings.map((row, index) => (
                  <TableRow 
                    key={row.id} 
                    className={`
                      hover:bg-muted/50 transition-colors
                      ${index < 4 ? 'bg-success/5' : ''}
                    `}
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-lg">{index + 1}</span>
                        {index === 0 && <Award className="text-secondary" size={16} />}
                        {index < 4 && <Badge variant="outline" className="text-xs">Q</Badge>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-bold text-foreground">
                        {row.team?.name}
                      </div>
                    </TableCell>
                    <TableCell className="text-center font-medium">
                      {row.matches_played}
                    </TableCell>
                    <TableCell className="text-center font-medium text-success">
                      {row.wins}
                    </TableCell>
                    <TableCell className="text-center font-medium text-destructive">
                      {row.losses}
                    </TableCell>
                    <TableCell className="text-center font-mono">
                      {row.net_run_rate.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className="bg-primary font-bold">
                        {row.points}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No data available yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong>Note:</strong> Teams highlighted in green qualify for the next stage. 
            Top 4 teams proceed to semi-finals.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PointsTable;
