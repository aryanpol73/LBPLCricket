import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronDown } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { isSmartTV } from "@/hooks/useTVMode";

const SettingsHelp = () => {
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

  const faqs = [
    {
      question: "How do I install the LBPL app?",
      answer: "Open the website in Chrome/Safari, tap the share button, and select 'Add to Home Screen'. The app will be installed like a native app.",
    },
    {
      question: "How do I enable notifications?",
      answer: "Go to Settings → Notifications and enable the notifications you want. Make sure to allow notifications when prompted by your browser.",
    },
    {
      question: "How do I switch between light and dark mode?",
      answer: "Go to Settings → Appearance and select your preferred theme. You can choose Light, Dark, or System Auto to match your device settings.",
    },
    {
      question: "How do I view live scores?",
      answer: "Navigate to the Matches section from the bottom navigation. Live matches will show real-time scores when available.",
    },
    {
      question: "How do I pin the live score widget?",
      answer: "Go to Settings → PWA Controls → Pin Live Widget. Follow the instructions to add a quick-access widget to your home screen.",
    },
    {
      question: "How do I clear app cache?",
      answer: "Go to Settings → PWA Controls → Clear Cache. This will remove stored data and refresh the app.",
    },
    {
      question: "How do I join the community?",
      answer: "Tap the Community tab in the bottom navigation. You'll need to create an account or log in to participate in discussions.",
    },
    {
      question: "Who developed this app?",
      answer: "The LBPL Official App was designed and developed by Aryan Pol. You can find more info in Settings → Developer Info.",
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
          <h1 className="text-xl font-bold text-white">Help & FAQ</h1>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 pb-24">
        <div className="mb-6">
          <p className="text-gray-400 text-sm">
            Find answers to commonly asked questions about the LBPL app.
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="bg-white/5 rounded-xl border border-white/10 overflow-hidden"
            >
              <AccordionTrigger className="px-4 py-4 text-white text-left hover:no-underline hover:bg-white/5 [&[data-state=open]>svg]:rotate-180">
                <span className="pr-4">{faq.question}</span>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 text-gray-400 text-sm">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Contact Support */}
        <div className="mt-8 p-4 bg-[#f0b429]/10 rounded-xl border border-[#f0b429]/20">
          <h3 className="text-white font-semibold mb-2">Still need help?</h3>
          <p className="text-gray-400 text-sm mb-3">
            Contact us at aryan.pol737@gmail.com for support.
          </p>
          <button
            onClick={() => window.open("mailto:aryan.pol737@gmail.com?subject=LBPL App Support", "_blank")}
            className="bg-[#f0b429] text-[#0b1c3d] font-semibold px-4 py-2 rounded-lg hover:bg-[#f0b429]/90 transition-colors"
          >
            Contact Support
          </button>
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

export default SettingsHelp;