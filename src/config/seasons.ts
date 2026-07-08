export type SeasonStatus = "live" | "completed" | "upcoming";

export interface SeasonConfig {
  id: string;                 // stable slug, e.g. "s3", "s4"
  number: number;             // 3, 4, ...
  year: number;
  status: SeasonStatus;
  title: string;              // "Season 3"
  tagline?: string;
  champion?: string | null;
  runnerUp?: string | null;
  teamsCount?: number;
  matchesCount?: number;
  accent?: string;            // hex color accent
  isDataConnected: boolean;   // true => reads existing DB tables; false => shows Coming Soon placeholders
  hero?: {
    heading: string;
    subheading: string;
  };
}

/**
 * Add future seasons by appending an object here — no UI changes required.
 * Season 3 keeps its existing data source (current DB tables) untouched.
 */
export const SEASONS: SeasonConfig[] = [
  {
    id: "s4",
    number: 4,
    year: 2027,
    status: "upcoming",
    title: "Season 4",
    tagline: "The next chapter · Coming Soon",
    teamsCount: 0,
    matchesCount: 0,
    accent: "#00C8C8",
    isDataConnected: false,
    hero: {
      heading: "LBPL Season 4",
      subheading: "The next chapter of LBPL cricket. Fixtures, teams and squads drop soon.",
    },
  },
  {
    id: "s3",
    number: 3,
    year: 2026,
    status: "completed",
    title: "Season 3",
    tagline: "The season that redefined LBPL",
    champion: null,
    runnerUp: null,
    teamsCount: 12,
    matchesCount: 33,
    accent: "#F9C846",
    isDataConnected: true,
    hero: {
      heading: "LBPL Season 3",
      subheading: "Relive every over, every wicket, every roar.",
    },
  },
];

export const getActiveSeason = (): SeasonConfig => {
  return SEASONS.find((s) => s.status === "upcoming") || SEASONS.find((s) => s.status === "live") || SEASONS[0];
};

export const getFeaturedSeason = (): SeasonConfig => {
  // Feature the newest season (upcoming or live). Falls back to the latest completed.
  return SEASONS.find((s) => s.status === "upcoming" || s.status === "live") || SEASONS[0];
};

export const getSeasonById = (id: string | undefined): SeasonConfig | undefined => {
  if (!id) return undefined;
  return SEASONS.find((s) => s.id === id);
};
