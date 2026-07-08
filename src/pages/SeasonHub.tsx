import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { SEASONS, getFeaturedSeason } from "@/config/seasons";
import SeasonCard from "@/components/season/SeasonCard";
import { useSeason } from "@/context/SeasonContext";
import { Trophy, Sparkles, Award, ArrowRight, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SeasonHub() {
  const featured = getFeaturedSeason();
  const archived = SEASONS.filter((s) => s.status === "completed");
  const { setCurrentSeasonId } = useSeason();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "LBPL Official · Cricket Platform";
  }, []);

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "radial-gradient(ellipse at top, #0f2247 0%, #0a1325 45%, #050c1a 100%)",
      }}
    >
      <Navigation />

      <main className="pt-20 pb-16">
        {/* Hero — featured season */}
        <section className="container mx-auto px-4 pt-6 pb-14 animate-fade-in">
          <div className="mb-4 flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-[#f0b429]">
            <Sparkles size={14} /> Featured
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-[#f0b429]/25 bg-gradient-to-br from-[#123064] via-[#0b1c3d] to-[#050c1a] p-8 md:p-14 min-h-[380px] md:min-h-[460px]">
            <div
              className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full blur-3xl opacity-40"
              style={{ background: `radial-gradient(circle, ${featured.accent || "#F9C846"}, transparent 70%)` }}
            />
            <div className="absolute inset-0 bg-[url('/lbpl-logo-new.jpg')] bg-cover bg-center opacity-[0.04] pointer-events-none" />

            <div className="relative max-w-2xl">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-widest border border-teal-400/40 bg-teal-500/15 text-teal-200 mb-6">
                <span className="h-1.5 w-1.5 rounded-full bg-teal-400 animate-pulse" />
                {featured.status.toUpperCase()} · {featured.year}
              </span>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.05] tracking-tight">
                {featured.hero?.heading || featured.title}
              </h1>
              <p className="mt-5 text-base md:text-lg text-gray-300 max-w-xl leading-relaxed">
                {featured.hero?.subheading || featured.tagline}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button
                  onClick={() => {
                    setCurrentSeasonId(featured.id);
                    navigate(`/season/${featured.id}`);
                  }}
                  className="bg-[#f0b429] hover:bg-[#f0b429]/90 text-[#0b1c3d] font-bold px-6 py-6 text-base rounded-full shadow-lg shadow-[#f0b429]/30"
                >
                  Enter {featured.title}
                  <ArrowRight size={18} className="ml-1" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate("/hall-of-fame")}
                  className="border-white/20 bg-white/5 text-white hover:bg-white/10 rounded-full px-6 py-6 text-base"
                >
                  <Crown size={18} className="mr-1" />
                  Hall of Fame
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Tournament Archive */}
        <section className="container mx-auto px-4 py-10">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
                <Trophy className="text-[#f0b429]" size={26} />
                Tournament Archive
              </h2>
              <p className="text-sm text-gray-400 mt-1">Every LBPL season, preserved.</p>
            </div>
            <Link
              to="/archive"
              className="text-sm text-[#f0b429] font-semibold hover:underline flex items-center gap-1"
            >
              View all <ArrowRight size={14} />
            </Link>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 snap-x snap-mandatory" style={{ scrollbarWidth: "none" }}>
            {archived.map((s) => (
              <div key={s.id} className="snap-start shrink-0">
                <SeasonCard season={s} />
              </div>
            ))}
            {archived.length === 0 && (
              <div className="text-gray-400 text-sm">No completed seasons yet.</div>
            )}
          </div>
        </section>

        {/* Hall of Fame teaser */}
        <section className="container mx-auto px-4 py-10">
          <Link
            to="/hall-of-fame"
            className="group block relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#1a1a2e] via-[#0b1c3d] to-[#050c1a] p-8 md:p-10 hover:border-[#f0b429]/40 transition-all"
          >
            <div
              className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full blur-3xl opacity-30"
              style={{ background: "radial-gradient(circle, #F9C846, transparent 70%)" }}
            />
            <div className="relative flex items-center gap-5">
              <div className="h-14 w-14 rounded-2xl bg-[#f0b429]/15 border border-[#f0b429]/30 flex items-center justify-center shrink-0">
                <Award size={28} className="text-[#f0b429]" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl md:text-2xl font-bold text-white">Hall of Fame</h3>
                <p className="text-sm text-gray-400 mt-1">All-time records aggregated across every season.</p>
              </div>
              <ArrowRight size={22} className="text-[#f0b429] group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </section>
      </main>
    </div>
  );
}
