import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { PlayerProfileDialog } from "./PlayerProfileDialog";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

interface BattingEntry {
  player_name: string;
  player_id?: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  strike_rate: number;
  dismissal: string;
}

interface BowlingEntry {
  player_name: string;
  player_id?: string;
  overs: string;
  maidens: number;
  runs: number;
  wickets: number;
  economy: number;
}

interface ScorecardData {
  match_no: number;
  team_a_name: string;
  team_a_runs: number;
  team_a_wickets: number;
  team_a_overs: string;
  team_a_extras?: string;
  team_b_name: string;
  team_b_runs: number;
  team_b_wickets: number;
  team_b_overs: string;
  team_b_extras?: string;
  winner_name: string;
  result_text: string;
  toss_text?: string;
  team_a_batting: BattingEntry[];
  team_a_bowling: BowlingEntry[];
  team_b_batting: BattingEntry[];
  team_b_bowling: BowlingEntry[];
}

interface ScorecardViewProps {
  scorecard: ScorecardData;
}

export const ScorecardView = ({ scorecard }: ScorecardViewProps) => {
  const [expandedTeam, setExpandedTeam] = useState<'a' | 'b' | null>('a');
  const [selectedPlayer, setSelectedPlayer] = useState<any | null>(null);
  const [playerDialogOpen, setPlayerDialogOpen] = useState(false);

  const handlePlayerClick = async (playerName: string, playerId?: string) => {
    let playerData = null;
    
    if (playerId) {
      const { data } = await supabase
        .from('players')
        .select(`*, teams(name, logo_url)`)
        .eq('id', playerId)
        .maybeSingle();
      playerData = data;
    } else {
      // Search by name if no ID
      const { data } = await supabase
        .from('players')
        .select(`*, teams(name, logo_url)`)
        .ilike('name', `%${playerName}%`)
        .maybeSingle();
      playerData = data;
    }
    
    if (playerData) {
      setSelectedPlayer(playerData);
      setPlayerDialogOpen(true);
    }
  };

  const TeamHeader = ({ 
    teamName, 
    runs, 
    wickets, 
    overs, 
    isExpanded, 
    onToggle,
    isWinner
  }: { 
    teamName: string; 
    runs: number; 
    wickets: number; 
    overs: string; 
    isExpanded: boolean;
    onToggle: () => void;
    isWinner: boolean;
  }) => (
    <button
      onClick={onToggle}
      className={cn(
        "w-full flex items-center justify-between p-4 rounded-lg transition-all",
        "bg-gradient-to-r from-[#1a2744] to-[#0F1B35] border",
        isWinner ? "border-[#F9C846]/50" : "border-border/30",
        "hover:border-[#F9C846]/70"
      )}
    >
      <div className="flex items-center gap-3">
        {isWinner && (
          <span className="text-[#F9C846] text-xs font-semibold px-2 py-0.5 bg-[#F9C846]/10 rounded">
            WINNER
          </span>
        )}
        <span className="font-bold text-white text-lg">{teamName}</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-2xl font-bold text-white">
          {runs}/{wickets}
          <span className="text-sm text-muted-foreground ml-1">({overs} Ov)</span>
        </span>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-5 w-5 text-muted-foreground" />
        )}
      </div>
    </button>
  );

  const BattingTable = ({ batting, extras }: { batting: BattingEntry[]; extras?: string }) => (
    <div className="mt-3 space-y-2">
      <h4 className="text-sm font-semibold text-[#F9C846] uppercase tracking-wide">Batting</h4>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-muted-foreground text-xs border-b border-border/30">
              <th className="text-left py-2 px-2">Batter</th>
              <th className="text-center py-2 px-1">R</th>
              <th className="text-center py-2 px-1">B</th>
              <th className="text-center py-2 px-1">4s</th>
              <th className="text-center py-2 px-1">6s</th>
              <th className="text-center py-2 px-1">SR</th>
            </tr>
          </thead>
          <tbody>
            {batting.map((batter, idx) => (
              <tr key={idx} className="border-b border-border/20 hover:bg-[#1a2744]/50">
                <td className="py-2 px-2">
                  <button
                    onClick={() => handlePlayerClick(batter.player_name, batter.player_id)}
                    className="text-left hover:text-[#F9C846] transition-colors"
                  >
                    <span className="font-medium text-white">{batter.player_name}</span>
                    <p className="text-xs text-muted-foreground truncate max-w-[180px]">
                      {batter.dismissal}
                    </p>
                  </button>
                </td>
                <td className="text-center py-2 px-1 font-semibold text-white">{batter.runs}</td>
                <td className="text-center py-2 px-1 text-muted-foreground">{batter.balls}</td>
                <td className="text-center py-2 px-1 text-muted-foreground">{batter.fours}</td>
                <td className="text-center py-2 px-1 text-muted-foreground">{batter.sixes}</td>
                <td className="text-center py-2 px-1 text-muted-foreground">{batter.strike_rate.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {extras && (
        <div className="text-xs text-muted-foreground mt-2 px-2">
          <span className="font-medium">Extras:</span> {extras}
        </div>
      )}
    </div>
  );

  const BowlingTable = ({ bowling }: { bowling: BowlingEntry[] }) => (
    <div className="mt-4 space-y-2">
      <h4 className="text-sm font-semibold text-[#2E73FF] uppercase tracking-wide">Bowling</h4>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-muted-foreground text-xs border-b border-border/30">
              <th className="text-left py-2 px-2">Bowler</th>
              <th className="text-center py-2 px-1">O</th>
              <th className="text-center py-2 px-1">M</th>
              <th className="text-center py-2 px-1">R</th>
              <th className="text-center py-2 px-1">W</th>
              <th className="text-center py-2 px-1">Eco</th>
            </tr>
          </thead>
          <tbody>
            {bowling.map((bowler, idx) => (
              <tr key={idx} className="border-b border-border/20 hover:bg-[#1a2744]/50">
                <td className="py-2 px-2">
                  <button
                    onClick={() => handlePlayerClick(bowler.player_name, bowler.player_id)}
                    className="text-left font-medium text-white hover:text-[#2E73FF] transition-colors"
                  >
                    {bowler.player_name}
                  </button>
                </td>
                <td className="text-center py-2 px-1 text-muted-foreground">{bowler.overs}</td>
                <td className="text-center py-2 px-1 text-muted-foreground">{bowler.maidens}</td>
                <td className="text-center py-2 px-1 text-muted-foreground">{bowler.runs}</td>
                <td className="text-center py-2 px-1 font-semibold text-white">{bowler.wickets}</td>
                <td className="text-center py-2 px-1 text-muted-foreground">{bowler.economy.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Result Banner */}
      <div className="bg-gradient-to-r from-[#F9C846]/20 to-[#F9C846]/5 border border-[#F9C846]/30 rounded-lg p-3 text-center">
        <p className="text-[#F9C846] font-semibold">{scorecard.result_text}</p>
        {scorecard.toss_text && (
          <p className="text-xs text-muted-foreground mt-1">{scorecard.toss_text}</p>
        )}
      </div>

      {/* Team A */}
      <div>
        <TeamHeader
          teamName={scorecard.team_a_name}
          runs={scorecard.team_a_runs}
          wickets={scorecard.team_a_wickets}
          overs={scorecard.team_a_overs}
          isExpanded={expandedTeam === 'a'}
          onToggle={() => setExpandedTeam(expandedTeam === 'a' ? null : 'a')}
          isWinner={scorecard.winner_name === scorecard.team_a_name}
        />
        {expandedTeam === 'a' && (
          <div className="bg-[#0F1B35]/80 border border-t-0 border-border/30 rounded-b-lg p-4 -mt-1">
            <BattingTable batting={scorecard.team_a_batting} extras={scorecard.team_a_extras} />
            <BowlingTable bowling={scorecard.team_b_bowling} />
          </div>
        )}
      </div>

      {/* Team B */}
      <div>
        <TeamHeader
          teamName={scorecard.team_b_name}
          runs={scorecard.team_b_runs}
          wickets={scorecard.team_b_wickets}
          overs={scorecard.team_b_overs}
          isExpanded={expandedTeam === 'b'}
          onToggle={() => setExpandedTeam(expandedTeam === 'b' ? null : 'b')}
          isWinner={scorecard.winner_name === scorecard.team_b_name}
        />
        {expandedTeam === 'b' && (
          <div className="bg-[#0F1B35]/80 border border-t-0 border-border/30 rounded-b-lg p-4 -mt-1">
            <BattingTable batting={scorecard.team_b_batting} extras={scorecard.team_b_extras} />
            <BowlingTable bowling={scorecard.team_a_bowling} />
          </div>
        )}
      </div>

      <PlayerProfileDialog
        player={selectedPlayer}
        open={playerDialogOpen}
        onOpenChange={setPlayerDialogOpen}
      />
    </div>
  );
};
