import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface WinProbabilityBarProps {
  teamAName: string;
  teamBName: string;
  teamAScore?: string;
  teamBScore?: string;
  matchPhase?: string;
}

interface ProbabilityData {
  team_a_probability: number;
  team_b_probability: number;
  analysis: string;
}

export const WinProbabilityBar = ({
  teamAName,
  teamBName,
  teamAScore,
  teamBScore,
  matchPhase
}: WinProbabilityBarProps) => {
  const [probability, setProbability] = useState<ProbabilityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProbability = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const { data, error: fnError } = await supabase.functions.invoke('estimate-win-probability', {
          body: {
            team_a_name: teamAName,
            team_b_name: teamBName,
            team_a_score: teamAScore,
            team_b_score: teamBScore,
            match_phase: matchPhase
          }
        });

        if (fnError) throw fnError;
        if (data.error) throw new Error(data.error);
        
        setProbability(data);
      } catch (err) {
        console.error("Win probability error:", err);
        setError("Unable to estimate");
        // Set fallback
        setProbability({ team_a_probability: 50, team_b_probability: 50, analysis: "" });
      } finally {
        setLoading(false);
      }
    };

    fetchProbability();
    
    // Refresh every 30 seconds for live updates
    const interval = setInterval(fetchProbability, 30000);
    return () => clearInterval(interval);
  }, [teamAName, teamBName, teamAScore, teamBScore, matchPhase]);

  if (loading) {
    return (
      <div className="mt-4 flex items-center justify-center gap-2 text-muted-foreground text-sm">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>Analyzing match...</span>
      </div>
    );
  }

  if (!probability) return null;

  const teamAProb = probability.team_a_probability;
  const teamBProb = probability.team_b_probability;

  return (
    <div className="mt-4 space-y-2">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Win Probability</span>
        <span className="text-secondary">AI Estimated</span>
      </div>
      
      {/* Probability Bar */}
      <div className="relative h-6 rounded-full overflow-hidden bg-muted border border-border">
        {/* Team A */}
        <div 
          className="absolute left-0 top-0 h-full bg-gradient-to-r from-primary to-primary/70 transition-all duration-500"
          style={{ width: `${teamAProb}%` }}
        >
          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-bold text-primary-foreground">
            {teamAProb}%
          </span>
        </div>
        
        {/* Team B */}
        <div 
          className="absolute right-0 top-0 h-full bg-gradient-to-l from-secondary to-secondary/70 transition-all duration-500"
          style={{ width: `${teamBProb}%` }}
        >
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold text-secondary-foreground">
            {teamBProb}%
          </span>
        </div>
      </div>

      {/* Team Labels */}
      <div className="flex justify-between text-xs">
        <span className="text-primary font-medium truncate max-w-[40%]">{teamAName}</span>
        <span className="text-secondary font-medium truncate max-w-[40%] text-right">{teamBName}</span>
      </div>

      {/* Analysis */}
      {probability.analysis && (
        <p className="text-xs text-muted-foreground text-center italic">
          {probability.analysis}
        </p>
      )}
    </div>
  );
};
