import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Users, Star } from "lucide-react";
import { TeamDetailDialog } from "@/components/TeamDetailDialog";

const Teams = () => {
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTeam, setSelectedTeam] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    loadTeams();
  }, []);

  const loadTeams = async () => {
    const { data } = await supabase
      .from('teams')
      .select(`
        *,
        players(*)
      `)
      .order('name');

    setTeams(data || []);
    setLoading(false);
  };

  const handleTeamClick = (team: any) => {
    setSelectedTeam(team);
    setDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8 text-center">
          <p>Loading teams...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Users className="text-secondary" size={32} />
          <h1 className="text-4xl font-bold text-primary">All Teams</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team) => (
            <Card 
              key={team.id} 
              className="p-6 bg-gradient-team-card shadow-card hover:shadow-glow transition-all duration-300 hover:-translate-y-1 cursor-pointer border-primary-glow/30"
              onClick={() => handleTeamClick(team)}
            >
              <div className="flex items-start gap-4 mb-4">
                {team.logo_url && (
                  <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                    <img 
                      src={team.logo_url} 
                      alt={team.name} 
                      className="w-12 h-12 object-contain"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-1">
                    {team.name}
                  </h3>
                  {team.home_city && (
                    <p className="text-sm text-white/80">
                      📍 {team.home_city}
                    </p>
                  )}
                </div>
              </div>

              {team.fun_fact && (
                <div className="mb-4 p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                  <p className="text-sm text-white/90 italic">
                    💡 {team.fun_fact}
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="text-secondary" size={16} />
                  <h4 className="font-bold text-sm text-white">Key Players</h4>
                </div>
                
                {team.players && team.players.length > 0 ? (
                  <div className="space-y-1">
                    {team.players
                      .filter((p: any) => p.is_key_player)
                      .slice(0, 5)
                      .map((player: any) => (
                        <div key={player.id} className="flex items-center justify-between">
                          <span className="text-sm text-white/90">{player.name}</span>
                          {player.role && (
                            <Badge variant="outline" className="text-xs bg-white/10 text-white border-white/30">
                              {player.role}
                            </Badge>
                          )}
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-sm text-white/70">Squad to be announced</p>
                )}
              </div>
            </Card>
          ))}
        </div>

        {teams.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No teams available yet</p>
          </div>
        )}
      </div>

      <TeamDetailDialog
        team={selectedTeam}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
};

export default Teams;
