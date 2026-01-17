import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Trophy, Users, Target, Award, Circle } from "lucide-react";
import { isSmartTV } from "@/hooks/useTVMode";

const SettingsRules = () => {
  const navigate = useNavigate();

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
      <div className="px-4 py-6 pb-32 space-y-6">
        
        {/* Tournament Format */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Trophy size={22} className="text-[#f0b429]" />
            <h2 className="text-lg font-bold text-[#f0b429]">Tournament Format</h2>
          </div>
          
          <div className="space-y-3">
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-8 h-8 rounded-full bg-[#f0b429]/20 flex items-center justify-center text-[#f0b429] font-bold text-sm">1</span>
                <h3 className="font-semibold text-white">League 1</h3>
              </div>
              <ul className="space-y-1.5 text-gray-300 text-sm pl-11">
                <li className="flex items-start gap-2"><Circle size={6} className="mt-1.5 text-[#f0b429]" />18 Teams divided into 6 groups</li>
                <li className="flex items-start gap-2"><Circle size={6} className="mt-1.5 text-[#f0b429]" />3 teams per group</li>
                <li className="flex items-start gap-2"><Circle size={6} className="mt-1.5 text-[#f0b429]" />Each team plays 2 matches</li>
                <li className="flex items-start gap-2"><Circle size={6} className="mt-1.5 text-[#f0b429]" />Top 2 from each group advance</li>
              </ul>
            </div>

            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-8 h-8 rounded-full bg-[#f0b429]/20 flex items-center justify-center text-[#f0b429] font-bold text-sm">2</span>
                <h3 className="font-semibold text-white">League 2</h3>
              </div>
              <ul className="space-y-1.5 text-gray-300 text-sm pl-11">
                <li className="flex items-start gap-2"><Circle size={6} className="mt-1.5 text-[#f0b429]" />Top 12 teams compete</li>
                <li className="flex items-start gap-2"><Circle size={6} className="mt-1.5 text-[#f0b429]" />4 groups of 3 teams</li>
                <li className="flex items-start gap-2"><Circle size={6} className="mt-1.5 text-[#f0b429]" />2 matches per team</li>
                <li className="flex items-start gap-2"><Circle size={6} className="mt-1.5 text-[#f0b429]" />Top team per group qualifies</li>
              </ul>
            </div>

            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-8 h-8 rounded-full bg-[#f0b429]/20 flex items-center justify-center text-[#f0b429] font-bold text-sm">SF</span>
                <h3 className="font-semibold text-white">Semi Finals</h3>
              </div>
              <ul className="space-y-1.5 text-gray-300 text-sm pl-11">
                <li className="flex items-start gap-2"><Circle size={6} className="mt-1.5 text-[#f0b429]" />Top 4 teams compete</li>
                <li className="flex items-start gap-2"><Circle size={6} className="mt-1.5 text-[#f0b429]" />2 groups of 2 teams</li>
                <li className="flex items-start gap-2"><Circle size={6} className="mt-1.5 text-[#f0b429]" />Single knockout match</li>
                <li className="flex items-start gap-2"><Circle size={6} className="mt-1.5 text-[#f0b429]" />Winners advance to final</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-[#f0b429]/20 to-[#f0b429]/5 rounded-xl p-4 border border-[#f0b429]/30">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-8 h-8 rounded-full bg-[#f0b429] flex items-center justify-center">
                  <Trophy size={16} className="text-[#0b1c3d]" />
                </span>
                <h3 className="font-semibold text-[#f0b429]">Grand Final</h3>
              </div>
              <ul className="space-y-1.5 text-gray-300 text-sm pl-11">
                <li className="flex items-start gap-2"><Circle size={6} className="mt-1.5 text-[#f0b429]" />2 teams battle</li>
                <li className="flex items-start gap-2"><Circle size={6} className="mt-1.5 text-[#f0b429]" />Winner takes all</li>
                <li className="flex items-start gap-2"><Circle size={6} className="mt-1.5 text-[#f0b429]" />Champion crowned</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Team Composition */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Users size={22} className="text-[#f0b429]" />
            <h2 className="text-lg font-bold text-[#f0b429]">Team Composition</h2>
          </div>
          
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <ul className="space-y-3 text-gray-300 text-sm">
              <li className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 text-xs">✓</span>
                11 players per team on field
              </li>
              <li className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 text-xs">✓</span>
                Maximum 2 players below 25 years allowed
              </li>
            </ul>
          </div>
        </section>

        {/* Match Rules */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Target size={22} className="text-[#f0b429]" />
            <h2 className="text-lg font-bold text-[#f0b429]">Match Rules</h2>
          </div>
          
          <div className="space-y-3">
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h3 className="font-semibold text-white mb-3">General Rules</h3>
              <ul className="space-y-1.5 text-gray-300 text-sm">
                <li className="flex items-start gap-2"><Circle size={6} className="mt-1.5 text-[#f0b429]" />10 overs per innings (can be reduced to 8 overs)</li>
                <li className="flex items-start gap-2"><Circle size={6} className="mt-1.5 text-[#f0b429]" />No Last Man Batting allowed</li>
                <li className="flex items-start gap-2"><Circle size={6} className="mt-1.5 text-[#f0b429]" />Tie in league matches = 1 point each (no Super Over)</li>
                <li className="flex items-start gap-2"><Circle size={6} className="mt-1.5 text-[#f0b429]" />Tie in Semi/Finals = Super Over with international rules</li>
                <li className="flex items-start gap-2"><Circle size={6} className="mt-1.5 text-[#f0b429]" />10+ minute delay = walkover to opponent</li>
              </ul>
            </div>

            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h3 className="font-semibold text-white mb-3">Batting Rules</h3>
              <ul className="space-y-1.5 text-gray-300 text-sm">
                <li className="flex items-start gap-2"><Circle size={6} className="mt-1.5 text-[#f0b429]" />Plastic/Wooden bats permitted</li>
                <li className="flex items-start gap-2"><Circle size={6} className="mt-1.5 text-[#f0b429]" />No LBW (Leg Before Wicket)</li>
                <li className="flex items-start gap-2"><Circle size={6} className="mt-1.5 text-[#f0b429]" />No Last Batsman batting</li>
                <li className="flex items-start gap-2"><Circle size={6} className="mt-1.5 text-[#f0b429]" />Batsmen interchange after every over</li>
                <li className="flex items-start gap-2"><Circle size={6} className="mt-1.5 text-[#f0b429]" />Retired batsmen can only bat at end</li>
                <li className="flex items-start gap-2"><Circle size={6} className="mt-1.5 text-[#f0b429]" />No Runners allowed</li>
              </ul>
            </div>

            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h3 className="font-semibold text-white mb-3">Bowling Rules</h3>
              <ul className="space-y-1.5 text-gray-300 text-sm">
                <li className="flex items-start gap-2"><Circle size={6} className="mt-1.5 text-[#f0b429]" />New ball for each innings</li>
                <li className="flex items-start gap-2"><Circle size={6} className="mt-1.5 text-[#f0b429]" />Bowling from one end only</li>
                <li className="flex items-start gap-2"><Circle size={6} className="mt-1.5 text-[#f0b429]" />Only throw bowling allowed (no run-up)</li>
                <li className="flex items-start gap-2"><Circle size={6} className="mt-1.5 text-[#f0b429]" />Must bowl from within 30"x30" box</li>
                <li className="flex items-start gap-2"><Circle size={6} className="mt-1.5 text-[#f0b429]" />Both feet must be grounded at delivery</li>
                <li className="flex items-start gap-2"><Circle size={6} className="mt-1.5 text-[#f0b429]" />No round-arm or shoulder swing allowed</li>
              </ul>
            </div>

            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h3 className="font-semibold text-white mb-3">Scoring</h3>
              <ul className="space-y-1.5 text-gray-300 text-sm">
                <li className="flex items-start gap-2"><Circle size={6} className="mt-1.5 text-[#f0b429]" />Standard cricket scoring applies</li>
                <li className="flex items-start gap-2"><Circle size={6} className="mt-1.5 text-[#f0b429]" />6 runs for clearing boundary</li>
                <li className="flex items-start gap-2"><Circle size={6} className="mt-1.5 text-[#f0b429]" />4 runs for touching boundary</li>
                <li className="flex items-start gap-2"><Circle size={6} className="mt-1.5 text-[#f0b429]" />No-ball/Wide = 1 extra run + free hit</li>
                <li className="flex items-start gap-2"><Circle size={6} className="mt-1.5 text-[#f0b429]" />Extras count towards team total</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Ground Specifications */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Award size={22} className="text-[#f0b429]" />
            <h2 className="text-lg font-bold text-[#f0b429]">Ground Specifications</h2>
          </div>
          
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-[#f0b429] mb-1">145 ft</p>
                <p className="text-xs text-gray-400">Length (Long End)</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-[#f0b429] mb-1">120 ft</p>
                <p className="text-xs text-gray-400">Width (Short End)</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-[#f0b429] mb-1">35 ft</p>
                <p className="text-xs text-gray-400">Top Net Height</p>
              </div>
            </div>
          </div>
        </section>

        {/* Points System */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Trophy size={22} className="text-[#f0b429]" />
            <h2 className="text-lg font-bold text-[#f0b429]">Points System</h2>
          </div>
          
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-green-500/10 rounded-lg p-3">
                <p className="text-2xl font-bold text-green-400 mb-1">2</p>
                <p className="text-xs text-gray-400">Win</p>
              </div>
              <div className="bg-yellow-500/10 rounded-lg p-3">
                <p className="text-2xl font-bold text-yellow-400 mb-1">1</p>
                <p className="text-xs text-gray-400">Tie</p>
              </div>
              <div className="bg-red-500/10 rounded-lg p-3">
                <p className="text-2xl font-bold text-red-400 mb-1">0</p>
                <p className="text-xs text-gray-400">Loss</p>
              </div>
            </div>
          </div>
        </section>

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
