import { useState, useEffect, useCallback } from 'react';

export const useTVMode = () => {
  const [isTVMode, setIsTVMode] = useState(false);
  const [focusedElement, setFocusedElement] = useState<string | null>(null);

  useEffect(() => {
    // Detect TV mode via URL parameter, user agent, or large screen with no touch
    const urlParams = new URLSearchParams(window.location.search);
    const tvParam = urlParams.get('tv') === '1';
    
    // Check if on /tv route
    const isTVRoute = window.location.pathname.startsWith('/tv');
    
    // Common Smart TV user agent patterns (expanded for LG webOS)
    const userAgent = navigator.userAgent.toLowerCase();
    const isTVUserAgent = 
      userAgent.includes('smart-tv') ||
      userAgent.includes('smarttv') ||
      userAgent.includes('webos') ||
      userAgent.includes('web0s') ||
      userAgent.includes('lg') ||
      userAgent.includes('netcast') ||
      userAgent.includes('tizen') ||
      userAgent.includes('hbbtv') ||
      userAgent.includes('viera') ||
      userAgent.includes('nettv') ||
      userAgent.includes('roku') ||
      userAgent.includes('firetv') ||
      userAgent.includes('appletv') ||
      userAgent.includes('googletv') ||
      userAgent.includes('androidtv') ||
      userAgent.includes('playstation') ||
      userAgent.includes('xbox') ||
      userAgent.includes('bravia') ||
      userAgent.includes('philipstv') ||
      userAgent.includes('samsungtv');

    // Large screen without touch support suggests TV
    const isLargeScreenNoTouch = 
      window.innerWidth >= 1280 && 
      !('ontouchstart' in window) &&
      !navigator.maxTouchPoints;

    const savedTVMode = localStorage.getItem('lbpl_tv_mode') === 'true';

    setIsTVMode(tvParam || isTVRoute || isTVUserAgent || savedTVMode);
  }, []);

  const enableTVMode = useCallback(() => {
    setIsTVMode(true);
    localStorage.setItem('lbpl_tv_mode', 'true');
    document.documentElement.classList.add('tv-mode');
  }, []);

  const disableTVMode = useCallback(() => {
    setIsTVMode(false);
    localStorage.removeItem('lbpl_tv_mode');
    document.documentElement.classList.remove('tv-mode');
  }, []);

  const toggleTVMode = useCallback(() => {
    if (isTVMode) {
      disableTVMode();
    } else {
      enableTVMode();
    }
  }, [isTVMode, enableTVMode, disableTVMode]);

  // Apply TV mode class to document
  useEffect(() => {
    if (isTVMode) {
      document.documentElement.classList.add('tv-mode');
    } else {
      document.documentElement.classList.remove('tv-mode');
    }
  }, [isTVMode]);

  return {
    isTVMode,
    enableTVMode,
    disableTVMode,
    toggleTVMode,
    focusedElement,
    setFocusedElement,
  };
};

export default useTVMode;
