import { SeasonConfig } from "@/config/seasons";
import { Trophy, Users, Calendar, Sparkles, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSeason } from "@/context/SeasonContext";

interface Props {
  season: SeasonConfig;
  featured?: boolean;
}

const statusMeta: Record<string, { label: string; className: string; dot: string }> = {
  live:      { label: "LIVE",      className: "bg-teal-500/20 text-teal-300 border-teal-400/40",  dot: "bg-teal-400 animate-pulse" },
  completed: { label: "COMPLETED", className: "bg-[#f0b429]/15 text-[#f0b429] border-[#f0b429]/40", dot: "bg-[#f0b429]" },
  upcoming:  { label: "UPCOMING",  className: "bg-white/10 text-gray-300 border-white/20",         dot: "bg-gray-400" },
};

export default function SeasonCard({ season, featured }: Props) {
  const navigate = useNavigate();
  const { setCurrentSeasonId } = useSeason();
  const s = statusMeta[season.status];

  const handleEnter = () => {
    setCurrentSeasonId(season.id);
    if (season.status === "completed") {
      navigate(`/archive/${season.id}`);
    } else if (season.isDataConnected) {
      navigate(`/season/${season.id}`);
    } else {
      navigate(`/season/${season.id}`);
    }
  };

  return (
    <button
      onClick={handleEnter}
      className={`group relative text-left overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#0f2247] via-[#0b1c3d] to-[#050f22] transition-all duration-500 hover:border-[#f0b429]/40 hover:-translate-y-1 hover:shadow-[0_20px_60px_-20px_rgba(240,180,41,0.4)] ${
        featured ? "w-full min-h-[280px] md:min-h-[340px]" : "w-[260px] md:w-[300px] min-h-[220px]"
      }`}
    >
      {/* Decorative accent */}
      <div
        className="absolute -top-20 -right-20 h-56 w-56 rounded-full blur-3xl opacity-30 group-hover:opacity-60 transition-opacity"
        style={{ background: `radial-gradient(circle, ${season.accent || "#F9C846"}, transparent 70%)` }}
      />

      <div className="relative flex flex-col h-full p-5 md:p-6">
        {/* Status pill */}
        <div className="flex items-center justify-between mb-4">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider border ${s.className}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
            {s.label}
          </span>
          <span className="text-xs text-gray-400 font-medium">{season.year}</span>
        </div>

        {/* Title */}
        <h3 className={`font-bold text-white leading-tight ${featured ? "text-4xl md:text-5xl" : "text-2xl"}`}>
          {season.title}
        </h3>
        {season.tagline && (
          <p className="mt-1.5 text-sm text-gray-400 line-clamp-2">{season.tagline}</p>
        )}

        {/* Champion (if completed) */}
        {season.status === "completed" && season.champion && (
          <div className="mt-4 flex items-center gap-2 text-sm">
            <Trophy size={16} className="text-[#f0b429]" />
            <span className="text-gray-300">Champion:</span>
            <span className="text-white font-semibold">{season.champion}</span>
          </div>
        )}

        {/* Stats row */}
        <div className="mt-auto pt-5 flex items-center gap-4 text-xs text-gray-400">
          {season.teamsCount ? (
            <span className="flex items-center gap-1"><Users size={13} /> {season.teamsCount} Teams</span>
          ) : null}
          {season.matchesCount ? (
            <span className="flex items-center gap-1"><Calendar size={13} /> {season.matchesCount} Matches</span>
          ) : null}
          {season.status === "upcoming" && (
            <span className="flex items-center gap-1 text-[#f0b429]"><Sparkles size={13} /> Coming Soon</span>
          )}
        </div>

        {/* CTA */}
        <div className="mt-5 flex items-center justify-between">
          <span className="text-sm font-semibold text-[#f0b429] group-hover:translate-x-1 transition-transform">
            {season.status === "completed" ? "Enter Archive →" : season.status === "upcoming" ? "Preview →" : "Enter Season →"}
          </span>
          {season.status === "upcoming" && !season.isDataConnected && (
            <Lock size={14} className="text-gray-500" />
          )}
        </div>
      </div>
    </button>
  );
}
