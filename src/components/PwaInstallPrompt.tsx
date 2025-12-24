import { useState, useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const PwaInstallPrompt = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [showInstructionsSheet, setShowInstructionsSheet] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // Check if already installed or dismissed
  const isInstalled = () => {
    return window.matchMedia('(display-mode: standalone)').matches || 
           (window.navigator as any).standalone === true ||
           localStorage.getItem('lbpl_pwa_installed') === 'true';
  };

  const wasDismissed = () => {
    const dismissedTime = localStorage.getItem('lbpl_install_dismissed');
    if (!dismissedTime) return false;
    // Show again after 7 days
    const daysSinceDismissed = (Date.now() - parseInt(dismissedTime)) / (1000 * 60 * 60 * 24);
    return daysSinceDismissed < 7;
  };

  const isMobile = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  };

  useEffect(() => {
    // Don't show if installed or recently dismissed (removed mobile check - show on all devices)
    if (isInstalled() || wasDismissed()) {
      setShowPrompt(false);
      return;
    }

    // Detect iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(iOS);

    // Show prompt immediately
    setShowPrompt(true);

    // Listen for beforeinstallprompt (Android/Chrome)
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // Listen for app installed
    const handleAppInstalled = () => {
      localStorage.setItem('lbpl_pwa_installed', 'true');
      setShowPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [dismissed]);

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowInstructionsSheet(true);
      return;
    }

    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          localStorage.setItem('lbpl_pwa_installed', 'true');
          setShowPrompt(false);
        }
        setDeferredPrompt(null);
      } catch (err) {
        // Fallback to instructions sheet for Android
        setShowInstructionsSheet(true);
      }
    } else {
      // No prompt available, show instructions sheet
      setShowInstructionsSheet(true);
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    setShowPrompt(false);
    setShowInstructionsSheet(false);
    localStorage.setItem('lbpl_install_dismissed', Date.now().toString());
  };

  if (!showPrompt || dismissed) return null;

  return (
    <>
      {/* Floating Install Button */}
      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 animate-fade-in">
        <div className="relative">
          <Button
            onClick={handleInstallClick}
            className="bg-gradient-to-r from-[#1a3a6e] to-[#0f2340] hover:from-[#1f4580] hover:to-[#153050] text-white px-5 py-3 rounded-full shadow-lg shadow-black/30 border border-[#f0b429]/30 flex items-center gap-2 font-medium"
          >
            <span>📲 Install LBPL Cricket App</span>
          </Button>
          <button
            onClick={handleDismiss}
            className="absolute -top-2 -right-2 w-6 h-6 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-colors border border-gray-600"
            aria-label="Dismiss"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Instructions Bottom Sheet - Works for both iOS and Android */}
      {showInstructionsSheet && (
        <div className="fixed inset-0 z-[100]" onClick={handleDismiss}>
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
              onClick={handleDismiss}
              variant="ghost"
              className="w-full text-gray-400 hover:text-white"
            >
              Maybe Later
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
