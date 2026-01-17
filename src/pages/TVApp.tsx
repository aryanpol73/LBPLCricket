import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useTVModeContext } from "@/contexts/TVModeContext";
import { TVBottomNav } from "@/components/TVBottomNav";
import lbplLogo from "@/assets/lbpl-logo-new.jpg";

/**
 * TVApp - Dedicated TV layout wrapper
 * This component provides a TV-optimized interface with:
 * - Always visible bottom navigation
 * - Large, remote-friendly UI elements
 * - No browser chrome interference
 */
const TVApp = () => {
  const { enableTVMode } = useTVModeContext();
  const location = useLocation();

  // Auto-enable TV mode when accessing /tv routes
  useEffect(() => {
    enableTVMode();
  }, [enableTVMode]);

  // Get current page name from path
  const getPageName = () => {
    const path = location.pathname.replace("/tv", "").replace("/", "");
    if (!path) return "Home";
    return path.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="min-h-screen bg-gradient-hero" data-tv-app="true">
      {/* TV Header - Always visible */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-[#0A1325] to-[#0A1325]/90 border-b-2 border-secondary/30 backdrop-blur-sm">
        <div className="container mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img 
                src={lbplLogo} 
                alt="LBPL Logo" 
                className="w-16 h-16 rounded-full object-cover border-3 border-secondary/50"
              />
              <div className="flex flex-col">
                <span className="text-3xl font-bold text-white">LBPL</span>
                <span className="text-lg text-secondary font-medium">Season 3 • 2026</span>
              </div>
            </div>
            
            {/* Live indicator */}
            <div className="flex items-center gap-3 px-6 py-3 bg-red-600/20 rounded-full border border-red-500/50">
              <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
              <span className="text-xl text-white font-bold">LBPL TV</span>
            </div>

            {/* Current page indicator */}
            <div className="px-8 py-3 bg-primary/20 rounded-xl border border-primary/50">
              <span className="text-xl text-white font-semibold">
                {getPageName()}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area with proper spacing for TV nav */}
      <main className="pt-28 pb-36">
        <Outlet />
      </main>

      {/* Always visible TV bottom navigation */}
      <TVBottomNav />
    </div>
  );
};

export default TVApp;
