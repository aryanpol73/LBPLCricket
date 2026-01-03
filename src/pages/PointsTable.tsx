import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface PointsEntry {
  id: string;
  team_id: string;
  team_name: string | null;
  group_name: string | null;
  round: number | null;
  matches_played: number | null;
  wins: number | null;
  losses: number | null;
  points: number | null;
  net_run_rate: number | null;
}

const PointsTable = () => {
  const [cricherosUrl, setCricherosUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [pointsData, setPointsData] = useState<PointsEntry[]>([]);

  useEffect(() => {
    loadSettings();
    loadPointsData();
  }, []);

  const loadSettings = async () => {
    const { data } = await supabase
      .from('tournament_settings')
      .select('setting_value')
      .eq('setting_key', 'cricheroes_points_table_url')
      .maybeSingle();
    
    if (data?.setting_value) {
      setCricherosUrl(data.setting_value);
    }
    setLoading(false);
  };

  const loadPointsData = async () => {
    const { data } = await supabase
      .from('points_table')
      .select('*')
      .eq('round', 1)
      .order('group_name')
      .order('wins', { ascending: false })
      .order('net_run_rate', { ascending: false });
    
    if (data) {
      setPointsData(data);
    }
  };

  // Group points data by group_name, then sort by wins and NRR within each group
  const groupedData = (() => {
    const grouped = pointsData.reduce((acc, entry) => {
      const groupName = `Group ${entry.group_name || 'A'}`;
      if (!acc[groupName]) {
        acc[groupName] = [];
      }
      acc[groupName].push({
        name: entry.team_name || 'TBD',
        p: entry.matches_played || 0,
        w: entry.wins || 0,
        l: entry.losses || 0,
        nrr: entry.net_run_rate || 0,
        pts: entry.points || 0,
      });
      return acc;
    }, {} as Record<string, { name: string; p: number; w: number; l: number; nrr: number; pts: number }[]>);

    // Sort each group by wins (desc), then NRR (desc), and assign ranks
    const result: Record<string, { rank: number; name: string; p: number; w: number; l: number; nrr: string; pts: number }[]> = {};
    Object.keys(grouped).forEach(groupName => {
      grouped[groupName].sort((a, b) => {
        if (b.w !== a.w) return b.w - a.w; // Sort by wins first
        return b.nrr - a.nrr; // Then by NRR
      });
      // Assign ranks after sorting
      result[groupName] = grouped[groupName].map((team, index) => ({
        rank: index + 1,
        name: team.name,
        p: team.p,
        w: team.w,
        l: team.l,
        nrr: team.nrr.toFixed(2),
        pts: team.pts,
      }));
    });
    return result;
  })();

  // Round 2: 12 teams in 4 groups
  const round2Groups = {
    'Group A': [
      { rank: 1, name: 'TBD', p: 0, w: 0, l: 0, nrr: '0.00', pts: 0 },
      { rank: 2, name: 'TBD', p: 0, w: 0, l: 0, nrr: '0.00', pts: 0 },
      { rank: 3, name: 'TBD', p: 0, w: 0, l: 0, nrr: '0.00', pts: 0 },
    ],
    'Group B': [
      { rank: 1, name: 'TBD', p: 0, w: 0, l: 0, nrr: '0.00', pts: 0 },
      { rank: 2, name: 'TBD', p: 0, w: 0, l: 0, nrr: '0.00', pts: 0 },
      { rank: 3, name: 'TBD', p: 0, w: 0, l: 0, nrr: '0.00', pts: 0 },
    ],
    'Group C': [
      { rank: 1, name: 'TBD', p: 0, w: 0, l: 0, nrr: '0.00', pts: 0 },
      { rank: 2, name: 'TBD', p: 0, w: 0, l: 0, nrr: '0.00', pts: 0 },
      { rank: 3, name: 'TBD', p: 0, w: 0, l: 0, nrr: '0.00', pts: 0 },
    ],
    'Group D': [
      { rank: 1, name: 'TBD', p: 0, w: 0, l: 0, nrr: '0.00', pts: 0 },
      { rank: 2, name: 'TBD', p: 0, w: 0, l: 0, nrr: '0.00', pts: 0 },
      { rank: 3, name: 'TBD', p: 0, w: 0, l: 0, nrr: '0.00', pts: 0 },
    ],
  };

  // Better table design with Pts column
  const GroupTableV2 = ({ groupName, teams }: { groupName: string; teams: any[] }) => (
    <Card className="bg-gradient-to-br from-[#0F1B35] to-[#0A1325] border-primary/50 overflow-hidden">
      {/* Group Header */}
      <div className="bg-gradient-to-r from-primary to-primary/80 px-4 py-3">
        <h3 className="text-lg font-bold text-white">{groupName}</h3>
      </div>
      
      {/* Table Header */}
      <div className="grid grid-cols-8 gap-1 px-4 py-2 text-xs text-gray-400 border-b border-primary/20">
        <div>Rank</div>
        <div className="col-span-2">Team</div>
        <div className="text-center">P</div>
        <div className="text-center">W</div>
        <div className="text-center">L</div>
        <div className="text-center">NRR</div>
        <div className="text-center">Pts</div>
      </div>
      
      {/* Table Body */}
      {teams.map((team, index) => (
        <div 
          key={index}
          className="grid grid-cols-8 gap-1 px-4 py-3 text-sm border-b border-primary/10 last:border-b-0 hover:bg-primary/10 transition-colors"
        >
          <div className="text-white font-semibold">{team.rank}</div>
          <div className="col-span-2 text-white font-medium truncate">{team.name}</div>
          <div className="text-center text-white">{team.p}</div>
          <div className="text-center text-green-400 font-semibold">{team.w}</div>
          <div className="text-center text-red-400 font-semibold">{team.l}</div>
          <div className="text-center text-white">{team.nrr}</div>
          <div className="text-center">
            <span className="inline-flex items-center justify-center w-7 h-7 bg-primary text-white text-xs font-bold rounded-full">
              {team.pts}
            </span>
          </div>
        </div>
      ))}
    </Card>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
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

        {cricherosUrl ? (
          <Tabs defaultValue="live" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-6 animate-fade-in-up" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
              <TabsTrigger value="live" className="flex items-center gap-2">
                <ExternalLink className="w-4 h-4" />
                Live Table
              </TabsTrigger>
              <TabsTrigger value="info">Tournament Info</TabsTrigger>
            </TabsList>

            <TabsContent value="live" className="space-y-6">
              <div className="w-full h-[70vh] rounded-lg overflow-hidden border border-border">
                <iframe
                  src={cricherosUrl}
                  className="w-full h-full border-0"
                  title="CricHeroes Points Table"
                  allow="fullscreen"
                />
              </div>
            </TabsContent>

            <TabsContent value="info">
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="p-6 bg-card border border-border animate-fade-in-up" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
                  <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                    <Trophy className="text-secondary" size={24} />
                    Round 1 Format
                  </h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• 18 teams divided into 6 groups</li>
                    <li>• 3 teams per group</li>
                    <li>• Top 2 teams from each group advance</li>
                    <li>• 12 teams qualify for Round 2</li>
                  </ul>
                </Card>

                <Card className="p-6 bg-card border border-border animate-fade-in-up" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
                  <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                    <Trophy className="text-secondary" size={24} />
                    Round 2 Format
                  </h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• 12 qualified teams from Round 1</li>
                    <li>• Divided into 4 groups</li>
                    <li>• 3 teams per group</li>
                    <li>• Top team from each group advances to Semi-Finals</li>
                  </ul>
                </Card>

                <Card className="p-6 bg-card border border-border md:col-span-2 animate-fade-in-up" style={{ animationDelay: '0.5s', animationFillMode: 'both' }}>
                  <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                    <Trophy className="text-secondary" size={24} />
                    Points System
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-muted/20 rounded-lg">
                      <div className="text-3xl font-bold text-secondary">2</div>
                      <div className="text-sm text-muted-foreground">Points for Win</div>
                    </div>
                    <div className="text-center p-4 bg-muted/20 rounded-lg">
                      <div className="text-3xl font-bold text-secondary">1</div>
                      <div className="text-sm text-muted-foreground">Points for Tie</div>
                    </div>
                    <div className="text-center p-4 bg-muted/20 rounded-lg">
                      <div className="text-3xl font-bold text-secondary">0</div>
                      <div className="text-sm text-muted-foreground">Points for Loss</div>
                    </div>
                    <div className="text-center p-4 bg-muted/20 rounded-lg">
                      <div className="text-3xl font-bold text-secondary">NRR</div>
                      <div className="text-sm text-muted-foreground">Tiebreaker</div>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <Tabs defaultValue="round1" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-6 animate-fade-in-up" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
              <TabsTrigger value="round1">Round 1</TabsTrigger>
              <TabsTrigger value="round2">Round 2</TabsTrigger>
            </TabsList>

            <TabsContent value="round1" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(groupedData).sort().map(([groupName, teams]) => (
                  <GroupTableV2 key={groupName} groupName={groupName} teams={teams} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="round2" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(round2Groups).map(([groupName, teams]) => (
                  <GroupTableV2 key={groupName} groupName={groupName} teams={teams} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default PointsTable;