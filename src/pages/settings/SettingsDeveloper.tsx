import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Code, Github, Mail, Globe } from "lucide-react";

const SettingsDeveloper = () => {
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
          <h1 className="text-xl font-bold text-white">Developer Info</h1>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 pb-24">
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          {/* Developer Profile */}
          <div className="text-center mb-6">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-[#f0b429] to-amber-600 rounded-full flex items-center justify-center mb-4">
              <Code size={40} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">Aryan Pol</h2>
            <p className="text-[#f0b429] font-medium mt-1">Full Stack Developer</p>
          </div>

          {/* Bio */}
          <p className="text-gray-300 text-center mb-6">
            Designed & Developed the LBPL Official App with passion for cricket 
            and modern web technologies.
          </p>

          {/* Links */}
          <div className="space-y-3">
            {[
              { icon: Globe, label: "Website", value: "Coming Soon" },
              { icon: Github, label: "GitHub", value: "Coming Soon" },
              { icon: Mail, label: "Contact", value: "Coming Soon" },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="flex items-center gap-4 p-3 bg-white/5 rounded-lg"
                >
                  <Icon size={20} className="text-[#f0b429]" />
                  <div className="flex-1">
                    <p className="text-white font-medium">{item.label}</p>
                    <p className="text-gray-400 text-sm">{item.value}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* App Version */}
          <div className="mt-6 pt-6 border-t border-white/10 text-center">
            <p className="text-sm text-gray-400">LBPL Official App</p>
            <p className="text-xs text-gray-500 mt-1">Version 1.0.0</p>
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

export default SettingsDeveloper;
