import { supabase } from "@/integrations/supabase/client";

export interface HofRecord {
  label: string;
  value: string;
  player?: string;
  team?: string;
  matchInfo?: string;
}

export interface HofData {
  mostRuns?: HofRecord;
  mostWickets?: HofRecord;
  mostSixes?: HofRecord;
  highestScore?: HofRecord;
  bestBowling?: HofRecord;
  mostPotm?: HofRecord;
  fastestFifty?: HofRecord;
  bestEconomy?: HofRecord;
  champion?: string | null;
  runnerUp?: string | null;
}

interface BattingEntry {
  player_name?: string;
  runs?: number;
  balls?: number;
  fours?: number;
  sixes?: number;
  out?: boolean;
}

interface BowlingEntry {
  player_name?: string;
  overs?: number;
  runs?: number;
  wickets?: number;
  maidens?: number;
}

/**
 * Aggregates hall-of-fame records from `match_scorecards`. Falls back to
 * empty state when no data is available for the given season.
 */
export async function loadHallOfFameForSeason(seasonId: string): Promise<HofData> {
  // Season 3 uses current DB tables. Other seasons currently have no data.
  if (seasonId !== "s3") {
    return {};
  }

  const { data: scorecards, error } = await supabase
    .from("match_scorecards")
    .select("*");

  if (error || !scorecards) return {};

  const runsByPlayer = new Map<string, { runs: number; team?: string }>();
  const wicketsByPlayer = new Map<string, { wickets: number; team?: string }>();
  const sixesByPlayer = new Map<string, { sixes: number; team?: string }>();
  let highest: HofRecord | undefined;
  let bestBowl: HofRecord | undefined;
  let fastestFifty: HofRecord | undefined;
  let bestEconomy: HofRecord | undefined;

  const bump = (map: Map<string, { runs?: number; wickets?: number; sixes?: number; team?: string }>, key: string, patch: any) => {
    const prev = map.get(key) || {};
    map.set(key, {
      ...prev,
      ...Object.fromEntries(
        Object.entries(patch).map(([k, v]) => [k, k === "team" ? v : ((prev as any)[k] || 0) + (Number(v) || 0)])
      ),
    });
  };

  for (const sc of scorecards as any[]) {
    const innings = [
      { batting: sc.team1_batting, bowling: sc.team2_bowling, batTeam: sc.team1_name, bowlTeam: sc.team2_name },
      { batting: sc.team2_batting, bowling: sc.team1_bowling, batTeam: sc.team2_name, bowlTeam: sc.team1_name },
    ];

    for (const inn of innings) {
      const bats: BattingEntry[] = Array.isArray(inn.batting) ? inn.batting : [];
      for (const b of bats) {
        if (!b?.player_name) continue;
        bump(runsByPlayer, b.player_name, { runs: b.runs, team: inn.batTeam });
        bump(sixesByPlayer, b.player_name, { sixes: b.sixes, team: inn.batTeam });

        if (typeof b.runs === "number" && (!highest || b.runs > Number(highest.value))) {
          highest = {
            label: "Highest Individual Score",
            value: String(b.runs),
            player: b.player_name,
            team: inn.batTeam,
            matchInfo: `${b.runs}${b.balls ? ` (${b.balls})` : ""}`,
          };
        }

        // Fastest fifty: runs >= 50 with fewest balls
        if (typeof b.runs === "number" && b.runs >= 50 && typeof b.balls === "number" && b.balls > 0) {
          if (!fastestFifty || b.balls < Number(fastestFifty.value)) {
            fastestFifty = {
              label: "Fastest Fifty",
              value: String(b.balls),
              player: b.player_name,
              team: inn.batTeam,
              matchInfo: `${b.runs} off ${b.balls} balls`,
            };
          }
        }
      }

      const bwls: BowlingEntry[] = Array.isArray(inn.bowling) ? inn.bowling : [];
      for (const bw of bwls) {
        if (!bw?.player_name) continue;
        bump(wicketsByPlayer, bw.player_name, { wickets: bw.wickets, team: inn.bowlTeam });

        // Best bowling: most wickets, then fewest runs
        if (typeof bw.wickets === "number" && bw.wickets > 0) {
          const bbCurrent = bestBowl ? bestBowl.value.split("/").map(Number) : [0, 999];
          const cur = [bw.wickets, Number(bw.runs) || 0];
          if (cur[0] > bbCurrent[0] || (cur[0] === bbCurrent[0] && cur[1] < bbCurrent[1])) {
            bestBowl = {
              label: "Best Bowling Figures",
              value: `${bw.wickets}/${bw.runs ?? "-"}`,
              player: bw.player_name,
              team: inn.bowlTeam,
              matchInfo: `${bw.wickets} wkts for ${bw.runs} runs`,
            };
          }
        }

        // Best economy: min 2 overs, lowest econ
        if (typeof bw.overs === "number" && bw.overs >= 2 && typeof bw.runs === "number") {
          const econ = bw.runs / bw.overs;
          if (!bestEconomy || econ < Number(bestEconomy.value)) {
            bestEconomy = {
              label: "Best Economy",
              value: econ.toFixed(2),
              player: bw.player_name,
              team: inn.bowlTeam,
              matchInfo: `${bw.overs} ov · ${bw.runs} runs`,
            };
          }
        }
      }
    }
  }

  const pickTop = (map: Map<string, any>, key: "runs" | "wickets" | "sixes", label: string): HofRecord | undefined => {
    let best: { name: string; val: number; team?: string } | null = null;
    map.forEach((v, k) => {
      const n = Number(v[key] || 0);
      if (n > 0 && (!best || n > best.val)) best = { name: k, val: n, team: v.team };
    });
    if (!best) return undefined;
    return { label, value: String(best.val), player: best.name, team: best.team };
  };

  // POTM aggregation from potm_votes → highest voted player overall
  let mostPotm: HofRecord | undefined;
  const { data: potmRows } = await supabase
    .from("potm_votes")
    .select("player_id, match_id");

  if (potmRows && potmRows.length) {
    const counts = new Map<string, Map<string, number>>();
    for (const row of potmRows as any[]) {
      if (!row.player_id || !row.match_id) continue;
      const m = counts.get(row.match_id) || new Map<string, number>();
      m.set(row.player_id, (m.get(row.player_id) || 0) + 1);
      counts.set(row.match_id, m);
    }
    // Determine winner per match, then tally
    const awardCounts = new Map<string, number>();
    counts.forEach((m) => {
      let winner: string | null = null;
      let max = 0;
      m.forEach((v, k) => {
        if (v > max) { max = v; winner = k; }
      });
      if (winner) awardCounts.set(winner, (awardCounts.get(winner) || 0) + 1);
    });
    let bestId: string | null = null; let bestCount = 0;
    awardCounts.forEach((v, k) => { if (v > bestCount) { bestCount = v; bestId = k; } });
    if (bestId && bestCount > 0) {
      const { data: p } = await supabase.from("players").select("name").eq("id", bestId).maybeSingle();
      mostPotm = {
        label: "Most Player of the Match",
        value: String(bestCount),
        player: (p as any)?.name || "Player",
      };
    }
  }

  return {
    mostRuns: pickTop(runsByPlayer, "runs", "Most Runs"),
    mostWickets: pickTop(wicketsByPlayer, "wickets", "Most Wickets"),
    mostSixes: pickTop(sixesByPlayer, "sixes", "Most Sixes"),
    highestScore: highest,
    bestBowling: bestBowl,
    mostPotm,
    fastestFifty,
    bestEconomy,
  };
}
