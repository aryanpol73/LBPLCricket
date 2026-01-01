import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Code, User, Lightbulb, Layers } from "lucide-react";

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
            <p className="text-[#f0b429] font-medium mt-1">AI Product Developer</p>
          </div>

          {/* Info Cards */}
          <div className="space-y-4">
            {/* About Me Card */}
            <div className="flex items-start gap-4 p-4 bg-white/5 rounded-lg">
              <User size={20} className="text-[#f0b429] mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-white font-medium mb-1">About Me</p>
                <p className="text-gray-300 text-sm">
                  I enjoy building apps and exploring AI whenever I can, and I like turning small ideas into real projects.
                </p>
              </div>
            </div>

            {/* Project Purpose Card */}
            <div className="flex items-start gap-4 p-4 bg-white/5 rounded-lg">
              <Lightbulb size={20} className="text-[#f0b429] mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-white font-medium mb-1">Project Purpose</p>
                <p className="text-gray-300 text-sm">
                  The LBPL Official App was created to bring league updates, teams, fixtures, results, and community features into one smooth platform.
                </p>
              </div>
            </div>

            {/* Tech Stack Card */}
            <div className="flex items-start gap-4 p-4 bg-white/5 rounded-lg">
              <Layers size={20} className="text-[#f0b429] mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-white font-medium mb-1">Tech Stack</p>
                <p className="text-gray-300 text-sm">
                  TypeScript • React • PWA • Supabase • TailwindCSS • AI APIs • Node.js • Figma
                </p>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="mt-6 pt-6 border-t border-white/10 text-center space-y-3">
            <p className="text-sm text-gray-300">📧 Contact: aryan.pol737@gmail.com</p>
            <a
              href="https://www.linkedin.com/in/aryanpol0305"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#0077B5] hover:bg-[#006699] text-white text-sm font-medium rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              Connect on LinkedIn
            </a>
          </div>

          {/* App Version */}
          <div className="mt-4 text-center">
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
