import { useState, useEffect } from 'react';
import { X, Share, Plus, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const PwaInstallPrompt = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [showIOSSheet, setShowIOSSheet] = useState(false);
  const [showAndroidSheet, setShowAndroidSheet] = useState(false);
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
    // Don't show if installed or recently dismissed
    if (isInstalled() || wasDismissed()) return;

    // Only show on mobile
    if (!isMobile()) return;

    // Detect iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(iOS);

    // Detect Android
    const android = /Android/i.test(navigator.userAgent);
    setIsAndroid(android);

    // Listen for beforeinstallprompt (Android/Chrome)
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Show prompt immediately when event is captured
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // For iOS or if beforeinstallprompt doesn't fire, show after delay
    const timeoutId = setTimeout(() => {
      if (!dismissed && !isInstalled()) {
        setShowPrompt(true);
      }
    }, 5000); // Show after 5 seconds

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
      clearTimeout(timeoutId);
    };
  }, [dismissed]);

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
        // Fallback to instructions
        setShowAndroidSheet(true);
      }
    } else if (isAndroid) {
      // No prompt available, show manual instructions
      setShowAndroidSheet(true);
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    setShowPrompt(false);
    setShowIOSSheet(false);
    setShowAndroidSheet(false);
    localStorage.setItem('lbpl_install_dismissed', Date.now().toString());
  };

  if (!showPrompt || dismissed) return null;

  return (
    <>
      {/* Floating Install Button */}
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 animate-bounce-subtle">
        <div className="relative">
          <Button
            onClick={handleInstallClick}
            className="bg-gradient-to-r from-[#1a3a6e] to-[#0f2340] hover:from-[#1f4580] hover:to-[#153050] text-white px-5 py-3 rounded-full shadow-lg shadow-black/40 border border-[#f0b429]/40 flex items-center gap-2 font-semibold text-sm"
          >
            <span className="text-lg">📲</span>
            <span>Install LBPL Cricket App</span>
          </Button>
          <button
            onClick={handleDismiss}
            className="absolute -top-2 -right-2 w-6 h-6 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-colors border border-gray-600"
            aria-label="Dismiss"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
        
        {/* Short message below button */}
        <p className="text-center text-xs text-gray-400 mt-2 animate-pulse">
          Get live scores & notifications!
        </p>
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
            
            <h3 className="text-white text-lg font-semibold text-center mb-2">
              📲 Install LBPL Cricket App
            </h3>
            <p className="text-gray-400 text-sm text-center mb-6">
              Add to your home screen for the best experience
            </p>

            {/* iOS Instructions */}
            <div className="bg-[#1a2744] rounded-xl p-4 mb-4">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 bg-[#007AFF] rounded-lg flex items-center justify-center flex-shrink-0">
                  <Share className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-white font-medium">Step 1</p>
                  <p className="text-gray-400 text-sm">Tap the Share button in Safari</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[#34C759] rounded-lg flex items-center justify-center flex-shrink-0">
                  <Plus className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-white font-medium">Step 2</p>
                  <p className="text-gray-400 text-sm">Tap "Add to Home Screen"</p>
                </div>
              </div>
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

      {/* Android Bottom Sheet (fallback when no prompt) */}
      {showAndroidSheet && (
        <div className="fixed inset-0 z-[100]" onClick={handleDismiss}>
          <div className="absolute inset-0 bg-black/60" />
          <div 
            className="absolute bottom-0 left-0 right-0 bg-[#0f1b2e] rounded-t-3xl p-6 pb-10 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-1 bg-gray-600 rounded-full mx-auto mb-6" />
            
            <h3 className="text-white text-lg font-semibold text-center mb-2">
              📲 Install LBPL Cricket App
            </h3>
            <p className="text-gray-400 text-sm text-center mb-6">
              Add to your home screen for the best experience
            </p>

            {/* Android Instructions */}
            <div className="bg-[#1a2744] rounded-xl p-4 mb-4">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MoreVertical className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-white font-medium">Step 1</p>
                  <p className="text-gray-400 text-sm">Tap the menu (⋮) in your browser</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[#34C759] rounded-lg flex items-center justify-center flex-shrink-0">
                  <Plus className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-white font-medium">Step 2</p>
                  <p className="text-gray-400 text-sm">Tap "Add to Home Screen" or "Install App"</p>
                </div>
              </div>
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
        @keyframes bounce-subtle {
          0%, 100% { transform: translate(-50%, 0); }
          50% { transform: translate(-50%, -6px); }
        }
        @keyframes slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 2s ease-in-out infinite;
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default PwaInstallPrompt;
