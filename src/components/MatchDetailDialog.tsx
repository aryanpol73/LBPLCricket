import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  const [activeTab, setActiveTab] = useState("squad");
  
  if (!matchNo) return null;

  const time = getMatchTime(matchNo);
  const day = matchNo <= 18 ? "Jan 3" : "Jan 4";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-[#0F1B35] to-[#0A1325] border-border/50">
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-2xl font-bold text-white">
            Match {matchNo} - {teamA} vs {teamB}
          </DialogTitle>
          <p className="text-muted-foreground text-sm">
            {day} • {time} • 4 Lions, Ravet
          </p>
        </DialogHeader>

        {/* Tabs for Squad and Score */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-4">
          <TabsList className="grid w-full grid-cols-2 bg-[#1a2744]">
            <TabsTrigger 
              value="squad"
              className="data-[state=active]:bg-[#2a3f5f] data-[state=active]:text-white"
            >
              Squad
            </TabsTrigger>
            <TabsTrigger 
              value="score"
              className="data-[state=active]:bg-[#2a3f5f] data-[state=active]:text-white"
            >
              Score
            </TabsTrigger>
          </TabsList>

          {/* Squad Tab Content */}
          <TabsContent value="squad" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Team A Squad */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white">{teamA}</h3>
                
                {/* Captain */}
                <div>
                  <p className="text-xs font-semibold text-secondary uppercase tracking-wider mb-2">Captain</p>
                  <div className="bg-gradient-to-r from-[#3d3520] to-[#2a2515] rounded-lg p-3 flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                    <span className="text-white font-medium">--</span>
                  </div>
                </div>

                {/* Vice-Captain */}
                <div>
                  <p className="text-xs font-semibold text-orange-500 uppercase tracking-wider mb-2">Vice-Captain</p>
                  <div className="bg-gradient-to-r from-[#3d3520] to-[#2a2515] rounded-lg p-3 flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                    <span className="text-white font-medium">--</span>
                  </div>
                </div>

                {/* Squad Members */}
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Squad Members</p>
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="bg-[#1a2744] rounded-lg p-3 border border-border/30">
                        <span className="text-white/80">--</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Team B Squad */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white">{teamB}</h3>
                
                {/* Captain */}
                <div>
                  <p className="text-xs font-semibold text-secondary uppercase tracking-wider mb-2">Captain</p>
                  <div className="bg-gradient-to-r from-[#3d3520] to-[#2a2515] rounded-lg p-3 flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                    <span className="text-white font-medium">--</span>
                  </div>
                </div>

                {/* Vice-Captain */}
                <div>
                  <p className="text-xs font-semibold text-orange-500 uppercase tracking-wider mb-2">Vice-Captain</p>
                  <div className="bg-gradient-to-r from-[#3d3520] to-[#2a2515] rounded-lg p-3 flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                    <span className="text-white font-medium">--</span>
                  </div>
                </div>

                {/* Squad Members */}
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Squad Members</p>
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="bg-[#1a2744] rounded-lg p-3 border border-border/30">
                        <span className="text-white/80">--</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Score Tab Content */}
          <TabsContent value="score" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Team A Score */}
              <div className="bg-[#1a2744] rounded-lg p-6 border border-border/30">
                <h3 className="text-xl font-bold text-white mb-4">{teamA}</h3>
                <div className="text-center py-8">
                  <p className="text-4xl font-bold text-secondary">--</p>
                  <p className="text-muted-foreground text-sm mt-2">Score will be updated</p>
                </div>
              </div>

              {/* Team B Score */}
              <div className="bg-[#1a2744] rounded-lg p-6 border border-border/30">
                <h3 className="text-xl font-bold text-white mb-4">{teamB}</h3>
                <div className="text-center py-8">
                  <p className="text-4xl font-bold text-secondary">--</p>
                  <p className="text-muted-foreground text-sm mt-2">Score will be updated</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
