import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Palette, Bell, Info, Code, ChevronRight, Pin, ExternalLink, Share2, Trash2, RefreshCw, HelpCircle, Star, MessageSquare } from "lucide-react";
import { toast } from "sonner";

const SettingsHome = () => {
  const navigate = useNavigate();
  const [showPinInstructions, setShowPinInstructions] = useState(false);

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

  const handlePinWidget = async () => {
    const widgetUrl = `${window.location.origin}/widget/live?pwa=1`;
    
    // Try using Web Share API for "Add to Home Screen" on supported devices
    if (navigator.share) {
      try {
        await navigator.share({
          title: "LBPL Live Score Widget",
          text: "Quick access to live cricket scores",
          url: widgetUrl,
        });
        toast.success("Share the link to add to your home screen!");
      } catch (err) {
        // User cancelled or share failed, show manual instructions
        setShowPinInstructions(true);
      }
    } else {
      // Show manual instructions
      setShowPinInstructions(true);
    }
  };

  const copyWidgetUrl = () => {
    const widgetUrl = `${window.location.origin}/widget/live?pwa=1`;
    navigator.clipboard.writeText(widgetUrl);
    toast.success("Widget URL copied! Open in browser and add to home screen.");
  };

  const handleShareApp = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "LBPL Official App",
          text: "Check out the official LBPL Cricket League app!",
          url: window.location.origin,
        });
      } catch (err) {
        // User cancelled
      }
    } else {
      navigator.clipboard.writeText(window.location.origin);
      toast.success("App link copied to clipboard!");
    }
  };

  const handleClearCache = async () => {
    try {
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
      }
      localStorage.removeItem('lbpl_theme');
      localStorage.removeItem('lbpl_notification_settings');
      toast.success("Cache cleared! Restart app for changes.");
    } catch (err) {
      toast.error("Failed to clear cache");
    }
  };

  const handleRateApp = () => {
    toast.success("Thanks for your support! Rating feature coming soon.", {
      icon: "⭐",
    });
  };

  const handleFeedback = () => {
    window.open("mailto:aryanpol0305@gmail.com?subject=LBPL App Feedback", "_blank");
    toast.success("Opening email client...");
  };

  const handleRefreshApp = () => {
    window.location.reload();
    toast.success("Refreshing app...");
  };

  const sections = [
    {
      title: "Preferences",
      items: [
        { icon: Palette, label: "Appearance", description: "Theme, colors, display", path: "/settings/appearance", action: null },
        { icon: Bell, label: "Notifications", description: "Alerts and updates", path: "/settings/notifications", action: null },
      ],
    },
    {
      title: "League Info",
      items: [
        { icon: Info, label: "About LBPL", description: "League information", path: "/settings/about", action: null },
        { icon: Info, label: "Rules & Regulations", description: "Tournament rules", path: "/settings/rules", action: null },
      ],
    },
    {
      title: "App Info",
      items: [
        { icon: Code, label: "Developer Info", description: "About the developer", path: "/settings/developer", action: null },
      ],
    },
    {
      title: "App Controls",
      items: [
        { icon: Pin, label: "Pin Live Widget", description: "Add score widget to home screen", path: null, action: handlePinWidget },
        { icon: RefreshCw, label: "Refresh App", description: "Reload the application", path: null, action: handleRefreshApp },
        { icon: Trash2, label: "Clear Cache", description: "Clear app data and cache", path: null, action: handleClearCache },
      ],
    },
    {
      title: "Support",
      items: [
        { icon: Share2, label: "Share App", description: "Share LBPL with friends", path: null, action: handleShareApp },
        { icon: Star, label: "Rate App", description: "Rate us on store", path: null, action: handleRateApp },
        { icon: MessageSquare, label: "Send Feedback", description: "Help us improve", path: null, action: handleFeedback },
        { icon: HelpCircle, label: "Help & FAQ", description: "Common questions", path: "/settings/help", action: null },
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
                const isDisabled = !item.path && !item.action;
                return (
                  <button
                    key={item.label}
                    onClick={() => {
                      if (item.action) {
                        item.action();
                      } else if (item.path) {
                        navigate(item.path);
                      }
                    }}
                    disabled={isDisabled}
                    className={`w-full flex items-center gap-4 px-4 py-4 hover:bg-white/5 transition-colors ${
                      index !== section.items.length - 1 ? "border-b border-white/10" : ""
                    } ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <div className="w-10 h-10 rounded-full bg-[#f0b429]/10 flex items-center justify-center">
                      <Icon size={20} className="text-[#f0b429]" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-white font-medium">{item.label}</p>
                      <p className="text-gray-400 text-sm">{item.description}</p>
                    </div>
                    {(item.path || item.action) && <ChevronRight size={20} className="text-gray-500" />}
                    {isDisabled && (
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

      {/* Pin Widget Instructions Modal */}
      {showPinInstructions && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div 
            className="bg-[#0b1c3d] border border-[#f0b429]/30 rounded-2xl p-6 max-w-sm w-full"
            style={{ animation: "slideInRight 0.2s ease-out" }}
          >
            <h3 className="text-lg font-bold text-white mb-2">Pin Live Widget</h3>
            <p className="text-gray-400 text-sm mb-4">
              Add the live score widget to your home screen for quick access:
            </p>
            
            <div className="space-y-3 text-sm text-gray-300 mb-6">
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-[#f0b429]/20 text-[#f0b429] flex items-center justify-center text-xs font-bold shrink-0">1</span>
                <p>Copy the widget URL below</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-[#f0b429]/20 text-[#f0b429] flex items-center justify-center text-xs font-bold shrink-0">2</span>
                <p>Open URL in your browser (Safari/Chrome)</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-[#f0b429]/20 text-[#f0b429] flex items-center justify-center text-xs font-bold shrink-0">3</span>
                <p>Tap <strong>Share</strong> → <strong>Add to Home Screen</strong></p>
              </div>
            </div>

            <button
              onClick={copyWidgetUrl}
              className="w-full flex items-center justify-center gap-2 bg-[#f0b429] text-[#0b1c3d] font-semibold py-3 rounded-xl mb-3 hover:bg-[#f0b429]/90 transition-colors"
            >
              <ExternalLink size={18} />
              Copy Widget URL
            </button>

            <button
              onClick={() => setShowPinInstructions(false)}
              className="w-full text-gray-400 py-2 hover:text-white transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

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
