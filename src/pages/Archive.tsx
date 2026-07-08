import { useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { SEASONS } from "@/config/seasons";
import SeasonCard from "@/components/season/SeasonCard";
import { Trophy } from "lucide-react";

export default function Archive() {
  useEffect(() => { document.title = "Tournament Archive · LBPL"; }, []);
  const completed = SEASONS.filter((s) => s.status === "completed");
  const upcoming = SEASONS.filter((s) => s.status !== "completed");

  return (
    <div className="min-h-screen" style={{ background: "radial-gradient(ellipse at top, #0f2247, #050c1a)" }}>
      <Navigation />
      <main className="pt-20 pb-16 container mx-auto px-4">
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-2">
            <Trophy className="text-[#f0b429]" size={30} />
            <h1 className="text-4xl md:text-5xl font-bold text-white">Tournament Archive</h1>
          </div>
          <p className="text-gray-400">Every LBPL season, preserved forever.</p>
        </div>

        <section className="mb-12">
          <h2 className="text-xl font-bold text-white mb-4">Completed Seasons</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {completed.map((s) => <SeasonCard key={s.id} season={s} featured />)}
            {completed.length === 0 && <p className="text-gray-500">No completed seasons yet.</p>}
          </div>
        </section>

        {upcoming.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-white mb-4">Live & Upcoming</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {upcoming.map((s) => <SeasonCard key={s.id} season={s} featured />)}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
