import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Home, Calendar, Users, Menu, Trophy, Image, BarChart3, Award } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface NavItem {
  label: string;
  icon: React.ElementType;
  path: string;
}

const navItems: NavItem[] = [
  { label: "Home", icon: Home, path: "/" },
  { label: "Matches", icon: Calendar, path: "/matches" },
  { label: "Community", icon: Users, path: "/community" },
];

const moreItems: NavItem[] = [
  { label: "Points Table", icon: Trophy, path: "/points-table" },
  { label: "Results", icon: Award, path: "/results" },
  { label: "Teams", icon: Users, path: "/teams" },
  { label: "Stats", icon: BarChart3, path: "/stats" },
  { label: "Gallery", icon: Image, path: "/gallery" },
];

export default function PwaBottomNav() {
  const [isPwa, setIsPwa] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const checkPwaMode = () => {
      // Check URL override for testing
      const urlParams = new URLSearchParams(window.location.search);
      const pwaOverride = urlParams.get("pwa") === "1";

      // Check if running as standalone PWA
      const isStandalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as any).standalone === true;

      setIsPwa(pwaOverride || isStandalone);
    };

    checkPwaMode();

    // Listen for display mode changes
    const mediaQuery = window.matchMedia("(display-mode: standalone)");
    const handleChange = () => checkPwaMode();
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    // Add/remove body padding when PWA mode changes
    if (isPwa) {
      document.body.style.paddingBottom = "calc(64px + env(safe-area-inset-bottom, 0px))";
    } else {
      document.body.style.paddingBottom = "";
    }

    return () => {
      document.body.style.paddingBottom = "";
    };
  }, [isPwa]);

  if (!isPwa) return null;

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const isMoreActive = moreItems.some((item) => location.pathname.startsWith(item.path));

  const handleNavClick = (path: string) => {
    navigate(path);
    setMoreOpen(false);
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50"
      style={{
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
    >
      {/* Upper shadow gradient */}
      <div className="absolute inset-x-0 -top-4 h-4 bg-gradient-to-t from-[#081428]/80 to-transparent pointer-events-none" />

      {/* Main nav bar */}
      <div
        className="flex items-center justify-around px-2 py-2"
        style={{
          background: "linear-gradient(to bottom, #0b1c3d, #081428)",
          boxShadow: "0 -4px 20px rgba(0, 0, 0, 0.4)",
        }}
      >
        {navItems.map((item) => {
          const active = isActive(item.path);
          const Icon = item.icon;

          return (
            <button
              key={item.path}
              onClick={() => handleNavClick(item.path)}
              className={`flex flex-col items-center justify-center flex-1 py-2 transition-all duration-200 ${
                active ? "scale-110" : "scale-100"
              }`}
            >
              <Icon
                size={22}
                className={`transition-colors duration-200 ${
                  active ? "text-[#f0b429]" : "text-gray-400"
                }`}
                strokeWidth={active ? 2.5 : 2}
              />
              <span
                className={`text-[10px] mt-1 font-medium transition-colors duration-200 ${
                  active ? "text-[#f0b429]" : "text-gray-400"
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}

        {/* More button with sheet */}
        <Sheet open={moreOpen} onOpenChange={setMoreOpen}>
          <SheetTrigger asChild>
            <button
              className={`flex flex-col items-center justify-center flex-1 py-2 transition-all duration-200 ${
                isMoreActive ? "scale-110" : "scale-100"
              }`}
            >
              <Menu
                size={22}
                className={`transition-colors duration-200 ${
                  isMoreActive ? "text-[#f0b429]" : "text-gray-400"
                }`}
                strokeWidth={isMoreActive ? 2.5 : 2}
              />
              <span
                className={`text-[10px] mt-1 font-medium transition-colors duration-200 ${
                  isMoreActive ? "text-[#f0b429]" : "text-gray-400"
                }`}
              >
                More
              </span>
            </button>
          </SheetTrigger>
          <SheetContent
            side="bottom"
            className="border-t border-[#f0b429]/20 rounded-t-2xl"
            style={{
              background: "linear-gradient(to bottom, #0b1c3d, #081428)",
              paddingBottom: "calc(80px + env(safe-area-inset-bottom, 0px))",
            }}
          >
            <div className="grid grid-cols-3 gap-4 pt-4">
              {moreItems.map((item) => {
                const active = isActive(item.path);
                const Icon = item.icon;

                return (
                  <button
                    key={item.path}
                    onClick={() => handleNavClick(item.path)}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl transition-all duration-200 ${
                      active
                        ? "bg-[#f0b429]/10 scale-105"
                        : "bg-white/5 hover:bg-white/10"
                    }`}
                  >
                    <Icon
                      size={24}
                      className={`transition-colors duration-200 ${
                        active ? "text-[#f0b429]" : "text-gray-300"
                      }`}
                      strokeWidth={active ? 2.5 : 2}
                    />
                    <span
                      className={`text-xs mt-2 font-medium transition-colors duration-200 ${
                        active ? "text-[#f0b429]" : "text-gray-300"
                      }`}
                    >
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
