import { useEffect, useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface PointsEntry {
  team_name: string | null;
  group_name: string | null;
  matches_played: number | null;
  wins: number | null;
  losses: number | null;
  points: number | null;
  net_run_rate: number | null;
}

export const LeaderboardSnapshot = () => {
  const navigate = useNavigate();
  const [groupedData, setGroupedData] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPointsData();
  }, []);

  const loadPointsData = async () => {
    const { data } = await supabase
      .from('points_table')
      .select('team_name, group_name, matches_played, wins, losses, points, net_run_rate')
      .eq('round', 1);
    
    if (data) {
      // Group by group_name
      const grouped = data.reduce((acc, entry) => {
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
      }, {} as Record<string, any[]>);

      // Sort each group by wins (desc), matches_played (desc), then NRR (desc)
      const result: Record<string, any[]> = {};
      Object.keys(grouped).sort().forEach(groupName => {
        grouped[groupName].sort((a: any, b: any) => {
          if (b.w !== a.w) return b.w - a.w;
          if (b.p !== a.p) return b.p - a.p;
          return b.nrr - a.nrr;
        });
        result[groupName] = grouped[groupName].map((team: any, index: number) => ({
          rank: index + 1,
          name: team.name,
          p: team.p,
          w: team.w,
          l: team.l,
          nrr: team.nrr.toFixed(2),
          pts: team.pts,
        }));
      });
      setGroupedData(result);
    }
    setLoading(false);
  };

  // Show only first 2 groups (A and B) as preview
  const previewGroups = Object.entries(groupedData).slice(0, 2);

  const GroupTable = ({ groupName, teams }: { groupName: string; teams: any[] }) => (
    <Card className="bg-gradient-to-br from-[#0F1B35] to-[#0A1325] border-primary/50 overflow-hidden">
      <div className="bg-gradient-to-r from-primary to-primary/80 px-4 py-2">
        <h3 className="text-sm font-bold text-white">{groupName}</h3>
      </div>
      
      <div className="grid grid-cols-8 gap-1 px-3 py-1.5 text-[10px] text-gray-400 border-b border-primary/20">
        <div>#</div>
        <div className="col-span-2">Team</div>
        <div className="text-center">P</div>
        <div className="text-center">W</div>
        <div className="text-center">L</div>
        <div className="text-center">NRR</div>
        <div className="text-center">Pts</div>
      </div>
      
      {teams.map((team, index) => (
        <div 
          key={index}
          className="grid grid-cols-8 gap-1 px-3 py-2 text-xs border-b border-primary/10 last:border-b-0 hover:bg-primary/10 transition-colors"
        >
          <div className="text-white font-semibold">{team.rank}</div>
          <div className="col-span-2 text-white font-medium truncate" title={team.name}>{team.name}</div>
          <div className="text-center text-white">{team.p}</div>
          <div className="text-center text-green-400 font-semibold">{team.w}</div>
          <div className="text-center text-red-400 font-semibold">{team.l}</div>
          <div className="text-center text-white text-[10px]">{team.nrr}</div>
          <div className="text-center">
            <span className="inline-flex items-center justify-center w-5 h-5 bg-primary text-white text-[10px] font-bold rounded-full">
              {team.pts}
            </span>
          </div>
        </div>
      ))}
    </Card>
  );

  if (loading) {
    return (
      <div className="container mx-auto px-4 mb-12">
        <Card className="p-6 bg-gradient-card shadow-card">
          <div className="text-center py-8">
            <div className="text-muted-foreground">Loading standings...</div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 mb-12">
      <Card className="p-6 bg-gradient-card shadow-card">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Trophy className="text-secondary" size={24} />
            <h2 className="text-2xl font-bold text-foreground">Points Table</h2>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/points-table')}
          >
            View Full Table
          </Button>
        </div>

        {previewGroups.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {previewGroups.map(([groupName, teams]) => (
              <GroupTable key={groupName} groupName={groupName} teams={teams} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Trophy className="mx-auto mb-4 text-secondary" size={48} />
            <p className="text-muted-foreground">
              Rankings will be available once the tournament starts
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};
