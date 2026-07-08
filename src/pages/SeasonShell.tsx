import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { getSeasonById } from "@/config/seasons";
import { useSeason } from "@/context/SeasonContext";
import Index from "@/pages/Index";
import { Navigation } from "@/components/Navigation";
import { Sparkles, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

/**
 * Season shell — resolves the :seasonId param, sets it as active, and either
 * renders the standard homepage (for data-connected seasons like Season 3) or
 * a "Coming Soon" preview for seasons without live data.
 */
export default function SeasonShell() {
  const { seasonId } = useParams<{ seasonId: string }>();
  const { setCurrentSeasonId } = useSeason();
  const season = getSeasonById(seasonId);

  useEffect(() => {
    if (season) setCurrentSeasonId(season.id);
  }, [season, setCurrentSeasonId]);

  if (!season) {
    return (
      <div className="min-h-screen bg-[#0a1325] pt-20">
        <Navigation />
        <div className="container mx-auto px-4 py-16 text-center text-white">
          Season not found. <Link to="/" className="text-[#f0b429]">Back to Hub</Link>
        </div>
      </div>
    );
  }

  if (season.isDataConnected) {
    // Season 3 (and any future data-connected season) uses the current homepage untouched.
    return <Index />;
  }

  // Coming soon preview
  return (
    <div className="min-h-screen" style={{ background: "radial-gradient(ellipse at top, #0f2247, #050c1a)" }}>
      <Navigation />
      <main className="pt-24 pb-16 container mx-auto px-4">
        <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-8">
          <ArrowLeft size={16} /> Back to Season Hub
        </Link>

        <div className="relative overflow-hidden rounded-3xl border border-[#f0b429]/25 bg-gradient-to-br from-[#123064] via-[#0b1c3d] to-[#050c1a] p-10 md:p-16 min-h-[60vh] flex flex-col justify-center">
          <div
            className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full blur-3xl opacity-30"
            style={{ background: `radial-gradient(circle, ${season.accent || "#F9C846"}, transparent 70%)` }}
          />
          <div className="relative max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-widest border border-[#f0b429]/40 bg-[#f0b429]/15 text-[#f0b429] mb-6">
              <Sparkles size={12} /> COMING SOON · {season.year}
            </span>
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-[1.05]">
              {season.hero?.heading || season.title}
            </h1>
            <p className="mt-6 text-lg text-gray-300 max-w-xl">
              {season.hero?.subheading || "Details drop soon. Stay tuned."}
            </p>

            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-xl">
              {[
                ["Teams", "—"],
                ["Matches", "—"],
                ["Format", "T20"],
                ["Venue", "TBA"],
              ].map(([k, v]) => (
                <div key={k} className="rounded-xl bg-white/5 border border-white/10 p-3">
                  <div className="text-[10px] uppercase text-gray-400 tracking-wider">{k}</div>
                  <div className="text-sm font-bold text-white mt-1">{v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
