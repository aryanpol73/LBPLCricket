import { useEffect, useMemo, useState } from "react";
import { Navigation } from "@/components/Navigation";
import { SEASONS } from "@/config/seasons";
import { loadHallOfFameForSeason, HofData, HofRecord } from "@/lib/hallOfFame";
import { Award, Trophy, Zap, Target, Crown, Flame, Gauge, Timer, TrendingUp } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";

const iconFor = (key: string) => {
  switch (key) {
    case "mostRuns": return TrendingUp;
    case "mostWickets": return Target;
    case "mostSixes": return Flame;
    case "highestScore": return Trophy;
    case "bestBowling": return Zap;
    case "mostPotm": return Crown;
    case "fastestFifty": return Timer;
    case "bestEconomy": return Gauge;
    default: return Award;
  }
};

const HofCard = ({ rec, k }: { rec?: HofRecord; k: string }) => {
  const Icon = iconFor(k);
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#0f2247]/60 to-[#050c1a]/80 p-5 hover:border-[#f0b429]/40 transition-all">
      <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-[#f0b429]/10 blur-2xl" />
      <div className="relative">
        <div className="flex items-center gap-2 mb-3">
          <div className="h-9 w-9 rounded-lg bg-[#f0b429]/15 border border-[#f0b429]/25 flex items-center justify-center">
            <Icon size={18} className="text-[#f0b429]" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            {rec?.label || k}
          </span>
        </div>
        {rec ? (
          <>
            <div className="text-3xl font-bold text-white leading-none">{rec.value}</div>
            {rec.player && (
              <div className="mt-2 text-sm text-white font-medium truncate">{rec.player}</div>
            )}
            {rec.team && <div className="text-xs text-gray-400 truncate">{rec.team}</div>}
            {rec.matchInfo && (
              <div className="mt-2 text-[11px] text-gray-500 italic">{rec.matchInfo}</div>
            )}
          </>
        ) : (
          <div className="text-sm text-gray-500 italic">No data yet</div>
        )}
      </div>
    </div>
  );
};

export default function HallOfFame() {
  const [params, setParams] = useSearchParams();
  const initial = params.get("season") || SEASONS.find(s => s.isDataConnected)?.id || SEASONS[0].id;
  const [seasonId, setSeasonId] = useState<string>(initial);
  const [data, setData] = useState<HofData>({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const season = useMemo(() => SEASONS.find((s) => s.id === seasonId), [seasonId]);

  useEffect(() => {
    document.title = "Hall of Fame · LBPL";
  }, []);

  useEffect(() => {
    setLoading(true);
    loadHallOfFameForSeason(seasonId).then((d) => {
      setData(d);
      setLoading(false);
    });
    setParams({ season: seasonId }, { replace: true });
  }, [seasonId, setParams]);

  const keys: (keyof HofData)[] = [
    "mostRuns", "mostWickets", "mostSixes", "highestScore",
    "bestBowling", "mostPotm", "fastestFifty", "bestEconomy",
  ];

  return (
    <div className="min-h-screen" style={{ background: "radial-gradient(ellipse at top, #0f2247, #050c1a)" }}>
      <Navigation />

      <main className="pt-20 pb-16 container mx-auto px-4">
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-3">
            <Award className="text-[#f0b429]" size={32} />
            <h1 className="text-4xl md:text-5xl font-bold text-white">Hall of Fame</h1>
          </div>
          <p className="text-gray-400 max-w-2xl">
            All-time LBPL records, aggregated from every match ever played.
          </p>
        </div>

        {/* Season filter chips */}
        <div className="mb-8 flex flex-wrap gap-2">
          {SEASONS.map((s) => {
            const active = s.id === seasonId;
            return (
              <button
                key={s.id}
                onClick={() => setSeasonId(s.id)}
                className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
                  active
                    ? "bg-[#f0b429] text-[#0b1c3d] border-[#f0b429]"
                    : "bg-white/5 text-gray-300 border-white/10 hover:border-[#f0b429]/40"
                }`}
              >
                {s.title}
              </button>
            );
          })}
        </div>

        {/* Champion / Runner-up strip */}
        {season && (
          <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-[#f0b429]/30 bg-gradient-to-br from-[#f0b429]/10 to-transparent p-5">
              <div className="text-xs uppercase tracking-widest text-[#f0b429] mb-1">Champion · {season.title}</div>
              <div className="text-2xl font-bold text-white">{season.champion || "To be crowned"}</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="text-xs uppercase tracking-widest text-gray-400 mb-1">Runner-up</div>
              <div className="text-2xl font-bold text-white">{season.runnerUp || "—"}</div>
            </div>
          </div>
        )}

        {/* Records grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {keys.map((k) => (
              <div key={k} className="h-40 rounded-2xl bg-white/5 border border-white/10 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {keys.map((k) => <HofCard key={k} k={k} rec={data[k] as HofRecord | undefined} />)}
          </div>
        )}

        <div className="mt-10 text-center">
          <button
            onClick={() => navigate("/")}
            className="text-[#f0b429] font-semibold hover:underline"
          >
            ← Back to Season Hub
          </button>
        </div>
      </main>
    </div>
  );
}
