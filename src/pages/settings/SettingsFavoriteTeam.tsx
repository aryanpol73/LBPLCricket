import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Team {
  id: string;
  name: string;
  short_name: string | null;
  logo_url: string | null;
}

const STORAGE_KEY = "lbpl_favorite_team";

const SettingsFavoriteTeam = () => {
  const navigate = useNavigate();
  const [teams, setTeams] = useState<Team[]>([]);
  const [favoriteId, setFavoriteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // PWA-only guard
  useEffect(() => {
    const isPwa =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as any).standalone === true ||
      new URLSearchParams(window.location.search).get("pwa") === "1";
    if (!isPwa) navigate("/", { replace: true });
  }, [navigate]);

  useEffect(() => {
    try {
      setFavoriteId(localStorage.getItem(STORAGE_KEY));
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from("teams")
        .select("id, name, short_name, logo_url")
        .order("name");
      if (cancelled) return;
      if (error) {
        toast.error("Couldn't load teams");
      } else {
        setTeams(data || []);
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSelect = (teamId: string) => {
    if (favoriteId === teamId) {
      // Toggle off
      localStorage.removeItem(STORAGE_KEY);
      setFavoriteId(null);
      toast.success("Favorite team cleared");
    } else {
      localStorage.setItem(STORAGE_KEY, teamId);
      setFavoriteId(teamId);
      toast.success("Favorite team saved");
    }
    if (navigator.vibrate) {
      try { navigator.vibrate(8); } catch { /* noop */ }
    }
  };

  return (
    <div
      className="min-h-screen"
      style={{
        background: "linear-gradient(to bottom, #0b1c3d, #081428)",
        animation: "slideInRight 0.3s ease-out forwards",
      }}
    >
      {/* Header */}
      <div className="sticky top-0 z-50 bg-[#0b1c3d]/95 backdrop-blur-sm border-b border-[#f0b429]/20">
        <div className="flex items-center gap-4 px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-white/10 transition-colors active:scale-95"
            aria-label="Back"
          >
            <ArrowLeft size={24} className="text-white" />
          </button>
          <h1 className="text-xl font-bold text-white">Favorite Team</h1>
        </div>
      </div>

      <div className="px-4 py-6 pb-32 space-y-4">
        <p className="text-gray-400 text-sm leading-relaxed">
          Just for fun — pick the team you cheer for. Stored only on this device.
        </p>

        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 bg-white/5 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="bg-white/5 rounded-xl overflow-hidden border border-white/10">
            {teams.map((team, idx) => {
              const selected = favoriteId === team.id;
              return (
                <button
                  key={team.id}
                  onClick={() => handleSelect(team.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 transition-colors active:scale-[0.98] min-h-[56px] ${
                    idx !== teams.length - 1 ? "border-b border-white/10" : ""
                  } ${selected ? "bg-[#f0b429]/10" : "hover:bg-white/5"}`}
                >
                  <div className="w-10 h-10 rounded-full bg-white/10 overflow-hidden flex items-center justify-center shrink-0">
                    {team.logo_url ? (
                      <img
                        src={team.logo_url}
                        alt={team.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <Heart size={18} className="text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-white font-medium">{team.name}</p>
                    {team.short_name && (
                      <p className="text-gray-500 text-xs">{team.short_name}</p>
                    )}
                  </div>
                  {selected && (
                    <div className="w-7 h-7 rounded-full bg-[#f0b429] flex items-center justify-center shrink-0">
                      <Check size={16} className="text-[#0b1c3d]" strokeWidth={3} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {favoriteId && (
          <button
            onClick={() => {
              localStorage.removeItem(STORAGE_KEY);
              setFavoriteId(null);
              toast.success("Favorite team cleared");
            }}
            className="w-full text-sm text-gray-400 py-3 hover:text-white transition-colors"
          >
            Clear favorite
          </button>
        )}
      </div>

      <style>{`
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};

export default SettingsFavoriteTeam;
