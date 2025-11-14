import { Navigation } from "@/components/Navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

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

// Round color mapping
const ROUND_COLORS: Record<string, string> = {
  "1": "#1E3A8A", // Dark Blue
  "2": "#8E24AA", // Purple
  "3": "#FB8C00", // Orange - Semi Finals
  "4": "#F9A825", // Gold - Final
};

// Time ranges for matches
const MATCH_TIMES: Record<number, string> = {
  1: "7:00 AM - 7:40 AM",
  2: "7:50 AM - 8:30 AM",
  3: "8:40 AM - 9:20 AM",
  4: "9:30 AM - 10:10 AM",
  5: "10:20 AM - 11:00 AM",
  6: "11:10 AM - 11:50 AM",
  7: "12:00 PM - 12:40 PM",
  8: "12:50 PM - 1:30 PM",
  9: "1:40 PM - 2:20 PM",
  10: "2:30 PM - 3:10 PM",
  11: "3:20 PM - 4:00 PM",
  12: "4:10 PM - 4:50 PM",
  13: "5:00 PM - 5:40 PM",
  14: "5:50 PM - 6:30 PM",
  15: "6:40 PM - 7:20 PM",
  16: "7:30 PM - 8:10 PM",
  17: "8:20 PM - 9:00 PM",
  18: "9:10 PM - 9:50 PM",
  19: "7:00 AM - 7:40 AM",
  20: "7:50 AM - 8:30 AM",
  21: "8:40 AM - 9:20 AM",
  22: "9:30 AM - 10:10 AM",
  23: "10:20 AM - 11:00 AM",
  24: "11:10 AM - 11:50 AM",
  25: "12:00 PM - 12:40 PM",
  26: "12:50 PM - 1:30 PM",
  27: "1:40 PM - 2:20 PM",
  28: "2:30 PM - 3:10 PM",
  29: "3:20 PM - 4:00 PM",
  30: "4:10 PM - 4:50 PM",
  31: "5:10 PM - 5:50 PM",
  32: "6:00 PM - 6:40 PM",
  33: "7:00 PM - 7:40 PM",
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
      .order('match_no', { ascending: true });

    setMatches(data || []);
    setLoading(false);
  };

  // Map team name through TEAM_MAPPING if it exists
  const getTeamName = (team: any, match: any) => {
    if (!team) return "TBD";
    
    // Check if this is a Round 2+ match that hasn't been determined yet
    const roundNo = getRoundNumber(match);
    if (roundNo !== "1" && match.team_a_id === match.team_b_id) {
      return "TBD";
    }
    
    const mappedName = TEAM_MAPPING[team.short_name || team.name];
    return mappedName || team.name || "TBD";
  };

  // Get round number from match_no
  const getRoundNumber = (match: any) => {
    const matchNo = match.match_no;
    if (matchNo >= 1 && matchNo <= 18) return "1";
    if (matchNo >= 19 && matchNo <= 30) return "2";
    if (matchNo >= 31 && matchNo <= 32) return "3";
    if (matchNo === 33) return "4";
    return "1";
  };

  // Get status text
  const getStatusText = (match: any) => {
    const matchNo = match.match_no;
    if (matchNo >= 31 && matchNo <= 32) return 'Semi Final';
    if (matchNo === 33) return 'Grand Final';
    
    const status = match.status?.toUpperCase();
    if (status === 'LIVE') return 'Live Now';
    if (status === 'UPCOMING') return 'Match yet to begin';
    return 'Upcoming';
  };

  // Check if match is on Day 1 or Day 2
  const getMatchDay = (match: any) => {
    const matchNo = match.match_no;
    return matchNo <= 18 ? 1 : 2;
  };

  const filterMatchesByDay = (day: number) => {
    return matches.filter(m => getMatchDay(m) === day);
  };

  const FixtureCard = ({ match }: { match: any }) => {
    const roundNo = getRoundNumber(match);
    const roundColor = ROUND_COLORS[roundNo] || ROUND_COLORS["1"];
    const isLive = match.status?.toUpperCase() === 'LIVE';
    const teamAName = getTeamName(match.team_a, match);
    const teamBName = getTeamName(match.team_b, match);
    const statusText = getStatusText(match);
    const timeRange = MATCH_TIMES[match.match_no] || "TBD";

    return (
      <div 
        className="rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg"
        style={{ 
          backgroundColor: roundColor,
        }}
      >
        <div className="flex items-center justify-between py-5 px-6">
          {/* Left side - Teams and Status */}
          <div className="flex-1">
            <div className="space-y-2">
              <div className="font-bold text-white text-xl">
                {teamAName}
                {match.team_a_score && isLive && (
                  <span className="ml-3 text-base font-semibold">{match.team_a_score}</span>
                )}
              </div>
              <div className="font-bold text-white text-xl">
                {teamBName}
                {match.team_b_score && isLive && (
                  <span className="ml-3 text-base font-semibold">{match.team_b_score}</span>
                )}
              </div>
              <div className="text-sm text-white/90 mt-3 font-medium">
                {statusText}
              </div>
            </div>
          </div>

          {/* Right side - Match No and Time */}
          <div className="flex flex-col items-end gap-2 ml-8">
            {isLive && (
              <Badge className="bg-red-600 text-white hover:bg-red-700 mb-1 animate-pulse font-bold">
                ● LIVE
              </Badge>
            )}
            <div className="text-lg font-bold text-white">
              Match {match.match_no || '—'}
            </div>
            <div className="text-sm text-white/90 font-medium">
              {timeRange}
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
          <p className="text-lg text-foreground">Loading fixtures...</p>
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
            {day1Matches.length > 0 ? (
              <div className="space-y-8">
                {day1Matches.map((match) => (
                  <FixtureCard key={match.id} match={match} />
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-muted-foreground bg-card border border-border rounded-lg">
                No Day 1 fixtures available
              </div>
            )}
          </TabsContent>

          <TabsContent value="day2">
            {day2Matches.length > 0 ? (
              <div className="space-y-8">
                {day2Matches.map((match) => (
                  <FixtureCard key={match.id} match={match} />
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-muted-foreground bg-card border border-border rounded-lg">
                No Day 2 fixtures available
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Matches;
