import { useState } from "react";
import { Home, Calendar, Trophy, Users, BarChart3, Image, MessageCircle } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTVModeContext } from "@/contexts/TVModeContext";

const navItems = [
  { path: "/tv", label: "Home", icon: Home },
  { path: "/tv/matches", label: "Matches", icon: Calendar },
  { path: "/tv/points-table", label: "Points", icon: Trophy },
  { path: "/tv/results", label: "Results", icon: BarChart3 },
  { path: "/tv/teams", label: "Teams", icon: Users },
  { path: "/tv/stats", label: "Stats", icon: BarChart3 },
  { path: "/tv/gallery", label: "Gallery", icon: Image },
];

export const TVBottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isTVMode } = useTVModeContext();
  const [focusedIndex, setFocusedIndex] = useState(0);

  if (!isTVMode) return null;

  const isActive = (path: string) => {
    if (path === "/tv") return location.pathname === "/tv" || location.pathname === "/tv/";
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-[#0A1325] to-[#0A1325]/95 border-t-2 border-secondary/30 backdrop-blur-sm tv-bottom-nav">
      <div className="container mx-auto px-8">
        <div className="flex items-center justify-center gap-4 py-6">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                onFocus={() => setFocusedIndex(index)}
                className={`
                  tv-focusable flex flex-col items-center gap-3 px-8 py-4 rounded-2xl
                  transition-all duration-300 min-w-[120px]
                  ${active 
                    ? "bg-secondary/20 text-secondary scale-110 shadow-lg shadow-secondary/30 border-2 border-secondary/50" 
                    : "text-white/70 hover:text-white hover:bg-white/10 border-2 border-transparent"
                  }
                  focus:outline-none focus:ring-4 focus:ring-secondary/50 focus:scale-110
                `}
              >
                <Icon size={36} className={active ? "text-secondary" : ""} />
                <span className={`text-lg font-bold ${active ? "text-secondary" : ""}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Remote control hint bar */}
      <div className="bg-black/40 py-2 border-t border-white/10">
        <div className="container mx-auto px-8">
          <div className="flex items-center justify-center gap-8 text-white/60 text-base">
            <span className="flex items-center gap-2">
              <kbd className="px-3 py-1 bg-white/10 rounded-lg text-white font-mono">←</kbd>
              <kbd className="px-3 py-1 bg-white/10 rounded-lg text-white font-mono">→</kbd>
              Navigate
            </span>
            <span className="flex items-center gap-2">
              <kbd className="px-3 py-1 bg-secondary/30 rounded-lg text-secondary font-mono">OK</kbd>
              Select
            </span>
            <span className="flex items-center gap-2">
              <kbd className="px-3 py-1 bg-white/10 rounded-lg text-white font-mono">↵</kbd>
              Back
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TVBottomNav;
