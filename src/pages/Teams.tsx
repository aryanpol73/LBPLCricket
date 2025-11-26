import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Users, Search, User } from "lucide-react";
import { TeamDetailDialog } from "@/components/TeamDetailDialog";
import { PlayerProfileDialog } from "@/components/PlayerProfileDialog";

const Teams = () => {
  const [teams, setTeams] = useState<any[]>([]);
  const [players, setPlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTeam, setSelectedTeam] = useState<any>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [playerDialogOpen, setPlayerDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadTeams();
    loadPlayers();
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

  const loadPlayers = async () => {
    const { data } = await supabase
      .from('players')
      .select(`
        *,
        teams(name, logo_url)
      `)
      .order('name');

    setPlayers(data || []);
  };

  const handleTeamClick = (team: any) => {
    setSelectedTeam(team);
    setDialogOpen(true);
  };

  const handlePlayerClick = (player: any) => {
    setSelectedPlayer(player);
    setPlayerDialogOpen(true);
  };

  // Filter teams based on search query
  const filteredTeams = teams.filter(team => 
    team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    team.home_city?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter players based on search query
  const filteredPlayers = searchQuery.trim() 
    ? players.filter(player =>
        player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        player.role?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

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

        {/* Search Bar */}
        <div className="mb-8 max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
            <Input
              type="text"
              placeholder="Search teams or players..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-lg border-2 border-primary/30 focus:border-secondary transition-colors"
            />
          </div>
        </div>

        {/* Player Search Results */}
        {filteredPlayers.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <User className="text-secondary" size={24} />
              <h2 className="text-2xl font-bold text-primary">Players Found ({filteredPlayers.length})</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredPlayers.slice(0, 8).map((player, index) => (
                <Card
                  key={player.id}
                  className="p-4 bg-gradient-to-br from-[#2E73FF]/10 to-transparent border-2 border-[#F9C846]/30 shadow-card hover:shadow-glow transition-all duration-300 hover:-translate-y-1 cursor-pointer animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.05}s`, animationFillMode: 'both' }}
                  onClick={() => handlePlayerClick(player)}
                >
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-[#2E73FF]/20 border-2 border-[#F9C846]/50 flex items-center justify-center">
                      <User className="text-[#F9C846]" size={32} />
                    </div>
                    <h3 className="font-bold text-white mb-1">{player.name}</h3>
                    <Badge variant="outline" className="text-xs border-[#F9C846]/50 text-[#F9C846] mb-2">
                      {player.role || 'Player'}
                    </Badge>
                    {player.teams && (
                      <p className="text-xs text-muted-foreground">
                        {player.teams.name}
                      </p>
                    )}
                  </div>
                </Card>
              ))}
            </div>
            {filteredPlayers.length > 8 && (
              <p className="text-center text-muted-foreground mt-4">
                Showing top 8 results. Refine your search for more specific results.
              </p>
            )}
          </div>
        )}

        {/* Teams Grid */}
        <div>
          {filteredPlayers.length > 0 && (
            <div className="flex items-center gap-2 mb-6">
              <Users className="text-secondary" size={24} />
              <h2 className="text-2xl font-bold text-primary">Teams ({filteredTeams.length})</h2>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTeams.map((team, index) => (
            <Card 
              key={team.id} 
              className="p-6 bg-gradient-team-card shadow-card hover:shadow-glow transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] cursor-pointer border-2 border-primary/20 animate-fade-in-up bg-blue-500/5"
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

              <div className="mt-4 pt-4 border-t border-border/50">
                <p className="text-sm text-muted-foreground text-center">
                  Click to view complete squad
                </p>
              </div>
            </Card>
            ))}
          </div>

          {filteredTeams.length === 0 && searchQuery && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No teams found matching "{searchQuery}"</p>
            </div>
          )}

          {teams.length === 0 && !searchQuery && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No teams available yet</p>
            </div>
          )}
        </div>
      </div>

      <TeamDetailDialog
        team={selectedTeam}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />

      <PlayerProfileDialog
        player={selectedPlayer}
        open={playerDialogOpen}
        onOpenChange={setPlayerDialogOpen}
      />
    </div>
  );
};

export default Teams;
