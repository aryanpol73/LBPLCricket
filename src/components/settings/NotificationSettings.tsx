import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Bell, MessageCircle, Megaphone, AlertTriangle } from "lucide-react";
import { useNotificationSettings } from "@/hooks/useNotificationSettings";
import { Switch } from "@/components/ui/switch";
import { isSmartTV } from "@/hooks/useTVMode";

const NotificationSettings = () => {
  const navigate = useNavigate();
  const { settings, updateSetting, permission, isPermissionDenied } = useNotificationSettings();
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("dark");

  // Check if PWA mode or Smart TV and get theme
  useEffect(() => {
    const isPwa =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as any).standalone === true ||
      new URLSearchParams(window.location.search).get("pwa") === "1";

    // Allow access in PWA mode OR on Smart TV
    if (!isPwa && !isSmartTV()) {
      navigate("/", { replace: true });
    }

    // Get current theme
    const isDark = document.documentElement.classList.contains("dark");
    setResolvedTheme(isDark ? "dark" : "light");
  }, [navigate]);

  const notifications = [
    {
      key: "matchReminders" as const,
      icon: Bell,
      label: "Match Reminders",
      description: "Get notified before matches start",
    },
    {
      key: "communityAlerts" as const,
      icon: MessageCircle,
      label: "Community Alerts",
      description: "New posts and replies in community",
    },
    {
      key: "generalAlerts" as const,
      icon: Megaphone,
      label: "General Alerts",
      description: "League updates and announcements",
    },
  ];

  const handleToggle = async (key: keyof typeof settings) => {
    const newValue = !settings[key];
    await updateSetting(key, newValue);
  };

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
            Notifications
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 space-y-6 pb-24">
        {/* Permission Warning */}
        {isPermissionDenied && (
          <div 
            className="rounded-xl p-4 border flex items-start gap-3"
            style={{
              backgroundColor: "rgba(239, 68, 68, 0.1)",
              borderColor: "rgba(239, 68, 68, 0.3)",
            }}
          >
            <AlertTriangle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-500 font-medium text-sm">Notifications Blocked</p>
              <p className={`text-sm mt-1 ${resolvedTheme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                You've blocked notifications. Please enable them in your device settings to receive alerts.
              </p>
            </div>
          </div>
        )}

        <div>
          <h2 
            className="text-sm font-semibold uppercase tracking-wider mb-3 px-1"
            style={{ color: "#f0b429" }}
          >
            Push Notifications
          </h2>
          <div 
            className="rounded-xl overflow-hidden border"
            style={{
              backgroundColor: resolvedTheme === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.02)",
              borderColor: resolvedTheme === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
            }}
          >
            {notifications.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.key}
                  className={`flex items-center gap-4 px-4 py-4 ${
                    index !== notifications.length - 1 ? "border-b" : ""
                  }`}
                  style={{
                    borderColor: resolvedTheme === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
                    opacity: isPermissionDenied ? 0.5 : 1,
                  }}
                >
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: "rgba(240, 180, 41, 0.1)" }}
                  >
                    <Icon size={20} style={{ color: "#f0b429" }} />
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium ${resolvedTheme === "dark" ? "text-white" : "text-gray-900"}`}>
                      {item.label}
                    </p>
                    <p className={resolvedTheme === "dark" ? "text-gray-400" : "text-gray-600"} style={{ fontSize: "0.875rem" }}>
                      {item.description}
                    </p>
                  </div>
                  <Switch
                    checked={settings[item.key]}
                    onCheckedChange={() => handleToggle(item.key)}
                    disabled={isPermissionDenied}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Status Info */}
        <div 
          className="rounded-xl p-4 border"
          style={{
            backgroundColor: resolvedTheme === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.02)",
            borderColor: resolvedTheme === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
          }}
        >
          <p className={`text-sm ${resolvedTheme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
            Permission status: {" "}
            <span 
              className="font-medium"
              style={{ 
                color: permission === "granted" ? "#22c55e" : permission === "denied" ? "#ef4444" : "#f0b429" 
              }}
            >
              {permission === "granted" ? "Allowed" : permission === "denied" ? "Blocked" : "Not set"}
            </span>
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

export default NotificationSettings;
