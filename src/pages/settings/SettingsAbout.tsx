import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const SettingsAbout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const isPwa =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as any).standalone === true ||
      new URLSearchParams(window.location.search).get("pwa") === "1";

    if (!isPwa) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

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
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <ArrowLeft size={24} className="text-white" />
          </button>
          <h1 className="text-xl font-bold text-white">About LBPL</h1>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 pb-24">
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <div className="text-center mb-6">
            <div className="w-20 h-20 mx-auto bg-[#f0b429]/10 rounded-full flex items-center justify-center mb-4">
              <span className="text-3xl font-bold text-[#f0b429]">LBPL</span>
            </div>
            <h2 className="text-2xl font-bold text-white">LBPL Season 3</h2>
            <p className="text-[#f0b429] font-medium mt-1">2026</p>
          </div>

          <div className="space-y-4 text-gray-300">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod 
              tempor incididunt ut labore et dolore magna aliqua.
            </p>
            <p>
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi 
              ut aliquip ex ea commodo consequat.
            </p>
            <p>
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum 
              dolore eu fugiat nulla pariatur.
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-sm text-gray-400 text-center">
              More information coming soon...
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
};

export default SettingsAbout;
