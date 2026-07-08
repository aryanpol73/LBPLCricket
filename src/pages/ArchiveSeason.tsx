import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { getSeasonById } from "@/config/seasons";
import { useSeason } from "@/context/SeasonContext";
import { Trophy, Users, Calendar, Award, ArrowRight, ArrowLeft, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ArchiveSeason() {
  const { seasonId } = useParams<{ seasonId: string }>();
  const season = getSeasonById(seasonId);
  const { setCurrentSeasonId } = useSeason();
  const navigate = useNavigate();

  useEffect(() => {
    if (season) {
      setCurrentSeasonId(season.id);
      document.title = `${season.title} Archive · LBPL`;
    }
  }, [season, setCurrentSeasonId]);

  if (!season) {
    return (
      <div className="min-h-screen bg-[#0a1325] pt-20">
        <Navigation />
        <div className="container mx-auto px-4 py-16 text-center text-white">
          <p>Season not found.</p>
          <Link to="/archive" className="text-[#f0b429]">Back to Archive</Link>
        </div>
      </div>
    );
  }

  const quickLinks = [
    { label: "Home",         path: "/",              icon: Trophy },
    { label: "Fixtures",     path: "/matches",       icon: Calendar },
    { label: "Results",      path: "/results",       icon: Award },
    { label: "Points Table", path: "/points-table",  icon: Trophy },
    { label: "Teams",        path: "/teams",         icon: Users },
    { label: "Player Stats", path: "/stats",         icon: Award },
    { label: "Gallery",      path: "/gallery",       icon: ImageIcon },
    { label: "Sponsors",     path: "/sponsors",      icon: Award },
    { label: "Community",    path: "/community",     icon: Users },
    { label: "Hall of Fame", path: `/hall-of-fame?season=${season.id}`, icon: Award },
  ];

  return (
    <div className="min-h-screen" style={{ background: "radial-gradient(ellipse at top, #0f2247, #050c1a)" }}>
      <Navigation />
      <main className="pt-20 pb-16 container mx-auto px-4">
        <button
          onClick={() => navigate("/archive")}
          className="mb-6 inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm"
        >
          <ArrowLeft size={16} /> Back to Archive
        </button>

        {/* Header */}
        <div className="relative overflow-hidden rounded-3xl border border-[#f0b429]/25 bg-gradient-to-br from-[#123064] via-[#0b1c3d] to-[#050c1a] p-8 md:p-12 mb-8">
          <div
            className="absolute -top-40 -right-40 h-[400px] w-[400px] rounded-full blur-3xl opacity-40"
            style={{ background: `radial-gradient(circle, ${season.accent || "#F9C846"}, transparent 70%)` }}
          />
          <div className="relative">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest border border-[#f0b429]/40 bg-[#f0b429]/15 text-[#f0b429] mb-4">
              {season.status.toUpperCase()} · {season.year}
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-white">{season.title}</h1>
            <p className="mt-3 text-gray-300 max-w-xl">{season.tagline}</p>

            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl">
              <div className="rounded-xl bg-white/5 border border-white/10 p-3">
                <div className="text-[10px] uppercase text-gray-400 tracking-wider">Champion</div>
                <div className="text-sm font-bold text-white mt-1">{season.champion || "TBD"}</div>
              </div>
              <div className="rounded-xl bg-white/5 border border-white/10 p-3">
                <div className="text-[10px] uppercase text-gray-400 tracking-wider">Runner-up</div>
                <div className="text-sm font-bold text-white mt-1">{season.runnerUp || "TBD"}</div>
              </div>
              <div className="rounded-xl bg-white/5 border border-white/10 p-3">
                <div className="text-[10px] uppercase text-gray-400 tracking-wider">Teams</div>
                <div className="text-sm font-bold text-white mt-1">{season.teamsCount || "—"}</div>
              </div>
              <div className="rounded-xl bg-white/5 border border-white/10 p-3">
                <div className="text-[10px] uppercase text-gray-400 tracking-wider">Matches</div>
                <div className="text-sm font-bold text-white mt-1">{season.matchesCount || "—"}</div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                onClick={() => navigate(`/season/${season.id}`)}
                className="bg-[#f0b429] hover:bg-[#f0b429]/90 text-[#0b1c3d] font-bold rounded-full"
              >
                Explore Season <ArrowRight size={16} className="ml-1" />
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate(`/hall-of-fame?season=${season.id}`)}
                className="border-white/20 bg-white/5 text-white hover:bg-white/10 rounded-full"
              >
                <Award size={16} className="mr-1" /> Season Records
              </Button>
            </div>
          </div>
        </div>

        {/* Quick links */}
        <h2 className="text-xl font-bold text-white mb-4">Explore {season.title}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {quickLinks.map((l) => {
            const Icon = l.icon;
            return (
              <Link
                key={l.label}
                to={l.path}
                onClick={() => setCurrentSeasonId(season.id)}
                className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-4 hover:border-[#f0b429]/40 hover:bg-white/10 transition-all"
              >
                <Icon size={20} className="text-[#f0b429]" />
                <span className="text-xs text-white font-medium text-center">{l.label}</span>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
