import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";

// Match time slots
const getMatchTime = (matchNo: number): string => {
  const times: Record<number, string> = {
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
  return times[matchNo] || "TBD";
};

// Get match phase label
const getMatchPhase = (matchNo: number): string => {
  if (matchNo >= 1 && matchNo <= 18) return "League Stage";
  if (matchNo >= 19 && matchNo <= 30) return "Round 2";
  if (matchNo >= 31 && matchNo <= 32) return "Semi Final";
  if (matchNo === 33) return "Grand Final";
  return "";
};

// Get background color style based on match number
const getMatchStyle = (matchNo: number): React.CSSProperties => {
  // Match 1-18: Blue
  if (matchNo >= 1 && matchNo <= 18) {
    return {
      background: "linear-gradient(135deg, #1e3a5f 0%, #2a5298 50%, #1e3a5f 100%)",
      border: "2px solid #3b82f6",
    };
  }
  // Match 19-30: Purple
  if (matchNo >= 19 && matchNo <= 30) {
    return {
      background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #7c3aed 100%)",
      border: "2px solid #a855f7",
    };
  }
  // Match 31-32: Orange (Semi Finals)
  if (matchNo >= 31 && matchNo <= 32) {
    return {
      background: "linear-gradient(135deg, #ea580c 0%, #f97316 50%, #ea580c 100%)",
      border: "2px solid #f97316",
    };
  }
  // Match 33: Yellow (Final)
  if (matchNo === 33) {
    return {
      background: "linear-gradient(135deg, #eab308 0%, #facc15 50%, #eab308 100%)",
      border: "2px solid #facc15",
    };
  }
  return {};
};

interface MatchCardProps {
  matchNo: number;
  teamA?: string;
  teamB?: string;
}

const MatchCard = ({ matchNo, teamA = "TBD", teamB = "TBD" }: MatchCardProps) => {
  const phase = getMatchPhase(matchNo);
  const time = getMatchTime(matchNo);
  const style = getMatchStyle(matchNo);
  
  // Text color for final match (yellow bg needs dark text)
  const textColor = matchNo === 33 ? "text-gray-900" : "text-white";
  const subtextColor = matchNo === 33 ? "text-gray-700" : "text-white/80";

  return (
    <div 
      className="rounded-xl p-5 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl cursor-pointer"
      style={style}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className={`font-bold text-lg ${textColor}`}>{teamA}</h3>
          <h3 className={`font-bold text-lg ${textColor}`}>{teamB}</h3>
          <p className={`text-sm mt-1 ${subtextColor}`}>{phase}</p>
        </div>
        <div className="text-right">
          <p className={`font-bold text-lg ${textColor}`}>Match {matchNo}</p>
          <p className={`text-sm ${subtextColor}`}>{time}</p>
        </div>
      </div>
    </div>
  );
};

export const MatchesSection = () => {
  // Day 1 matches (1-18)
  const day1Matches = Array.from({ length: 18 }, (_, i) => i + 1);
  
  // Day 2 matches (19-33)
  const day2Matches = Array.from({ length: 15 }, (_, i) => i + 19);

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-4xl md:text-5xl font-bold text-primary mb-8 text-center">Match Fixtures</h2>

      <Tabs defaultValue="day1" className="w-full">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
          <TabsTrigger value="day1">Day 1 Fixtures</TabsTrigger>
          <TabsTrigger value="day2">Day 2 Fixtures</TabsTrigger>
        </TabsList>

        <TabsContent value="day1">
          <div className="space-y-4 max-w-4xl mx-auto">
            {day1Matches.map((matchNo) => (
              <MatchCard key={matchNo} matchNo={matchNo} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="day2">
          <div className="space-y-4 max-w-4xl mx-auto">
            {day2Matches.map((matchNo) => (
              <MatchCard key={matchNo} matchNo={matchNo} />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <div className="text-center mt-8">
        <Button asChild size="lg" className="font-semibold">
          <Link to="/matches">View All Matches</Link>
        </Button>
      </div>
    </div>
  );
};
