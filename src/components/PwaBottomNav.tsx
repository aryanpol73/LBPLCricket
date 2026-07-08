import { useEffect, useState, useRef, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Home, Calendar, Users, Menu, Trophy, Image, BarChart3, Award, Crown, Archive as ArchiveIcon } from "lucide-react";
import MoreSheet from "./MoreSheet";

interface NavItem {
  label: string;
  icon: React.ElementType;
  path: string;
  hasNotification?: boolean;
}

const moreItems: NavItem[] = [
  { label: "Hall of Fame", icon: Crown, path: "/hall-of-fame" },
  { label: "Archive", icon: ArchiveIcon, path: "/archive" },
  { label: "Points Table", icon: Trophy, path: "/points-table" },
  { label: "Results", icon: Award, path: "/results" },
  { label: "Teams", icon: Users, path: "/teams" },
  { label: "Stats", icon: BarChart3, path: "/stats" },
  { label: "Gallery", icon: Image, path: "/gallery" },
  { label: "Sponsors", icon: Award, path: "/sponsors" },
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
      // Also show on any mobile-sized viewport so Android/iOS web visitors
      // get the same bottom navigation as installed PWA users.
      const isMobileViewport = window.matchMedia("(max-width: 767px)").matches;

      setIsPwa(pwaOverride || isStandalone || isMobileViewport);
    };

    checkPwaMode();

    const standaloneMq = window.matchMedia("(display-mode: standalone)");
    const mobileMq = window.matchMedia("(max-width: 767px)");
    const handleChange = () => checkPwaMode();
    standaloneMq.addEventListener("change", handleChange);
    mobileMq.addEventListener("change", handleChange);

    return () => {
      standaloneMq.removeEventListener("change", handleChange);
      mobileMq.removeEventListener("change", handleChange);
    };
  }, []);

  useEffect(() => {
    if (isPwa) {
      // Account for footer bar (28px) + nav bar (64px) + safe area
      document.body.style.paddingBottom = "calc(92px + env(safe-area-inset-bottom, 0px))";
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
      >
        {/* Upper shadow gradient */}
        <div className="absolute inset-x-0 -top-6 h-6 bg-gradient-to-t from-[#050d18]/80 to-transparent pointer-events-none" />

        {/* Main nav bar — modern glass + subtle gold top border */}
        <div
          className="relative flex items-stretch justify-around px-2 pt-2 pb-1.5 border-t border-[#f0b429]/15"
          style={{
            background:
              "linear-gradient(180deg, rgba(11,28,61,0.92) 0%, rgba(8,20,40,0.96) 100%)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            boxShadow: "0 -8px 32px rgba(0, 0, 0, 0.5)",
          }}
        >
          {navItems.map((item) => {
            const active = isActive(item.path);
            const Icon = item.icon;

            return (
              <button
                key={item.path}
                onClick={() => handleNavClick(item.path)}
                aria-label={item.label}
                aria-current={active ? "page" : undefined}
                className="group relative flex flex-col items-center justify-center flex-1 min-h-[52px] py-1.5 transition-transform duration-200 active:scale-90"
              >
                {/* Active pill background */}
                <span
                  className={`absolute top-1 h-9 w-12 rounded-full transition-all duration-300 ${
                    active
                      ? "bg-[#f0b429]/15 scale-100 opacity-100"
                      : "bg-transparent scale-75 opacity-0"
                  }`}
                />
                <div className="relative z-10">
                  <Icon
                    size={22}
                    className={`transition-colors duration-200 ${
                      active ? "text-[#f0b429]" : "text-gray-400 group-hover:text-gray-200"
                    }`}
                    strokeWidth={active ? 2.5 : 2}
                  />
                  {item.hasNotification && (
                    <span className="absolute -top-1 -right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-[#0b1c3d] animate-pulse" />
                  )}
                </div>
                <span
                  className={`relative z-10 text-[10px] mt-0.5 font-medium transition-colors duration-200 ${
                    active ? "text-[#f0b429]" : "text-gray-400 group-hover:text-gray-200"
                  }`}
                >
                  {item.label}
                </span>
                {/* Active indicator dot */}
                <span
                  className={`absolute -bottom-0.5 h-1 w-1 rounded-full bg-[#f0b429] transition-all duration-300 ${
                    active ? "opacity-100 scale-100" : "opacity-0 scale-0"
                  }`}
                />
              </button>
            );
          })}

          {/* More button */}
          <button
            onClick={handleMoreClick}
            aria-label="More"
            className="group relative flex flex-col items-center justify-center flex-1 min-h-[52px] py-1.5 transition-transform duration-200 active:scale-90"
          >
            <span
              className={`absolute top-1 h-9 w-12 rounded-full transition-all duration-300 ${
                isMoreActive || moreOpen
                  ? "bg-[#f0b429]/15 scale-100 opacity-100"
                  : "bg-transparent scale-75 opacity-0"
              }`}
            />
            <Menu
              size={22}
              className={`relative z-10 transition-colors duration-200 ${
                isMoreActive || moreOpen ? "text-[#f0b429]" : "text-gray-400 group-hover:text-gray-200"
              }`}
              strokeWidth={isMoreActive || moreOpen ? 2.5 : 2}
            />
            <span
              className={`relative z-10 text-[10px] mt-0.5 font-medium transition-colors duration-200 ${
                isMoreActive || moreOpen ? "text-[#f0b429]" : "text-gray-400 group-hover:text-gray-200"
              }`}
            >
              More
            </span>
            <span
              className={`absolute -bottom-0.5 h-1 w-1 rounded-full bg-[#f0b429] transition-all duration-300 ${
                isMoreActive || moreOpen ? "opacity-100 scale-100" : "opacity-0 scale-0"
              }`}
            />
          </button>
        </div>

        {/* Developer Credit Bar */}
        <div
          className="py-1.5 border-t border-border/20"
          style={{
            background: "linear-gradient(to bottom, #081220, #050d18)",
            paddingBottom: "env(safe-area-inset-bottom, 0px)",
          }}
        >
          <p className="text-center text-[11px] text-muted-foreground font-medium tracking-wide">
            Designed & Developed by{" "}
            <span className="text-[#F9C846] font-semibold">Aryan Pol</span>
          </p>
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
