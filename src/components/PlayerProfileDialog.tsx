import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Trophy, Target, Activity } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface PlayerProfile {
  id: string;
  name: string;
  role: string;
  team_id: string;
  age?: number;
  matches_played: number;
  runs_scored: number;
  wickets_taken: number;
  batting_average: number;
  strike_rate: number;
  bowling_average: number;
  economy_rate: number;
  catches: number;
  stumpings: number;
  teams: {
    name: string;
    logo_url: string;
  };
}

interface PlayerProfileDialogProps {
  player: PlayerProfile | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PlayerProfileDialog = ({ player, open, onOpenChange }: PlayerProfileDialogProps) => {
  if (!player) {
    return null;
  }

  const StatItem = ({ label, value }: { label: string; value: string | number }) => (
    <div className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-background/80 to-background/50 rounded-xl border border-border/50 hover:border-primary/50 transition-all duration-300 hover:scale-105 hover:shadow-lg">
      <div className="text-2xl font-bold text-primary mb-1">{value}</div>
      <div className="text-xs text-muted-foreground text-center">{label}</div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader className="space-y-0">
          {/* Player Header Section */}
          <div className="flex items-start gap-6 pb-6 border-b border-border/50">
            {/* Player Photo Placeholder */}
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center flex-shrink-0 shadow-lg">
              <User className="w-12 h-12 text-primary" />
            </div>

            {/* Player Info */}
            <div className="flex-1 space-y-3">
              <div>
                <DialogTitle className="text-3xl font-bold text-foreground mb-2">
                  {player.name}
                </DialogTitle>
                <div className="flex items-center gap-3 flex-wrap">
                  {player.teams?.logo_url && (
                    <img 
                      src={player.teams.logo_url} 
                      alt={player.teams.name}
                      className="w-6 h-6 object-contain"
                    />
                  )}
                  <span className="text-sm text-muted-foreground font-medium">
                    {player.teams?.name}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-2 flex-wrap">
                {player.role && (
                  <Badge 
                    variant="outline" 
                    className="text-sm px-3 py-1 bg-primary/10 border-primary/30 text-primary font-semibold"
                  >
                    {player.role}
                  </Badge>
                )}
                {player.name === "Aryan Pol" && (
                  <Badge 
                    className="text-sm px-3 py-1 bg-gradient-to-r from-yellow-500 to-amber-600 border-0 text-white font-semibold"
                  >
                    Owner
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </DialogHeader>

        {/* Stats Sections */}
        <div className="space-y-6 mt-6">
          {/* Batting Stats */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Trophy className="text-secondary w-5 h-5" />
              <h3 className="text-lg font-bold text-foreground">Batting Stats</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <StatItem label="Matches" value={player.matches_played || 0} />
              <StatItem label="Runs" value={player.runs_scored || 0} />
              <StatItem label="Average" value={player.batting_average?.toFixed(2) || '0.00'} />
              <StatItem label="Strike Rate" value={player.strike_rate?.toFixed(2) || '0.00'} />
            </div>
          </div>

          {/* Bowling Stats */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Target className="text-secondary w-5 h-5" />
              <h3 className="text-lg font-bold text-foreground">Bowling Stats</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <StatItem label="Wickets" value={player.wickets_taken || 0} />
              <StatItem label="Average" value={player.bowling_average?.toFixed(2) || '0.00'} />
              <StatItem label="Economy" value={player.economy_rate?.toFixed(2) || '0.00'} />
              <StatItem label="Overs" value={player.matches_played ? (player.matches_played * 4).toFixed(0) : 0} />
            </div>
          </div>

          {/* Fielding Stats */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Activity className="text-secondary w-5 h-5" />
              <h3 className="text-lg font-bold text-foreground">Fielding Stats</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <StatItem label="Catches" value={player.catches || 0} />
              <StatItem label="Stumpings" value={player.stumpings || 0} />
              <StatItem label="Total" value={(player.catches || 0) + (player.stumpings || 0)} />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
