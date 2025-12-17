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
  const [showIOSSheet, setShowIOSSheet] = useState(false);
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
    // Don't show if installed, not mobile, or recently dismissed
    if (isInstalled() || !isMobile() || wasDismissed()) return;

    // Detect iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(iOS);

    // Listen for beforeinstallprompt (Android/Chrome)
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // Show prompt after delay or scroll
    let timeoutId: NodeJS.Timeout;
    let hasScrolled = false;

    const triggerShow = () => {
      if (!showPrompt && !dismissed && !isInstalled()) {
        setShowPrompt(true);
      }
    };

    const handleScroll = () => {
      if (!hasScrolled) {
        hasScrolled = true;
        triggerShow();
      }
    };

    // Show after 12 seconds or first scroll
    timeoutId = setTimeout(triggerShow, 12000);
    window.addEventListener('scroll', handleScroll, { once: true });

    // Listen for app installed
    window.addEventListener('appinstalled', () => {
      localStorage.setItem('lbpl_pwa_installed', 'true');
      setShowPrompt(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
    };
  }, [showPrompt, dismissed]);

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSSheet(true);
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
        // Fallback message for Android
        alert('Tap ⋮ → Add to Home Screen');
      }
    } else if (!isIOS) {
      // No prompt available on Android
      alert('Tap ⋮ → Add to Home Screen');
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    setShowPrompt(false);
    setShowIOSSheet(false);
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
            <span className="text-lg">📲</span>
            <span>Install LBPL App</span>
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

      {/* iOS Bottom Sheet */}
      {showIOSSheet && (
        <div className="fixed inset-0 z-[100]" onClick={handleDismiss}>
          <div className="absolute inset-0 bg-black/60" />
          <div 
            className="absolute bottom-0 left-0 right-0 bg-[#0f1b2e] rounded-t-3xl p-6 pb-10 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-1 bg-gray-600 rounded-full mx-auto mb-6" />
            
            <h3 className="text-white text-lg font-semibold text-center mb-6">
              Install LBPL App
            </h3>

            {/* iOS Instructions Image */}
            <div className="flex items-center justify-center gap-4 py-4">
              <div className="flex flex-col items-center gap-2">
                <div className="w-14 h-14 bg-[#1a3a6e] rounded-xl flex items-center justify-center">
                  <svg className="w-7 h-7 text-[#007AFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                </div>
                <span className="text-gray-400 text-xs">Share</span>
              </div>
              
              <svg className="w-6 h-6 text-[#f0b429]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
              
              <div className="flex flex-col items-center gap-2">
                <div className="w-14 h-14 bg-[#1a3a6e] rounded-xl flex items-center justify-center">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <span className="text-gray-400 text-xs">Add to Home</span>
              </div>
            </div>

            <Button
              onClick={handleDismiss}
              variant="ghost"
              className="w-full mt-4 text-gray-400 hover:text-white"
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
