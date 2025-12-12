import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const SettingsRules = () => {
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
          <h1 className="text-xl font-bold text-white">Rules & Regulations</h1>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 pb-24 space-y-4">
        {[1, 2, 3, 4, 5].map((section) => (
          <div
            key={section}
            className="bg-white/5 rounded-xl p-5 border border-white/10"
          >
            <h3 className="text-lg font-semibold text-[#f0b429] mb-3">
              Section {section}
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do 
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim 
              ad minim veniam, quis nostrud exercitation.
            </p>
          </div>
        ))}

        <div className="text-center pt-4">
          <p className="text-sm text-gray-400">
            Full rules and regulations coming soon...
          </p>
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

export default SettingsRules;
