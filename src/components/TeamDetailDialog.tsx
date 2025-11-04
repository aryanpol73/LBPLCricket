import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Star, Users } from "lucide-react";

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
  if (!team) return null;

  // Group players by role
  const playersByRole: Record<string, Player[]> = {};
  team.players?.forEach((player) => {
    const role = player.role || "Other";
    if (!playersByRole[role]) {
      playersByRole[role] = [];
    }
    playersByRole[role].push(player);
  });

  // Role order for display
  const roleOrder = ["Captain", "Batsman", "Bowler", "All-Rounder", "Wicket-Keeper", "Other"];

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

          {roleOrder.map((role, roleIndex) => {
            const players = playersByRole[role];
            if (!players || players.length === 0) return null;

            return (
              <div key={role} className="space-y-2 animate-fade-in-up" style={{ animationDelay: `${0.5 + roleIndex * 0.1}s`, animationFillMode: 'both' }}>
                <h4 className="font-bold text-primary text-sm uppercase tracking-wide">
                  {role}
                  {role === "All-Rounder" && "s"}
                  {role === "Batsman" && "s"}
                  {role === "Bowler" && "s"}
                  {role === "Wicket-Keeper" && "s"}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {players.map((player, playerIndex) => (
                    <div
                      key={player.id}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted hover:scale-[1.02] transition-all duration-300 animate-fade-in"
                      style={{ animationDelay: `${0.5 + roleIndex * 0.1 + playerIndex * 0.05}s`, animationFillMode: 'both' }}
                    >
                      <div className="flex items-center gap-2">
                        {player.is_key_player && (
                          <Star className="text-secondary animate-bounce-subtle" size={16} fill="currentColor" />
                        )}
                        <span className="text-sm font-medium text-foreground">
                          {player.name}
                        </span>
                      </div>
                      {player.age && (
                        <Badge variant="outline" className="text-xs transition-all duration-200 hover:scale-110">
                          {player.age}y
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {team.players?.length === 0 && (
            <p className="text-center text-muted-foreground py-8 animate-fade-in">
              Squad to be announced
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
