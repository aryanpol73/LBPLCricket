import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Trophy, Star } from "lucide-react";
import { getMatchPhase } from "@/lib/matchUtils";
import { cn } from "@/lib/utils";

type ResultRow = {
  id: string;
  roundNo: number | null;
  matchNo: number | null;
  teamA: string;
  teamB: string;
  teamAScore: string | null;
  teamBScore: string | null;
  winner: string | null;
  playerOfMatch: string | null;
  phase: string;
};

type Props = {
  limit?: number;
  grouped?: boolean;
  className?: string;
};

const toDisplayPhase = (matchNo: number | null): string => {
  if (!matchNo) return "";
  const base = getMatchPhase(matchNo);
  switch (base) {
    case "League Stage":
      return "League Phase";
    case "Round 2":
      return "Knockouts";
    case "Semi Final":
      return "Semi-Finals";
    default:
      return base;
  }
};

export function MatchResultsTable({ limit, grouped = false, className }: Props) {
  const [rows, setRows] = useState<ResultRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const query = supabase
      .from("matches")
      .select(
        `
        id,
        round_no,
        match_no,
        team_a_score,
        team_b_score,
        status,
        team_a:teams!matches_team_a_id_fkey(name),
        team_b:teams!matches_team_b_id_fkey(name),
        winner:teams!matches_winner_id_fkey(name),
        player:players!matches_player_of_match_id_fkey(name)
      `
      )
      .eq("status", "completed")
      .order("match_no", { ascending: true });

    const { data, error } = limit ? await query.limit(limit) : await query;

    if (error) {
      console.error("Failed to load match results:", error);
      setRows([]);
      setLoading(false);
      return;
    }

    const mapped: ResultRow[] = (data || []).map((m: any) => {
      const matchNo = (m.match_no ?? null) as number | null;
      return {
        id: m.id,
        roundNo: (m.round_no ?? null) as number | null,
        matchNo,
        teamA: m.team_a?.name || "TBD",
        teamB: m.team_b?.name || "TBD",
        teamAScore: (m.team_a_score ?? null) as string | null,
        teamBScore: (m.team_b_score ?? null) as string | null,
        winner: m.winner?.name || null,
        playerOfMatch: m.player?.name || null,
        phase: toDisplayPhase(matchNo),
      };
    });

    setRows(mapped);
    setLoading(false);
  };

  useEffect(() => {
    load();
    const channel = supabase
      .channel(`match-results:${limit ?? "all"}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "matches" },
        () => load()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [limit]);

  const groupedRows = useMemo(() => {
    if (!grouped) return [{ key: "All", title: null as string | null, rows }];

    const order = ["League Phase", "Knockouts", "Semi-Finals", "Grand Final"];
    const buckets = new Map<string, ResultRow[]>();

    for (const r of rows) {
      const k = r.phase || "Other";
      buckets.set(k, [...(buckets.get(k) || []), r]);
    }

    const keys = Array.from(buckets.keys()).sort((a, b) => {
      const ai = order.indexOf(a);
      const bi = order.indexOf(b);
      if (ai === -1 && bi === -1) return a.localeCompare(b);
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      return ai - bi;
    });

    return keys.map((k) => ({ key: k, title: k, rows: buckets.get(k)! }));
  }, [grouped, rows]);

  if (loading) {
    return (
      <div className={cn("text-center py-8", className)}>
        <p className="text-muted-foreground text-lg">Loading results…</p>
      </div>
    );
  }

  if (!rows.length) {
    return (
      <div className={cn("text-center py-8", className)}>
        <Trophy className="mx-auto mb-3 text-secondary" size={40} />
        <p className="text-muted-foreground text-lg">
          Results will be available once matches are completed
        </p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-8", className)}>
      {groupedRows.map((group) => (
        <div key={group.key} className="space-y-3">
          {group.title && (
            <div className="flex items-center gap-2">
              <Trophy className="text-secondary" size={18} />
              <h3 className="text-xl font-bold text-primary">{group.title}</h3>
            </div>
          )}

          <div className="rounded-2xl border border-border/40 bg-card/20 overflow-hidden">
            <Table className="min-w-[980px]">
              <TableHeader className="bg-primary/15">
                <TableRow className="hover:bg-primary/15">
                  <TableHead className="text-foreground">Round No.</TableHead>
                  <TableHead className="text-foreground">Match No.</TableHead>
                  <TableHead className="text-foreground">Teams</TableHead>
                  <TableHead className="text-foreground">Score</TableHead>
                  <TableHead className="text-foreground">Winner</TableHead>
                  <TableHead className="text-foreground">Player of the Match</TableHead>
                  <TableHead className="text-foreground">Phase</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {group.rows.map((r) => (
                  <TableRow key={r.id} className="hover:bg-muted/30">
                    <TableCell className="font-semibold text-foreground">
                      {r.roundNo ?? "-"}
                    </TableCell>
                    <TableCell className="font-semibold text-foreground">
                      {r.matchNo ?? "-"}
                    </TableCell>

                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-semibold text-foreground">{r.teamA}</span>
                        <span className="text-muted-foreground">{r.teamB}</span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-semibold text-foreground">{r.teamAScore || "-"}</span>
                        <span className="text-muted-foreground">{r.teamBScore || "-"}</span>
                      </div>
                    </TableCell>

                    <TableCell>
                      {r.winner ? (
                        <Badge variant="secondary" className="gap-1">
                          <Trophy size={14} />
                          <span>{r.winner}</span>
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>

                    <TableCell>
                      {r.playerOfMatch ? (
                        <Badge variant="outline" className="gap-1">
                          <Star size={14} />
                          <span>{r.playerOfMatch}</span>
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>

                    <TableCell>
                      {r.phase ? (
                        <Badge className="whitespace-nowrap">{r.phase}</Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      ))}
    </div>
  );
}
