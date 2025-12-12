import { useEffect, useState, useRef, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Home, Calendar, Users, Menu, Trophy, Image, BarChart3, Award } from "lucide-react";
import MoreSheet from "./MoreSheet";

interface NavItem {
  label: string;
  icon: React.ElementType;
  path: string;
  hasNotification?: boolean;
}

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
  const [hasCommunityAlerts, setHasCommunityAlerts] = useState(true); // Toggle this based on actual alerts
  const location = useLocation();
  const navigate = useNavigate();
  
  // Swipe detection refs
  const navRef = useRef<HTMLElement>(null);
  const touchStartY = useRef(0);
  const touchStartTime = useRef(0);

  const navItems: NavItem[] = [
    { label: "Home", icon: Home, path: "/" },
    { label: "Matches", icon: Calendar, path: "/matches" },
    { label: "Community", icon: Users, path: "/community", hasNotification: hasCommunityAlerts },
  ];

  useEffect(() => {
    const checkPwaMode = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const pwaOverride = urlParams.get("pwa") === "1";
      const isStandalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as any).standalone === true;
      setIsPwa(pwaOverride || isStandalone);
    };

    checkPwaMode();

    const mediaQuery = window.matchMedia("(display-mode: standalone)");
    const handleChange = () => checkPwaMode();
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    if (isPwa) {
      document.body.style.paddingBottom = "calc(64px + env(safe-area-inset-bottom, 0px))";
    } else {
      document.body.style.paddingBottom = "";
    }

    return () => {
      document.body.style.paddingBottom = "";
    };
  }, [isPwa]);

  // Swipe-up gesture to open More sheet
  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (!isPwa) return;
    touchStartY.current = e.touches[0].clientY;
    touchStartTime.current = Date.now();
  }, [isPwa]);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (!isPwa) return;
    
    const touchEndY = e.changedTouches[0].clientY;
    const deltaY = touchStartY.current - touchEndY;
    const deltaTime = Date.now() - touchStartTime.current;
    
    // Swipe up: open sheet (minimum 50px swipe, within 300ms)
    if (deltaY > 50 && deltaTime < 300 && !moreOpen) {
      triggerHaptic();
      setMoreOpen(true);
    }
  }, [isPwa, moreOpen]);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav || !isPwa) return;

    nav.addEventListener("touchstart", handleTouchStart, { passive: true });
    nav.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      nav.removeEventListener("touchstart", handleTouchStart);
      nav.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isPwa, handleTouchStart, handleTouchEnd]);

  const triggerHaptic = useCallback(() => {
    if (!isPwa) return;
    try {
      if (navigator.vibrate) {
        navigator.vibrate(10);
      }
    } catch {
      // Ignore if vibration not supported
    }
  }, [isPwa]);

  if (!isPwa) return null;

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const isMoreActive = moreItems.some((item) => location.pathname.startsWith(item.path));

  const handleNavClick = (path: string) => {
    triggerHaptic();
    navigate(path);
    setMoreOpen(false);
  };

  const handleMoreClick = () => {
    triggerHaptic();
    setMoreOpen(true);
  };

  return (
    <>
      <nav
        ref={navRef}
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
                className={`relative flex flex-col items-center justify-center flex-1 py-2 transition-all duration-200 ${
                  active ? "scale-110" : "scale-100"
                }`}
              >
                <div className="relative">
                  <Icon
                    size={22}
                    className={`transition-colors duration-200 ${
                      active ? "text-[#f0b429]" : "text-gray-400"
                    }`}
                    strokeWidth={active ? 2.5 : 2}
                  />
                  {/* Notification dot */}
                  {item.hasNotification && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  )}
                </div>
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

          {/* More button */}
          <button
            onClick={handleMoreClick}
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
        </div>
      </nav>

      {/* More Sheet with spring animation */}
      <MoreSheet
        open={moreOpen}
        onOpenChange={setMoreOpen}
        items={moreItems}
        isActive={isActive}
        onItemClick={handleNavClick}
        triggerHaptic={triggerHaptic}
        isPwa={isPwa}
      />
    </>
  );
}
