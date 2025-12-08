
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Trophy, Crown, Award, Star } from "lucide-react";
import { Navigation } from "@/components/Navigation";

// Dummy results for preview
const dummyResults = [
  // League Phase matches
  { id: 'dr1', round_no: 1, match_no: 1, team_a: { name: 'Thunder Kings' }, team_b: { name: 'Royal Strikers' }, team_a_score: '156/4', team_b_score: '142/8', winner: { name: 'Thunder Kings' }, player_of_match: { name: 'Rahul Sharma' }, match_phase: 'league1' },
  { id: 'dr2', round_no: 1, match_no: 2, team_a: { name: 'Storm Warriors' }, team_b: { name: 'Phoenix Rising' }, team_a_score: '178/6', team_b_score: '180/3', winner: { name: 'Phoenix Rising' }, player_of_match: { name: 'Amit Kumar' }, match_phase: 'league1' },
  { id: 'dr3', round_no: 1, match_no: 3, team_a: { name: 'Golden Eagles' }, team_b: { name: 'Silver Sharks' }, team_a_score: '165/5', team_b_score: '160/7', winner: { name: 'Golden Eagles' }, player_of_match: { name: 'Vikas Patel' }, match_phase: 'league1' },
  { id: 'dr4', round_no: 1, match_no: 4, team_a: { name: 'Fire Dragons' }, team_b: { name: 'Ice Titans' }, team_a_score: '145/8', team_b_score: '148/5', winner: { name: 'Ice Titans' }, player_of_match: { name: 'Raj Malhotra' }, match_phase: 'league1' },
  { id: 'dr5', round_no: 1, match_no: 5, team_a: { name: 'Night Hawks' }, team_b: { name: 'Sun Chasers' }, team_a_score: '189/4', team_b_score: '172/9', winner: { name: 'Night Hawks' }, player_of_match: { name: 'Arjun Singh' }, match_phase: 'league1' },
  { id: 'dr6', round_no: 1, match_no: 6, team_a: { name: 'Lightning Bolts' }, team_b: { name: 'Wave Riders' }, team_a_score: '134/10', team_b_score: '138/4', winner: { name: 'Wave Riders' }, player_of_match: { name: 'Karan Verma' }, match_phase: 'league1' },
  // Knockouts
  { id: 'dr7', round_no: 2, match_no: 7, team_a: { name: 'Thunder Kings' }, team_b: { name: 'Ice Titans' }, team_a_score: '167/5', team_b_score: '158/8', winner: { name: 'Thunder Kings' }, player_of_match: { name: 'Rahul Sharma' }, match_phase: 'knockouts' },
  { id: 'dr8', round_no: 2, match_no: 8, team_a: { name: 'Phoenix Rising' }, team_b: { name: 'Night Hawks' }, team_a_score: '175/3', team_b_score: '171/6', winner: { name: 'Phoenix Rising' }, player_of_match: { name: 'Sunil Yadav' }, match_phase: 'knockouts' },
  // Semi-Finals
  { id: 'dr9', round_no: 3, match_no: 9, team_a: { name: 'Thunder Kings' }, team_b: { name: 'Golden Eagles' }, team_a_score: '182/4', team_b_score: '176/7', winner: { name: 'Thunder Kings' }, player_of_match: { name: 'Vikas Patel' }, match_phase: 'semi-finals' },
  { id: 'dr10', round_no: 3, match_no: 10, team_a: { name: 'Phoenix Rising' }, team_b: { name: 'Wave Riders' }, team_a_score: '195/2', team_b_score: '168/9', winner: { name: 'Phoenix Rising' }, player_of_match: { name: 'Amit Kumar' }, match_phase: 'semi-finals' },
  // Grand Final
  { id: 'dr11', round_no: 4, match_no: 11, team_a: { name: 'Thunder Kings' }, team_b: { name: 'Phoenix Rising' }, team_a_score: '198/5', team_b_score: '194/6', winner: { name: 'Thunder Kings' }, player_of_match: { name: 'Rahul Sharma' }, match_phase: 'grand final' },
];

const Results = () => {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = async () => {
    const { data } = await supabase
      .from('matches')
      .select(`
        *,
        team_a:teams!matches_team_a_id_fkey(*),
        team_b:teams!matches_team_b_id_fkey(*),
        winner:teams!matches_winner_id_fkey(*),
        player_of_match:players(*)
      `)
      .eq('status', 'completed')
      .order('match_no', { ascending: true });

    setResults(data || []);
    setLoading(false);
  };

  const displayResults = results.length > 0 ? results : dummyResults;
  const isPreview = results.length === 0;

  const groupedByPhase = displayResults.reduce((acc, match) => {
    const phase = match.match_phase || 'league1';
    if (!acc[phase]) {
      acc[phase] = [];
    }
    acc[phase].push(match);
    return acc;
  }, {} as Record<string, any[]>);

  const phaseOrder = ['league1', 'knockouts', 'semi-finals', 'grand final'];
  const phaseLabels: Record<string, string> = {
    'league1': 'League Phase',
    'knockouts': 'Knockouts',
    'semi-finals': 'Semi-Finals',
    'grand final': 'Grand Final'
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-16">
        <Navigation />
        <div className="container mx-auto px-4 py-8 text-center">
          <p>Loading results...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-16">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        {/* Premium Header */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <Trophy className="text-[hsl(45,90%,55%)]" size={40} strokeWidth={2.5} />
          <h1 className="text-5xl font-bold bg-gradient-gold bg-clip-text text-transparent">
            Match Results
          </h1>
          <Crown className="text-[hsl(45,90%,55%)]" size={40} strokeWidth={2.5} />
          {isPreview && (
            <span className="ml-2 text-xs px-2 py-1 bg-[#F9C846]/20 text-[#F9C846] rounded-full">Preview</span>
          )}
        </div>

        {/* Premium Golden Background Container */}
        <div className="relative bg-gradient-to-br from-[hsl(220,25%,12%)] via-[hsl(220,30%,15%)] to-[hsl(220,25%,10%)] rounded-3xl p-8 shadow-premium border-2 border-[hsl(45,90%,50%)]/30">
          {/* Subtle inner glow */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[hsl(45,90%,50%)]/10 via-transparent to-[hsl(45,90%,50%)]/5 pointer-events-none" />
          
          <div className="relative space-y-12">
            {phaseOrder.map((phase) => {
              const phaseMatches = groupedByPhase[phase];
              if (!phaseMatches || phaseMatches.length === 0) return null;

              return (
                <div key={phase} className="space-y-6">
                  {/* Phase Header */}
                  <div className="flex items-center gap-3">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[hsl(45,90%,55%)] to-transparent" />
                    <h2 className="text-3xl font-bold text-[hsl(45,90%,55%)] flex items-center gap-2">
                      <Trophy size={28} className="text-[hsl(45,90%,55%)]" />
                      {phaseLabels[phase]}
                    </h2>
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[hsl(45,90%,55%)] to-transparent" />
                  </div>

                  {/* Matches in this phase */}
                  <div className="space-y-4">
                    {phaseMatches.map((match) => (
                      <Card key={match.id} className="bg-[hsl(220,25%,18%)] backdrop-blur-sm border-2 border-[hsl(45,70%,55%)]/40 shadow-gold-soft hover:shadow-gold hover:scale-[1.02] transition-all duration-300">
                        <div className="p-6">
                          <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-center">
                            {/* Round & Match No */}
                            <div className="md:col-span-1 flex md:flex-col gap-2 items-center">
                              <div className="text-center">
                                <div className="text-xs text-gray-400 font-medium mb-1">Round</div>
                                <div className="text-2xl font-bold text-[hsl(45,90%,55%)]">
                                  {match.round_no || '-'}
                                </div>
                              </div>
                              <div className="text-center">
                                <div className="text-xs text-gray-400 font-medium mb-1">Match</div>
                                <div className="text-lg font-semibold text-white">
                                  #{match.match_no || '-'}
                                </div>
                              </div>
                            </div>

                            {/* Teams */}
                            <div className="md:col-span-2">
                              <div className="font-semibold text-lg text-white">
                                {match.team_a?.name}
                                <span className="text-gray-400 mx-2">vs</span>
                                {match.team_b?.name}
                              </div>
                            </div>

                            {/* Score */}
                            <div className="md:col-span-1 text-center">
                              <div className="text-xs text-gray-400 font-medium mb-1">Score</div>
                              <div className="font-mono text-2xl font-bold text-white bg-[hsl(220,25%,12%)] rounded-lg px-3 py-1 inline-block">
                                {match.team_a_score} - {match.team_b_score}
                              </div>
                            </div>

                            {/* Winner */}
                            <div className="md:col-span-1 text-center">
                              <div className="text-xs text-gray-400 font-medium mb-1">Winner</div>
                              {match.winner ? (
                                <div className="flex items-center justify-center gap-1">
                                  <Trophy className="text-[hsl(45,90%,55%)]" size={18} />
                                  <Badge className="bg-gradient-gold text-white border-0 shadow-gold-soft font-semibold px-3 py-1">
                                    {match.winner.name}
                                  </Badge>
                                </div>
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </div>

                            {/* Player of Match */}
                            <div className="md:col-span-1 text-center">
                              <div className="text-xs text-gray-400 font-medium mb-1">Player of Match</div>
                              {match.player_of_match ? (
                                <div className="flex items-center justify-center gap-1">
                                  <Star className="text-[hsl(45,90%,55%)]" size={16} fill="hsl(45,90%,55%)" />
                                  <Badge variant="outline" className="border-2 border-[hsl(45,80%,60%)] text-[hsl(45,90%,55%)] font-semibold bg-[hsl(220,25%,12%)]">
                                    {match.player_of_match.name}
                                  </Badge>
                                </div>
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </div>

                            {/* Phase */}
                            <div className="md:col-span-1 text-center">
                              <div className="text-xs text-gray-400 font-medium mb-1">Phase</div>
                              <Badge className="bg-primary text-primary-foreground font-semibold">
                                {match.match_phase?.toUpperCase()}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;
