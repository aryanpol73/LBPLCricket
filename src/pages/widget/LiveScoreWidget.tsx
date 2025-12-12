import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface LiveMatch {
  id: string;
  team_a: { name: string; short_name: string | null };
  team_b: { name: string; short_name: string | null };
  team_a_score: string | null;
  team_b_score: string | null;
  status: string | null;
}

const LiveScoreWidget = () => {
  const navigate = useNavigate();
  const [isPwa, setIsPwa] = useState(false);
  const [liveMatch, setLiveMatch] = useState<LiveMatch | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const pwaCheck =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as any).standalone === true ||
      new URLSearchParams(window.location.search).get("pwa") === "1";

    setIsPwa(pwaCheck);
  }, []);

  const fetchLiveMatch = async () => {
    try {
      const { data, error } = await supabase
        .from("matches")
        .select(`
          id,
          team_a_score,
          team_b_score,
          status,
          team_a:teams!matches_team_a_id_fkey(name, short_name),
          team_b:teams!matches_team_b_id_fkey(name, short_name)
        `)
        .eq("status", "live")
        .limit(1)
        .single();

      if (error && error.code !== "PGRST116") {
        console.error("Error fetching live match:", error);
      }

      if (data) {
        setLiveMatch({
          id: data.id,
          team_a: data.team_a as { name: string; short_name: string | null },
          team_b: data.team_b as { name: string; short_name: string | null },
          team_a_score: data.team_a_score,
          team_b_score: data.team_b_score,
          status: data.status,
        });
      } else {
        setLiveMatch(null);
      }
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveMatch();

    // Auto-refresh every 8 seconds
    const interval = setInterval(fetchLiveMatch, 8000);

    return () => clearInterval(interval);
  }, []);

  const handleTap = () => {
    if (liveMatch) {
      navigate(`/matches`);
    }
  };

  // Not PWA mode
  if (!isPwa) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center px-4"
        style={{ background: "linear-gradient(to bottom, #0b1c3d, #081428)" }}
      >
        <div 
          className="text-center p-6 rounded-xl border"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            borderColor: "rgba(255, 255, 255, 0.1)",
          }}
        >
          <p className="text-white text-lg font-medium">Widget only available in PWA mode</p>
          <p className="text-gray-400 text-sm mt-2">Install the app to use this feature</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "linear-gradient(to bottom, #0b1c3d, #081428)" }}
    >
      <button
        onClick={handleTap}
        className="w-full max-w-xs transition-transform active:scale-95"
      >
        <div 
          className="rounded-2xl p-5 border"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            borderColor: "rgba(240, 180, 41, 0.3)",
            boxShadow: "0 0 30px rgba(240, 180, 41, 0.1)",
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-white text-sm font-medium tracking-wider">LBPL</span>
            <span className="text-white text-sm">•</span>
            {liveMatch ? (
              <span 
                className="text-sm font-bold animate-pulse"
                style={{ color: "#f0b429" }}
              >
                LIVE
              </span>
            ) : (
              <span className="text-gray-400 text-sm">NO LIVE MATCH</span>
            )}
          </div>

          {loading ? (
            <div className="space-y-3">
              <div className="h-6 bg-white/10 rounded animate-pulse" />
              <div className="h-6 bg-white/10 rounded animate-pulse" />
            </div>
          ) : liveMatch ? (
            <div className="space-y-3">
              {/* Team A */}
              <div className="flex items-center justify-between">
                <span className="text-white font-semibold text-lg">
                  {liveMatch.team_a.short_name || liveMatch.team_a.name}
                </span>
                <span className="text-white font-bold text-lg">
                  {liveMatch.team_a_score || "—"}
                </span>
              </div>

              {/* Team B */}
              <div className="flex items-center justify-between">
                <span className="text-white font-semibold text-lg">
                  {liveMatch.team_b.short_name || liveMatch.team_b.name}
                </span>
                <span className="text-gray-400 font-bold text-lg">
                  {liveMatch.team_b_score || "—"}
                </span>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-400">No live match at the moment</p>
            </div>
          )}

          {/* Footer */}
          <div className="mt-4 pt-3 border-t" style={{ borderColor: "rgba(255, 255, 255, 0.1)" }}>
            <p className="text-gray-500 text-xs text-center">
              Tap for full score →
            </p>
          </div>
        </div>
      </button>
    </div>
  );
};

export default LiveScoreWidget;
