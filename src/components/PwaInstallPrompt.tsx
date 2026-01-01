import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const PwaInstallPrompt = () => {
  const [showPrompt, setShowPrompt] = useState(true);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [showInstructionsSheet, setShowInstructionsSheet] = useState(false);

  // Check if already installed as PWA
  const isInstalled = () => {
    return window.matchMedia('(display-mode: standalone)').matches || 
           (window.navigator as any).standalone === true;
  };

  useEffect(() => {
    // Detect iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(iOS);

    // Hide only if already installed
    if (isInstalled()) {
      setShowPrompt(false);
      return;
    }

    // Listen for beforeinstallprompt (Android/Chrome)
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      console.log('PWA Install Prompt - beforeinstallprompt received');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // Listen for app installed
    const handleAppInstalled = () => {
      setShowPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    // On Android with deferred prompt - trigger native install directly
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          setShowPrompt(false);
        }
        setDeferredPrompt(null);
        return;
      } catch (err) {
        console.log('Install prompt error:', err);
      }
    }

    // Show instructions sheet for iOS or when native prompt isn't available
    setShowInstructionsSheet(true);
  };

  const closeInstructionsSheet = () => {
    setShowInstructionsSheet(false);
  };

  if (!showPrompt) return null;

  return (
    <>
      {/* Floating Install Button - always visible on all devices */}
      <div className="fixed bottom-28 left-1/2 -translate-x-1/2 z-[60] animate-fade-in">
        <Button
          onClick={handleInstallClick}
          className="bg-gradient-to-r from-[#1a3a6e] to-[#0f2340] hover:from-[#1f4580] hover:to-[#153050] text-white px-6 py-4 rounded-full shadow-xl shadow-black/40 border-2 border-[#f0b429]/50 flex items-center gap-2 font-semibold text-base"
        >
          <span>📲 Install LBPL Cricket App</span>
        </Button>
      </div>

      {/* Instructions Bottom Sheet - for iOS or fallback */}
      {showInstructionsSheet && (
        <div className="fixed inset-0 z-[100]" onClick={closeInstructionsSheet}>
          <div className="absolute inset-0 bg-black/60" />
          <div 
            className="absolute bottom-0 left-0 right-0 bg-[#0f1b2e] rounded-t-3xl p-6 pb-10 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-1 bg-gray-600 rounded-full mx-auto mb-6" />
            
            <h3 className="text-white text-lg font-semibold text-center mb-4">
              📲 Install LBPL Cricket App
            </h3>
            
            <p className="text-gray-400 text-sm text-center mb-4">
              {isIOS ? 'iPhone/iPad' : 'Android'} - Follow these steps:
            </p>

            {/* Step-by-step Instructions */}
            <div className="space-y-3 mb-6">
              {isIOS ? (
                <>
                  <div className="flex items-center gap-3 bg-[#1a3a6e]/40 p-3 rounded-lg">
                    <span className="w-6 h-6 bg-[#f0b429] text-black rounded-full flex items-center justify-center text-sm font-bold">1</span>
                    <span className="text-white text-sm">Tap the <strong>Share</strong> button ⬆️ at bottom</span>
                  </div>
                  <div className="flex items-center gap-3 bg-[#1a3a6e]/40 p-3 rounded-lg">
                    <span className="w-6 h-6 bg-[#f0b429] text-black rounded-full flex items-center justify-center text-sm font-bold">2</span>
                    <span className="text-white text-sm">Scroll & tap <strong>"Add to Home Screen"</strong> ➕</span>
                  </div>
                  <div className="flex items-center gap-3 bg-[#1a3a6e]/40 p-3 rounded-lg">
                    <span className="w-6 h-6 bg-[#f0b429] text-black rounded-full flex items-center justify-center text-sm font-bold">3</span>
                    <span className="text-white text-sm">Tap <strong>"Add"</strong> - Done! 🎉</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-3 bg-[#1a3a6e]/40 p-3 rounded-lg">
                    <span className="w-6 h-6 bg-[#f0b429] text-black rounded-full flex items-center justify-center text-sm font-bold">1</span>
                    <span className="text-white text-sm">Tap <strong>⋮ Menu</strong> (3 dots) top-right</span>
                  </div>
                  <div className="flex items-center gap-3 bg-[#1a3a6e]/40 p-3 rounded-lg">
                    <span className="w-6 h-6 bg-[#f0b429] text-black rounded-full flex items-center justify-center text-sm font-bold">2</span>
                    <span className="text-white text-sm">Tap <strong>"Add to Home Screen"</strong> or <strong>"Install App"</strong></span>
                  </div>
                  <div className="flex items-center gap-3 bg-[#1a3a6e]/40 p-3 rounded-lg">
                    <span className="w-6 h-6 bg-[#f0b429] text-black rounded-full flex items-center justify-center text-sm font-bold">3</span>
                    <span className="text-white text-sm">Confirm <strong>"Install"</strong> - Done! 🎉</span>
                  </div>
                </>
              )}
            </div>

            <Button
              onClick={closeInstructionsSheet}
              variant="ghost"
              className="w-full text-gray-400 hover:text-white"
            >
              Close
            </Button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translate(-50%, 20px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
        @keyframes slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.4s ease-out;
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default PwaInstallPrompt;
