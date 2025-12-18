import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Users, Trophy } from "lucide-react";

const TOTAL_MATCHES = 33;

export const MatchTimeline = () => {
  const [selectedMatch, setSelectedMatch] = useState<number | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleMatchClick = (matchNo: number) => {
    setSelectedMatch(matchNo);
    setDialogOpen(true);
  };

  return (
    <section id="matchTimeline" className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6 text-center text-primary">Match Timeline</h2>
      
      <div className="relative">
        <div 
          className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory" 
          style={{ touchAction: 'pan-y pan-x' }}
        >
          {Array.from({ length: TOTAL_MATCHES }, (_, index) => {
            const matchNo = index + 1;
            return (
              <Card 
                key={matchNo}
                onClick={() => handleMatchClick(matchNo)}
                className="flex-shrink-0 w-[280px] md:w-[300px] p-4 cursor-pointer transition-all duration-300 hover:scale-105 snap-start bg-gradient-to-br from-[#1a9a8a] to-[#147a6d] border border-[#1a9a8a]/50 hover:shadow-[0_0_20px_rgba(26,154,138,0.4)]"
              >
                {/* Status Badge */}
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2 py-1 text-xs font-bold rounded bg-[#0A1325] text-white">
                    Upcoming
                  </span>
                </div>
                
                {/* Match Info */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[#F9C846] font-bold text-sm">Match {matchNo}</span>
                  <span className="text-white/80 text-xs">TBD</span>
                </div>
                
                {/* Team A Placeholder */}
                <p className="text-white font-semibold text-sm truncate">Team A</p>
                
                {/* VS Divider */}
                <div className="flex items-center gap-2 my-2">
                  <div className="flex-1 h-px bg-white/30"></div>
                  <span className="text-[#F9C846] font-bold text-xs">VS</span>
                  <div className="flex-1 h-px bg-white/30"></div>
                </div>
                
                {/* Team B Placeholder */}
                <p className="text-white font-semibold text-sm truncate">Team B</p>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Match Details Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl bg-gradient-to-br from-[#0F1B35] to-[#0A1325] border-[#F9C846]/30">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[#F9C846]">
              Match {selectedMatch}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Squad Section */}
            <div className="bg-[#0A1325]/50 rounded-lg p-4 border border-[#1a9a8a]/30">
              <div className="flex items-center gap-2 mb-4">
                <Users className="text-[#1a9a8a]" size={20} />
                <h3 className="text-lg font-bold text-white">Squad</h3>
              </div>
              <div className="text-center py-8">
                <p className="text-muted-foreground">Squad details will be available once teams are announced</p>
              </div>
            </div>

            {/* Score Section */}
            <div className="bg-[#0A1325]/50 rounded-lg p-4 border border-[#F9C846]/30">
              <div className="flex items-center gap-2 mb-4">
                <Trophy className="text-[#F9C846]" size={20} />
                <h3 className="text-lg font-bold text-white">Score</h3>
              </div>
              <div className="text-center py-8">
                <p className="text-muted-foreground">Score will be updated during the match</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};
