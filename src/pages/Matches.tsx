import { Navigation } from "@/components/Navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

// Team name mapping from T1-T18 to actual names
const TEAM_MAPPING: Record<string, string> = {
  "T1": "Akot Avengers",
  "T2": "Puneri Paltan",
  "T3": "Damdar Dongaon",
  "T4": "Jagadamb Sakharkherda",
  "T5": "Nagpur Tigers",
  "T6": "Shree Balaji Mehkar",
  "T7": "Wardha Reloaded 3.0",
  "T8": "Dhamakedar Mumbai",
  "T9": "Buldhana Blasters",
  "T10": "Ajeya Akola",
  "T11": "Nagpur Gladiators",
  "T12": "Puneri Katta",
  "T13": "Aflatoon Akola",
  "T14": "DeulgaonRaja Warriors",
  "T15": "Sharangdhar Mehkar",
  "T16": "Shandaar Chikhali",
  "T17": "Malkapur Risers",
  "T18": "Dhurandhar SambhajiNagar",
};

// Round color mapping with transparency
const ROUND_COLORS: Record<string, { bg: string; text: string; liveBg: string }> = {
  "1": { 
    bg: "rgba(0, 150, 136, 0.12)", // Teal with transparency
    text: "text-[#00796B]",
    liveBg: "rgba(0, 150, 136, 0.20)"
  },
  "2": { 
    bg: "rgba(142, 36, 170, 0.12)", // Purple with transparency
    text: "text-[#6A1B9A]",
    liveBg: "rgba(142, 36, 170, 0.20)"
  },
  "3": { 
    bg: "rgba(251, 140, 0, 0.12)", // Orange with transparency
    text: "text-[#E65100]",
    liveBg: "rgba(251, 140, 0, 0.20)"
  },
  "4": { 
    bg: "rgba(249, 168, 37, 0.12)", // Gold with transparency
    text: "text-[#F57F17]",
    liveBg: "rgba(249, 168, 37, 0.20)"
  },
};

const Matches = () => {
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    const { data } = await supabase
      .from('matches')
      .select(`
        *,
        team_a:teams!matches_team_a_id_fkey(*),
        team_b:teams!matches_team_b_id_fkey(*)
      `)
      .order('match_date', { ascending: true })
      .order('match_no', { ascending: true });

    setMatches(data || []);
    setLoading(false);
  };

  // Map team name through TEAM_MAPPING if it exists
  const getTeamName = (team: any) => {
    if (!team) return "TBD";
    const mappedName = TEAM_MAPPING[team.short_name || team.name];
    return mappedName || team.name || "TBD";
  };

  // Get round number from match_phase
  const getRoundNumber = (match: any) => {
    if (match.match_phase?.includes('league1')) return "1";
    if (match.match_phase?.includes('league2')) return "2";
    if (match.match_phase?.includes('semi')) return "3";
    if (match.match_phase?.includes('final')) return "4";
    return match.round_no?.toString() || "1";
  };

  // Get status text
  const getStatusText = (match: any) => {
    const status = match.status?.toUpperCase();
    if (status === 'LIVE') return 'Live Now';
    if (status === 'UPCOMING') return 'Match yet to begin';
    if (match.match_phase?.includes('semi')) return 'Semi Final';
    if (match.match_phase?.includes('final')) return 'Final';
    return 'Upcoming';
  };

  // Check if match is on Day 1 or Day 2
  const getMatchDay = (match: any) => {
    const roundNo = getRoundNumber(match);
    return roundNo === "1" ? 1 : 2;
  };

  const filterMatchesByDay = (day: number) => {
    return matches.filter(m => getMatchDay(m) === day);
  };

  const FixtureCard = ({ match }: { match: any }) => {
    const roundNo = getRoundNumber(match);
    const roundColor = ROUND_COLORS[roundNo] || ROUND_COLORS["1"];
    const isLive = match.status?.toUpperCase() === 'LIVE';
    const teamAName = getTeamName(match.team_a);
    const teamBName = getTeamName(match.team_b);
    const statusText = getStatusText(match);

    const backgroundColor = isLive ? roundColor.liveBg : roundColor.bg;

    return (
      <div 
        className="mb-3 rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg"
        style={{ backgroundColor }}
      >
        <div className="flex items-stretch">
          {/* Main content area */}
          <div className="flex-1 flex items-center justify-between py-5 px-6">
            {/* Left side - Teams and Status */}
            <div className="flex-1">
              <div className="space-y-1">
                <div className={`font-bold text-lg ${roundColor.text}`}>
                  {teamAName}
                  {match.team_a_score && isLive && (
                    <span className="ml-3 text-base font-semibold">{match.team_a_score}</span>
                  )}
                </div>
                <div className={`font-bold text-lg ${roundColor.text}`}>
                  {teamBName}
                  {match.team_b_score && isLive && (
                    <span className="ml-3 text-base font-semibold">{match.team_b_score}</span>
                  )}
                </div>
                <div className={`text-sm mt-3 ${roundColor.text} opacity-80`}>
                  {statusText}
                </div>
              </div>
            </div>

            {/* Right side - Time, Match No, and LIVE badge */}
            <div className="flex flex-col items-end gap-1 ml-8">
              {isLive && (
                <Badge className="bg-red-600 text-white hover:bg-red-700 mb-2 animate-pulse font-bold">
                  ● LIVE
                </Badge>
              )}
              <div className={`text-3xl font-bold ${roundColor.text}`}>
                {format(new Date(match.match_date), 'h:mm a')}
              </div>
              <div className={`text-xs ${roundColor.text} opacity-70 mt-1`}>
                Match {match.match_no || '—'}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8 text-center">
          <p>Loading fixtures...</p>
        </div>
      </div>
    );
  }

  const day1Matches = filterMatchesByDay(1);
  const day2Matches = filterMatchesByDay(2);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-primary mb-8">Fixtures</h1>

        <Tabs defaultValue="day1" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
            <TabsTrigger value="day1">Day 1 Fixtures</TabsTrigger>
            <TabsTrigger value="day2">Day 2 Fixtures</TabsTrigger>
          </TabsList>

          <TabsContent value="day1">
            <div className="space-y-0">
              {day1Matches.length > 0 ? (
                day1Matches.map((match) => (
                  <FixtureCard key={match.id} match={match} />
                ))
              ) : (
                <div className="p-8 text-center text-muted-foreground bg-card border border-border rounded-lg">
                  No Day 1 fixtures available
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="day2">
            <div className="space-y-0">
              {day2Matches.length > 0 ? (
                day2Matches.map((match) => (
                  <FixtureCard key={match.id} match={match} />
                ))
              ) : (
                <div className="p-8 text-center text-muted-foreground bg-card border border-border rounded-lg">
                  No Day 2 fixtures available
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Matches;
