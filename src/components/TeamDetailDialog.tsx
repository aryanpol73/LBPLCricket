import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Star, Users } from "lucide-react";
import { PlayerProfileDialog } from "./PlayerProfileDialog";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Player {
  id: string;
  name: string;
  role: string;
  age?: number;
  is_key_player: boolean;
}

interface Team {
  id: string;
  name: string;
  logo_url?: string;
  home_city?: string;
  fun_fact?: string;
  players: Player[];
}

interface TeamDetailDialogProps {
  team: Team | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const TeamDetailDialog = ({ team, open, onOpenChange }: TeamDetailDialogProps) => {
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<any | null>(null);
  const [playerDialogOpen, setPlayerDialogOpen] = useState(false);

  if (!team) return null;

  const handlePlayerClick = async (playerId: string) => {
    const { data } = await supabase
      .from('players')
      .select(`
        *,
        teams(name, logo_url)
      `)
      .eq('id', playerId)
      .single();
    
    if (data) {
      setSelectedPlayer(data);
      setPlayerDialogOpen(true);
    }
  };

  // Separate players by role
  const captains = team.players?.filter(p => p.role === 'Captain') || [];
  const viceCaptains = team.players?.filter(p => p.role === 'Vice-Captain') || [];
  const otherPlayers = team.players?.filter(p => !p.role || (p.role !== 'Captain' && p.role !== 'Vice-Captain')) || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto animate-scale-in">
        <DialogHeader>
          <div className="flex items-center gap-4 mb-4 animate-slide-in-left">
            {team.logo_url && (
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center flex-shrink-0 transition-transform duration-500 hover:scale-110 hover:rotate-12">
                <img 
                  src={team.logo_url} 
                  alt={team.name} 
                  className="w-12 h-12 object-contain"
                />
              </div>
            )}
            <div>
              <DialogTitle className="text-2xl text-primary">{team.name}</DialogTitle>
              {team.home_city && (
                <p className="text-sm text-muted-foreground mt-1 animate-fade-in" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
                  📍 {team.home_city}
                </p>
              )}
            </div>
          </div>
        </DialogHeader>

        {team.fun_fact && (
          <div className="mb-4 p-4 bg-secondary/10 rounded-lg animate-fade-in-up" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
            <p className="text-sm text-foreground italic">
              💡 {team.fun_fact}
            </p>
          </div>
        )}

        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-4 animate-slide-in-right" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
            <Users className="text-secondary" size={20} />
            <h3 className="font-bold text-lg text-foreground">Complete Squad</h3>
          </div>

          {/* Captains */}
          {captains.length > 0 && (
            <div className="space-y-2 animate-fade-in-up" style={{ animationDelay: '0.5s', animationFillMode: 'both' }}>
              <h4 className="font-bold text-primary text-sm uppercase tracking-wide">
                {captains.length > 1 ? 'Captains' : 'Captain'}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {captains.map((player, index) => (
                  <div
                    key={player.id}
                    onClick={() => handlePlayerClick(player.id)}
                    className="flex items-center justify-between p-3 bg-yellow-500/10 rounded-lg hover:bg-yellow-500/20 hover:scale-[1.02] transition-all duration-300 animate-fade-in border border-yellow-500/30 cursor-pointer"
                    style={{ animationDelay: `${0.5 + index * 0.05}s`, animationFillMode: 'both' }}
                  >
                    <div className="flex items-center gap-2">
                      <Star className="text-yellow-500 animate-bounce-subtle" size={16} fill="currentColor" />
                      <span className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                        {player.name}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Vice-Captains */}
          {viceCaptains.length > 0 && (
            <div className="space-y-2 animate-fade-in-up" style={{ animationDelay: '0.6s', animationFillMode: 'both' }}>
              <h4 className="font-bold text-primary text-sm uppercase tracking-wide">
                {viceCaptains.length > 1 ? 'Vice-Captains' : 'Vice-Captain'}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {viceCaptains.map((player, index) => (
                  <div
                    key={player.id}
                    onClick={() => handlePlayerClick(player.id)}
                    className="flex items-center justify-between p-3 bg-orange-500/10 rounded-lg hover:bg-orange-500/20 hover:scale-[1.02] transition-all duration-300 animate-fade-in border border-orange-500/30 cursor-pointer"
                    style={{ animationDelay: `${0.6 + index * 0.05}s`, animationFillMode: 'both' }}
                  >
                    <div className="flex items-center gap-2">
                      <Star className="text-orange-500" size={16} fill="currentColor" />
                      <span className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                        {player.name}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Other Players */}
          {otherPlayers.length > 0 && (
            <div className="space-y-2 animate-fade-in-up" style={{ animationDelay: '0.7s', animationFillMode: 'both' }}>
              <h4 className="font-bold text-primary text-sm uppercase tracking-wide">
                Squad Members
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {otherPlayers.map((player, index) => (
                  <div
                    key={player.id}
                    onClick={() => handlePlayerClick(player.id)}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted hover:scale-[1.02] transition-all duration-300 animate-fade-in cursor-pointer"
                    style={{ animationDelay: `${0.7 + index * 0.05}s`, animationFillMode: 'both' }}
                  >
                    <span className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                      {player.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {team.players?.length === 0 && (
            <p className="text-center text-muted-foreground py-8 animate-fade-in">
              Squad to be announced
            </p>
          )}
        </div>
      </DialogContent>

      <PlayerProfileDialog 
        player={selectedPlayer}
        open={playerDialogOpen}
        onOpenChange={setPlayerDialogOpen}
      />
    </Dialog>
  );
};
