import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { useEffect, useState } from "react";
import { Trophy } from "lucide-react";
import { WinProbabilityBar } from "./WinProbabilityBar";

interface LiveMatchCardProps {
  teamA: string;
  teamB: string;
  teamALogo?: string;
  teamBLogo?: string;
  isLive: boolean;
  teamAScore?: string;
  teamBScore?: string;
  matchPhase?: string;
}

export const LiveMatchCard = ({ 
  teamA, 
  teamB, 
  teamALogo, 
  teamBLogo, 
  isLive,
  teamAScore,
  teamBScore,
  matchPhase
}: LiveMatchCardProps) => {
  const [pulse, setPulse] = useState(true);

  useEffect(() => {
    if (isLive) {
      const interval = setInterval(() => {
        setPulse(prev => !prev);
      }, 1500);
      return () => clearInterval(interval);
    }
  }, [isLive]);

  return (
    <Card className="p-6 bg-gradient-card shadow-card hover:shadow-glow transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
          <Trophy className="text-secondary" size={20} />
          {isLive ? "Match in Progress" : "Next Match"}
        </h3>
        {isLive && (
          <Badge 
            variant="destructive" 
            className={`${pulse ? 'animate-blink' : ''} bg-live text-live-foreground`}
          >
            ● LIVE
          </Badge>
        )}
      </div>

      <div className="flex items-center justify-between gap-4">
        {/* Team A */}
        <div className="flex-1 text-center">
          {teamALogo && (
            <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-muted flex items-center justify-center">
              <img src={teamALogo} alt={teamA} className="w-12 h-12 object-contain" />
            </div>
          )}
          <h4 className="font-bold text-primary">{teamA}</h4>
          {teamAScore && (
            <p className="text-2xl font-bold text-foreground mt-1">{teamAScore}</p>
          )}
        </div>

        {/* VS */}
        <div className="flex flex-col items-center">
          <span className="text-3xl font-bold text-secondary">VS</span>
        </div>

        {/* Team B */}
        <div className="flex-1 text-center">
          {teamBLogo && (
            <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-muted flex items-center justify-center">
              <img src={teamBLogo} alt={teamB} className="w-12 h-12 object-contain" />
            </div>
          )}
          <h4 className="font-bold text-primary">{teamB}</h4>
          {teamBScore && (
            <p className="text-2xl font-bold text-foreground mt-1">{teamBScore}</p>
          )}
        </div>
      </div>

      {/* Win Probability - Only for live matches */}
      {isLive && (
        <WinProbabilityBar
          teamAName={teamA}
          teamBName={teamB}
          teamAScore={teamAScore}
          teamBScore={teamBScore}
          matchPhase={matchPhase}
        />
      )}
    </Card>
  );
};
