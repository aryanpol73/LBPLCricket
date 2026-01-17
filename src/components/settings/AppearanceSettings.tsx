import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Sun, Moon, Monitor, Check } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { isSmartTV } from "@/hooks/useTVMode";

type Theme = "light" | "dark" | "system";

const themes: { value: Theme; label: string; icon: typeof Sun; description: string }[] = [
  { value: "light", label: "Light", icon: Sun, description: "Light background with dark text" },
  { value: "dark", label: "Dark", icon: Moon, description: "Dark background with light text" },
  { value: "system", label: "System", icon: Monitor, description: "Follows your device settings" },
];

const AppearanceSettings = () => {
  const navigate = useNavigate();
  const { theme, setTheme, resolvedTheme } = useTheme();

  // Check if PWA mode or Smart TV
  useEffect(() => {
    const isPwa =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as any).standalone === true ||
      new URLSearchParams(window.location.search).get("pwa") === "1";

    // Allow access in PWA mode OR on Smart TV
    if (!isPwa && !isSmartTV()) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  return (
    <div
      className="min-h-screen"
      style={{
        background: resolvedTheme === "dark" 
          ? "linear-gradient(to bottom, #0b1c3d, #081428)" 
          : "linear-gradient(to bottom, #f8fafc, #e2e8f0)",
        animation: "slideInRight 0.3s ease-out forwards",
      }}
    >
      {/* Header */}
      <div 
        className="sticky top-0 z-50 backdrop-blur-sm border-b"
        style={{
          backgroundColor: resolvedTheme === "dark" ? "rgba(11, 28, 61, 0.95)" : "rgba(248, 250, 252, 0.95)",
          borderColor: resolvedTheme === "dark" ? "rgba(240, 180, 41, 0.2)" : "rgba(0, 0, 0, 0.1)",
        }}
      >
        <div className="flex items-center gap-4 px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <ArrowLeft size={24} className={resolvedTheme === "dark" ? "text-white" : "text-gray-900"} />
          </button>
          <h1 className={`text-xl font-bold ${resolvedTheme === "dark" ? "text-white" : "text-gray-900"}`}>
            Appearance
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 space-y-6 pb-24">
        <div>
          <h2 
            className="text-sm font-semibold uppercase tracking-wider mb-3 px-1"
            style={{ color: "#f0b429" }}
          >
            Theme
          </h2>
          <div 
            className="rounded-xl overflow-hidden border"
            style={{
              backgroundColor: resolvedTheme === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.02)",
              borderColor: resolvedTheme === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
            }}
          >
            {themes.map((t, index) => {
              const Icon = t.icon;
              const isActive = theme === t.value;
              return (
                <button
                  key={t.value}
                  onClick={() => setTheme(t.value)}
                  className={`w-full flex items-center gap-4 px-4 py-4 transition-colors ${
                    index !== themes.length - 1 ? "border-b" : ""
                  }`}
                  style={{
                    borderColor: resolvedTheme === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
                    backgroundColor: isActive 
                      ? resolvedTheme === "dark" ? "rgba(240, 180, 41, 0.1)" : "rgba(240, 180, 41, 0.1)"
                      : "transparent",
                  }}
                >
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: "rgba(240, 180, 41, 0.1)" }}
                  >
                    <Icon size={20} style={{ color: "#f0b429" }} />
                  </div>
                  <div className="flex-1 text-left">
                    <p className={`font-medium ${resolvedTheme === "dark" ? "text-white" : "text-gray-900"}`}>
                      {t.label}
                    </p>
                    <p className={resolvedTheme === "dark" ? "text-gray-400" : "text-gray-600"} style={{ fontSize: "0.875rem" }}>
                      {t.description}
                    </p>
                  </div>
                  {isActive && (
                    <Check size={20} style={{ color: "#f0b429" }} />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Current Theme Info */}
        <div 
          className="rounded-xl p-4 border"
          style={{
            backgroundColor: resolvedTheme === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.02)",
            borderColor: resolvedTheme === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
          }}
        >
          <p className={`text-sm ${resolvedTheme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
            Currently using: <span style={{ color: "#f0b429" }} className="font-medium">{resolvedTheme === "dark" ? "Dark" : "Light"} theme</span>
            {theme === "system" && " (System)"}
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

export default AppearanceSettings;
