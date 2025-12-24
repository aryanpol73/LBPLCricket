import { useState } from "react";
import { Card } from "@/components/ui/card";
import { MatchDetailDialog } from "@/components/MatchDetailDialog";
import { TOTAL_MATCHES, getMatchTimelineClasses, getMatchPhase, getMatchTextColors } from "@/lib/matchUtils";

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
          className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory"
          style={{ 
            scrollbarWidth: 'thin',
            scrollbarColor: '#00C8C8 #0A1325'
          }}
        >
          {Array.from({ length: TOTAL_MATCHES }, (_, index) => {
            const matchNo = index + 1;
            const phase = getMatchPhase(matchNo);
            const colors = getMatchTextColors(matchNo);
            
            return (
              <Card 
                key={matchNo}
                onClick={() => handleMatchClick(matchNo)}
                className={`flex-shrink-0 w-[280px] md:w-[300px] p-4 cursor-pointer transition-all duration-300 hover:scale-105 snap-start border-2 ${getMatchTimelineClasses(matchNo)}`}
              >
                {/* Status Badge */}
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2 py-1 text-xs font-bold rounded bg-black/40 text-white">
                    Upcoming
                  </span>
                  <span className={`text-xs ${colors.subtext}`}>{phase}</span>
                </div>
                
                {/* Match Info */}
                <div className="flex items-center justify-between mb-2">
                  <span className={`font-bold text-sm ${colors.text}`}>Match {matchNo}</span>
                  <span className={`text-xs ${colors.subtext}`}>TBD</span>
                </div>
                
                {/* Team A Placeholder */}
                <p className={`font-semibold text-sm truncate ${colors.text}`}>TBD</p>
                
                {/* VS Divider */}
                <div className="flex items-center gap-2 my-2">
                  <div className="flex-1 h-px bg-white/30"></div>
                  <span className="text-secondary font-bold text-xs">VS</span>
                  <div className="flex-1 h-px bg-white/30"></div>
                </div>
                
                {/* Team B Placeholder */}
                <p className={`font-semibold text-sm truncate ${colors.text}`}>TBD</p>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Match Details Dialog */}
      <MatchDetailDialog
        matchNo={selectedMatch}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />

      {/* Custom scrollbar styles */}
      <style>{`
        #matchTimeline .overflow-x-auto::-webkit-scrollbar {
          height: 8px;
        }
        #matchTimeline .overflow-x-auto::-webkit-scrollbar-track {
          background: #0A1325;
          border-radius: 4px;
        }
        #matchTimeline .overflow-x-auto::-webkit-scrollbar-thumb {
          background: #00C8C8;
          border-radius: 4px;
        }
        #matchTimeline .overflow-x-auto::-webkit-scrollbar-thumb:hover {
          background: #00A5A5;
        }
      `}</style>
    </section>
  );
};
