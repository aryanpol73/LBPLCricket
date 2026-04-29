import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

/**
 * Headless PWA install handler.
 *
 * - Renders NO UI. The browser shows its own native install affordance
 *   (address-bar install icon on desktop Chrome/Edge, mini-infobar / 3-dot
 *   menu "Install app" on Android, native Share → Add to Home Screen on iOS).
 * - We deliberately do NOT call e.preventDefault() on `beforeinstallprompt`
 *   so the browser is free to show its own mini-infobar.
 * - Still tracks installs in the `pwa_installs` table when `appinstalled`
 *   fires, preserving existing analytics.
 */
const PwaInstallPrompt = () => {
  useEffect(() => {
    const handleAppInstalled = async () => {
      try {
        const ua = navigator.userAgent;
        const platform = /iPad|iPhone|iPod/.test(ua)
          ? 'iOS'
          : /Android/i.test(ua)
          ? 'Android'
          : 'Desktop';
        await supabase.from('pwa_installs').insert({
          user_agent: ua,
          platform,
        });
      } catch {
        // Silent fail — tracking is non-critical
      }
    };

    window.addEventListener('appinstalled', handleAppInstalled);
    return () => window.removeEventListener('appinstalled', handleAppInstalled);
  }, []);

  return null;
};

export default PwaInstallPrompt;
