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
        <div className="flex items-center gap-3 mb-8 animate-slide-in-left">
          <Users className="text-secondary" size={32} />
          <h1 className="text-4xl font-bold text-primary">All Teams</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team, index) => (
            <Card 
              key={team.id} 
              className="p-6 bg-gradient-team-card shadow-card hover:shadow-glow transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] cursor-pointer border-2 border-primary/20 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'both' }}
              onClick={() => handleTeamClick(team)}
            >
              <div className="flex items-start gap-4 mb-4">
                {team.logo_url && (
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 transition-transform duration-300 hover:scale-110 hover:rotate-6">
                    <img 
                      src={team.logo_url} 
                      alt={team.name} 
                      className="w-12 h-12 object-contain"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-primary mb-1">
                    {team.name}
                  </h3>
                  {team.home_city && (
                    <p className="text-sm text-muted-foreground">
                      📍 {team.home_city}
                    </p>
                  )}
                </div>
              </div>

              {team.fun_fact && (
                <div className="mb-4 p-3 bg-secondary/10 rounded-lg transition-all duration-300 hover:bg-secondary/20">
                  <p className="text-sm text-foreground italic">
                    💡 {team.fun_fact}
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="text-secondary animate-bounce-subtle" size={16} />
                  <h4 className="font-bold text-sm text-primary">Key Players</h4>
                </div>
                
                {team.players && team.players.length > 0 ? (
                  <div className="space-y-1">
                    {team.players
                      .filter((p: any) => p.is_key_player)
                      .slice(0, 5)
                      .map((player: any) => (
                        <div key={player.id} className="flex items-center justify-between transition-all duration-200 hover:translate-x-1">
                          <span className="text-sm text-foreground">{player.name}</span>
                          {player.role && (
                            <Badge variant="outline" className="text-xs border-primary/30 transition-colors duration-200 hover:border-primary hover:bg-primary/5">
                              {player.role}
                            </Badge>
                          )}
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Squad to be announced</p>
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
