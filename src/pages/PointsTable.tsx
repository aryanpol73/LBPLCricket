
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Trophy, Award } from "lucide-react";

const PointsTable = () => {
  const [round1Standings, setRound1Standings] = useState<any[]>([]);
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
      .eq('round', 1)
      .order('group_name', { ascending: true })
      .order('points', { ascending: false })
      .order('net_run_rate', { ascending: false });

    setRound1Standings(data || []);
    setLoading(false);
  };

  const groups = ['A', 'B', 'C', 'D', 'E', 'F'];
  
  const getGroupStandings = (groupName: string) => {
    return round1Standings.filter(row => row.group_name === groupName);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 text-center">
          <p>Loading standings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8 animate-slide-in-left">
          <Trophy className="text-secondary" size={32} />
          <h1 className="text-4xl font-bold text-primary">Points Table - Season 3</h1>
        </div>

        <Tabs defaultValue="round1" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-6 animate-fade-in-up" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
            <TabsTrigger value="round1">Round 1</TabsTrigger>
            <TabsTrigger value="round2">Round 2</TabsTrigger>
          </TabsList>

          <TabsContent value="round1" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {groups.map((group, groupIndex) => {
                const groupStandings = getGroupStandings(group);
                return (
                  <div 
                    key={group} 
                    className="bg-card rounded-xl shadow-card overflow-hidden animate-fade-in-up"
                    style={{ animationDelay: `${0.3 + groupIndex * 0.1}s`, animationFillMode: 'both' }}
                  >
                    <div className="bg-gradient-hero p-4">
                      <h2 className="text-xl font-bold text-white">Group {group}</h2>
                    </div>
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead className="font-bold">Rank</TableHead>
                          <TableHead className="font-bold">Team</TableHead>
                          <TableHead className="font-bold text-center">P</TableHead>
                          <TableHead className="font-bold text-center">W</TableHead>
                          <TableHead className="font-bold text-center">L</TableHead>
                          <TableHead className="font-bold text-center">NRR</TableHead>
                          <TableHead className="font-bold text-center">Pts</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {groupStandings.length > 0 ? (
                          groupStandings.map((row, index) => (
                            <TableRow 
                              key={row.id} 
                              className={`
                                hover:bg-muted/50 transition-all duration-300 animate-fade-in-up
                                ${index < 2 ? 'bg-success/5' : ''}
                              `}
                              style={{ animationDelay: `${0.4 + groupIndex * 0.1 + index * 0.05}s`, animationFillMode: 'both' }}
                            >
                              <TableCell>
                                <span className="font-bold animate-count-up" style={{ animationDelay: `${0.5 + groupIndex * 0.1 + index * 0.05}s` }}>{index + 1}</span>
                              </TableCell>
                              <TableCell>
                                <div className="font-bold text-foreground text-sm">
                                  {row.team?.name}
                                </div>
                              </TableCell>
                              <TableCell className="text-center font-medium text-sm">
                                {row.matches_played}
                              </TableCell>
                              <TableCell className="text-center font-medium text-success text-sm">
                                {row.wins}
                              </TableCell>
                              <TableCell className="text-center font-medium text-destructive text-sm">
                                {row.losses}
                              </TableCell>
                              <TableCell className="text-center font-mono text-sm">
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
                            <TableCell colSpan={7} className="text-center py-8 text-muted-foreground text-sm">
                              No teams yet
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                );
              })}
            </div>

            <div className="p-4 bg-muted/50 rounded-lg animate-fade-in" style={{ animationDelay: '1s', animationFillMode: 'both' }}>
              <p className="text-sm text-muted-foreground">
                <strong>Round 1 Format:</strong> 18 teams divided into 6 groups. Top 2 teams from each group (12 teams total) advance to Round 2.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="round2">
            <div className="text-center py-12 animate-fade-in-up">
              <Trophy className="text-secondary mx-auto mb-4" size={48} />
              <h2 className="text-2xl font-bold text-primary mb-2">Round 2 Coming Soon</h2>
              <p className="text-muted-foreground">
                Round 2 will feature the top 12 teams from Round 1, divided into 4 groups. 
                Top team from each group advances to Semi-Finals.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PointsTable;
