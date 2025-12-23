import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Users, Trophy } from "lucide-react";
import { getMatchPhase, getMatchTime } from "@/lib/matchUtils";

interface MatchDetailDialogProps {
  matchNo: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teamA?: string;
  teamB?: string;
}

export const MatchDetailDialog = ({
  matchNo,
  open,
  onOpenChange,
  teamA = "TBD",
  teamB = "TBD",
}: MatchDetailDialogProps) => {
  if (!matchNo) return null;

  const phase = getMatchPhase(matchNo);
  const time = getMatchTime(matchNo);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl bg-gradient-to-br from-[#0F1B35] to-[#0A1325] border-primary/30">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-primary">
            Match {matchNo} - {phase}
          </DialogTitle>
          <p className="text-muted-foreground text-sm">{time}</p>
        </DialogHeader>

        {/* Teams Header */}
        <div className="flex items-center justify-center gap-4 py-4">
          <span className="text-xl font-bold text-white">{teamA}</span>
          <span className="text-secondary font-bold">VS</span>
          <span className="text-xl font-bold text-white">{teamB}</span>
        </div>

        {/* Side by Side: Squad and Score */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Squad Section */}
          <div className="bg-[#0A1325]/50 rounded-lg p-4 border border-primary/30">
            <div className="flex items-center gap-2 mb-4">
              <Users className="text-primary" size={20} />
              <h3 className="text-lg font-bold text-white">Squad</h3>
            </div>
            
            <div className="space-y-4">
              {/* Team A Squad */}
              <div>
                <h4 className="text-sm font-semibold text-primary mb-2">{teamA}</h4>
                <div className="text-center py-4 bg-background/20 rounded-lg">
                  <p className="text-muted-foreground text-sm">Squad will be announced</p>
                </div>
              </div>
              
              {/* Team B Squad */}
              <div>
                <h4 className="text-sm font-semibold text-primary mb-2">{teamB}</h4>
                <div className="text-center py-4 bg-background/20 rounded-lg">
                  <p className="text-muted-foreground text-sm">Squad will be announced</p>
                </div>
              </div>
            </div>
          </div>

          {/* Score Section */}
          <div className="bg-[#0A1325]/50 rounded-lg p-4 border border-secondary/30">
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="text-secondary" size={20} />
              <h3 className="text-lg font-bold text-white">Score</h3>
            </div>
            
            <div className="space-y-4">
              {/* Team A Score */}
              <div className="flex items-center justify-between p-3 bg-background/20 rounded-lg">
                <span className="font-semibold text-white">{teamA}</span>
                <span className="text-2xl font-bold text-secondary">--</span>
              </div>
              
              {/* Team B Score */}
              <div className="flex items-center justify-between p-3 bg-background/20 rounded-lg">
                <span className="font-semibold text-white">{teamB}</span>
                <span className="text-2xl font-bold text-secondary">--</span>
              </div>
              
              {/* Match Status */}
              <div className="text-center py-4">
                <p className="text-muted-foreground text-sm">Score will be updated during the match</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
