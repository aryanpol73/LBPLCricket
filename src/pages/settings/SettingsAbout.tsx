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
            <p className="text-[#f0b429] font-medium mt-1">Organised by Pune Team</p>
          </div>

          <div className="space-y-4 text-gray-300 text-sm leading-relaxed">
            <p>
              <strong className="text-white">LBPL (Lad Brahmin Premier League)</strong> traces its origins back to the 1980s, when it began as a local leather ball cricket initiative that brought together players and passionate cricket lovers from different regions. Over the years, LBPL became more than just a tournament — it turned into a tradition that represented competitive spirit, unity, and love for the game.
            </p>

            {/* Historical Section */}
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <h3 className="text-[#f0b429] font-semibold mb-2">📜 आठवणींना उजाळा (1977-78-79)</h3>
              <p className="mb-2">
                लाड ब्राह्मण परिषद शाखा मेहकर द्वारा मेहकर येथे 4-5-6 फेब्रुवारी 1977 व 31 डिसेंबर 1978 ते 2 जानेवारी 1979 ला भव्य क्रिकेट सामने आयोजित करण्यात आले होते. हे सर्व सामने मेहकर एज्युकेशन सोसायटी हायस्कूलचे फुटबॉल मैदानावर घेण्यात आले.
              </p>
              <p className="text-gray-400 text-xs">
                विजेत्या चमूस कै. जानकीराम गोपाळ सराफ फिरता चषक व उपविजेत्या चमूस कै. गोविंद रामासा उमाळकर फिरता ढाल देण्यात आली.
              </p>
            </div>
            
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <h3 className="text-[#f0b429] font-semibold mb-2">🏆 Season 1 (14th July 2024)</h3>
              <p className="mb-2">After a long gap, LBPL was revived in 2024 under the organisation of <strong className="text-white">Team Akola</strong>. Season 1 featured 12 teams including Shandar Chikhli, Dhamakedar Mumbai, Wegvan Wardha, Ajey Akola, Puneri Paltan, Damdar Dongaonkar, Puneri Katta, Aflatoon Akola, Dhurandhar Sambhajinagar, Shree Balaji DeulgaonRaja, Nagpur Nayak, and Ajinkya Mehkar.</p>
              <p className="text-[#f0b429]">Champion: <strong>Aflatoon Akola</strong></p>
            </div>

            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <h3 className="text-[#f0b429] font-semibold mb-2">🏆 Season 2 (4th-5th January 2025)</h3>
              <p className="mb-2">Organised by the <strong className="text-white">Nagpur team</strong>, the league expanded to 16 teams: Nagpur Tigers, Dhamakedar Mumbai, Puneri Paltan, Puneri Katta, Shri Balaji Mehkar, Aflatoon Akola, Dhurandhar Sambhajinagar, Chikhli Spartan, Nagpur Gladiators, Wardha Reloaded 2.0, Jagadamb Sakharkherda, Malkapur Risers, Sharangdhar Mehkar, Ajey Akola, Damdar Dongaon, and Buldhana Blasters.</p>
              <p className="text-[#f0b429]">Champion: <strong>Dhamakedar Mumbai</strong></p>
            </div>

            <div className="bg-[#f0b429]/10 rounded-lg p-4 border border-[#f0b429]/30">
              <h3 className="text-[#f0b429] font-semibold mb-2">🔥 Season 3 (Coming Soon)</h3>
              <p>Organised by the <strong className="text-white">Pune Team</strong>. With each passing season, LBPL continues to grow in scale, professionalism, and competitiveness. Teams are well-prepared, fans are eagerly waiting, and the league is ready to deliver another season filled with passion, energy, and unforgettable cricketing moments. The legacy of LBPL continues, stronger than ever!</p>
            </div>
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
