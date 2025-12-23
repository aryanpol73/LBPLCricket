// Shared match utilities for consistent data across components

export const TOTAL_MATCHES = 33;

// Match time slots
export const getMatchTime = (matchNo: number): string => {
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

// Get Tailwind classes for timeline cards (synced with MatchesSection colors)
export const getMatchTimelineClasses = (matchNo: number): string => {
  // Match 1-18: Blue (same as MatchesSection)
  if (matchNo >= 1 && matchNo <= 18) {
    return "bg-gradient-to-br from-[#1e3a5f] to-[#2a5298] border-[#3b82f6] hover:shadow-[0_0_20px_rgba(59,130,246,0.4)]";
  }
  // Match 19-30: Purple (same as MatchesSection)
  if (matchNo >= 19 && matchNo <= 30) {
    return "bg-gradient-to-br from-[#7c3aed] to-[#a855f7] border-[#a855f7] hover:shadow-[0_0_20px_rgba(168,85,247,0.4)]";
  }
  // Match 31-32: Orange (Semi Finals)
  if (matchNo >= 31 && matchNo <= 32) {
    return "bg-gradient-to-br from-[#ea580c] to-[#f97316] border-[#f97316] hover:shadow-[0_0_20px_rgba(249,115,22,0.4)]";
  }
  // Match 33: Yellow (Final)
  return "bg-gradient-to-br from-[#eab308] to-[#facc15] border-[#facc15] hover:shadow-[0_0_20px_rgba(250,204,21,0.4)]";
};

// Get text colors based on match number
export const getMatchTextColors = (matchNo: number): { text: string; subtext: string } => {
  // Final match has dark background with yellow, needs dark text
  if (matchNo === 33) {
    return { text: "text-gray-900", subtext: "text-gray-700" };
  }
  return { text: "text-white", subtext: "text-white/80" };
};
