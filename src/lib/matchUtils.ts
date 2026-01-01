// Shared match utilities for consistent data across components

export const TOTAL_MATCHES = 33;

// Match time slots
// Match time slots based on tournament schedule
export const getMatchTime = (matchNo: number): string => {
  const times: Record<number, string> = {
    // Day 1 (Jan 3, 2026)
    1: "7:00 AM - 7:45 AM",
    2: "7:50 AM - 8:35 AM",
    3: "8:40 AM - 9:25 AM",
    4: "9:30 AM - 10:15 AM",
    5: "10:20 AM - 11:05 AM",
    6: "11:10 AM - 11:55 AM",
    7: "12:00 PM - 12:45 PM",
    8: "12:50 PM - 1:35 PM",
    9: "1:40 PM - 2:25 PM",
    10: "2:30 PM - 3:15 PM",
    11: "3:20 PM - 4:05 PM",
    12: "4:10 PM - 4:55 PM",
    // Felicitation Program 5:00 PM - 6:00 PM
    13: "6:10 PM - 6:55 PM",
    14: "7:00 PM - 7:45 PM",
    15: "7:50 PM - 8:35 PM",
    16: "8:40 PM - 9:25 PM",
    17: "9:30 PM - 10:15 PM",
    18: "10:20 PM - 11:05 PM",
    // Day 2 (Jan 4, 2026)
    19: "7:00 AM - 7:45 AM",
    20: "7:50 AM - 8:35 AM",
    21: "8:40 AM - 9:25 AM",
    22: "9:30 AM - 10:15 AM",
    23: "10:20 AM - 11:05 AM",
    24: "11:10 AM - 11:55 AM",
    25: "12:00 PM - 12:45 PM",
    26: "12:50 PM - 1:35 PM",
    27: "1:40 PM - 2:25 PM",
    28: "2:30 PM - 3:15 PM",
    29: "3:20 PM - 4:05 PM",
    30: "4:10 PM - 4:55 PM",
    31: "5:10 PM - 5:55 PM",
    32: "6:00 PM - 6:45 PM",
    33: "7:00 PM - 7:45 PM",
  };
  return times[matchNo] || "TBD";
};

// Get match phase label
export const getMatchPhase = (matchNo: number): string => {
  if (matchNo >= 1 && matchNo <= 18) return "League Stage";
  if (matchNo >= 19 && matchNo <= 30) return "Round 2";
  if (matchNo >= 31 && matchNo <= 32) return "Semi Final";
  if (matchNo === 33) return "Grand Final";
  return "";
};

// Get background color style based on match number (for MatchesSection)
export const getMatchStyle = (matchNo: number): React.CSSProperties => {
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

// Get Tailwind classes for timeline cards (original colors)
export const getMatchTimelineClasses = (matchNo: number): string => {
  // Match 1-18: Teal color (original)
  if (matchNo >= 1 && matchNo <= 18) {
    return "bg-gradient-to-br from-[#00C8C8] to-[#00A5A5] border-[#00C8C8]/50 hover:shadow-[0_0_20px_rgba(0,200,200,0.4)]";
  }
  // Match 19-30: Dark blue (original)
  if (matchNo >= 19 && matchNo <= 30) {
    return "bg-gradient-to-br from-[#1e3a5f] to-[#0f2744] border-[#2E73FF]/50 hover:shadow-[0_0_20px_rgba(46,115,255,0.4)]";
  }
  // Match 31-32: Orange (Semi Finals)
  if (matchNo >= 31 && matchNo <= 32) {
    return "bg-gradient-to-br from-[#e67e22] to-[#d35400] border-[#e67e22]/50 hover:shadow-[0_0_20px_rgba(230,126,34,0.4)]";
  }
  // Match 33: Yellow/Gold (Final)
  return "bg-gradient-to-br from-[#f1c40f] to-[#d4a837] border-[#F9C846]/50 hover:shadow-[0_0_20px_rgba(249,200,70,0.4)]";
};

// Get text colors based on match number
export const getMatchTextColors = (matchNo: number): { text: string; subtext: string } => {
  // Final match has dark background with yellow, needs dark text
  if (matchNo === 33) {
    return { text: "text-gray-900", subtext: "text-gray-700" };
  }
  return { text: "text-white", subtext: "text-white/80" };
};

// Generate CricHeroes embed URL from match ID
// Uses the tournament-embed format which allows iframe embedding
export const generateCricHeroesUrl = (cricHeroesMatchId: string): string => {
  return `https://cricheroes.com/tournament-embed/1/1735717/lbpl-season-3/match/${cricHeroesMatchId}`;
};
