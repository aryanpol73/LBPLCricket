import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Palette, Bell, Info, Code, Smartphone, ChevronRight } from "lucide-react";

const SettingsHome = () => {
  const navigate = useNavigate();

  // Check if PWA mode
  useEffect(() => {
    const isPwa =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as any).standalone === true ||
      new URLSearchParams(window.location.search).get("pwa") === "1";

    if (!isPwa) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  const sections = [
    {
      title: "Preferences",
      items: [
        { icon: Palette, label: "Appearance", description: "Theme, colors, display", path: null },
        { icon: Bell, label: "Notifications", description: "Alerts and updates", path: null },
      ],
    },
    {
      title: "League Info",
      items: [
        { icon: Info, label: "About LBPL", description: "League information", path: "/settings/about" },
        { icon: Info, label: "Rules & Regulations", description: "Tournament rules", path: "/settings/rules" },
      ],
    },
    {
      title: "App Info",
      items: [
        { icon: Code, label: "Developer Info", description: "About the developer", path: "/settings/developer" },
      ],
    },
    {
      title: "PWA Controls",
      items: [
        { icon: Smartphone, label: "App Settings", description: "PWA-specific options", path: null },
      ],
    },
  ];

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
          <h1 className="text-xl font-bold text-white">Settings</h1>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 space-y-6 pb-24">
        {sections.map((section) => (
          <div key={section.title}>
            <h2 className="text-sm font-semibold text-[#f0b429] uppercase tracking-wider mb-3 px-1">
              {section.title}
            </h2>
            <div className="bg-white/5 rounded-xl overflow-hidden border border-white/10">
              {section.items.map((item, index) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    onClick={() => item.path && navigate(item.path)}
                    disabled={!item.path}
                    className={`w-full flex items-center gap-4 px-4 py-4 hover:bg-white/5 transition-colors ${
                      index !== section.items.length - 1 ? "border-b border-white/10" : ""
                    } ${!item.path ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <div className="w-10 h-10 rounded-full bg-[#f0b429]/10 flex items-center justify-center">
                      <Icon size={20} className="text-[#f0b429]" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-white font-medium">{item.label}</p>
                      <p className="text-gray-400 text-sm">{item.description}</p>
                    </div>
                    {item.path && <ChevronRight size={20} className="text-gray-500" />}
                    {!item.path && (
                      <span className="text-xs text-gray-500 bg-white/10 px-2 py-1 rounded">
                        Coming Soon
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
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

export default SettingsHome;
