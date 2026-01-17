import React, { createContext, useContext, useEffect, useRef, useCallback } from 'react';
import { useTVMode } from '@/hooks/useTVMode';
import { useNavigate, useLocation } from 'react-router-dom';

interface TVModeContextType {
  isTVMode: boolean;
  enableTVMode: () => void;
  disableTVMode: () => void;
  toggleTVMode: () => void;
}

const TVModeContext = createContext<TVModeContextType | undefined>(undefined);

export const useTVModeContext = () => {
  const context = useContext(TVModeContext);
  if (!context) {
    throw new Error('useTVModeContext must be used within a TVModeProvider');
  }
  return context;
};

interface TVModeProviderProps {
  children: React.ReactNode;
}

export const TVModeProvider: React.FC<TVModeProviderProps> = ({ children }) => {
  const tvMode = useTVMode();
  const navigate = useNavigate();
  const location = useLocation();
  const focusableElementsRef = useRef<HTMLElement[]>([]);
  const currentFocusIndexRef = useRef(0);

  // Get all focusable elements
  const getFocusableElements = useCallback(() => {
    const selector = [
      'a[href]:not([disabled])',
      'button:not([disabled])',
      '[tabindex]:not([tabindex="-1"]):not([disabled])',
      '.tv-focusable:not([disabled])',
    ].join(', ');
    
    const elements = Array.from(document.querySelectorAll(selector)) as HTMLElement[];
    return elements.filter(el => {
      const style = window.getComputedStyle(el);
      return style.display !== 'none' && style.visibility !== 'hidden' && el.offsetParent !== null;
    });
  }, []);

  // Focus an element with visual feedback
  const focusElement = useCallback((element: HTMLElement) => {
    if (!element) return;
    
    // Remove focus from all elements
    document.querySelectorAll('.tv-focused').forEach(el => {
      el.classList.remove('tv-focused');
    });
    
    // Add focus to new element
    element.classList.add('tv-focused');
    element.focus({ preventScroll: false });
    
    // Scroll element into view
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'center',
    });
  }, []);

  // Navigate focus in a direction
  const moveFocus = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    const elements = getFocusableElements();
    if (elements.length === 0) return;

    focusableElementsRef.current = elements;
    const currentElement = document.activeElement as HTMLElement;
    const currentIndex = elements.indexOf(currentElement);
    
    if (currentIndex === -1) {
      // If no element is focused, focus the first one
      focusElement(elements[0]);
      currentFocusIndexRef.current = 0;
      return;
    }

    const currentRect = currentElement.getBoundingClientRect();
    let bestElement: HTMLElement | null = null;
    let bestScore = Infinity;

    elements.forEach((element, index) => {
      if (element === currentElement) return;
      
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const currentCenterX = currentRect.left + currentRect.width / 2;
      const currentCenterY = currentRect.top + currentRect.height / 2;
      
      const dx = centerX - currentCenterX;
      const dy = centerY - currentCenterY;
      
      let isValidDirection = false;
      let score = 0;

      switch (direction) {
        case 'up':
          isValidDirection = dy < -10;
          score = Math.abs(dy) + Math.abs(dx) * 2;
          break;
        case 'down':
          isValidDirection = dy > 10;
          score = Math.abs(dy) + Math.abs(dx) * 2;
          break;
        case 'left':
          isValidDirection = dx < -10;
          score = Math.abs(dx) + Math.abs(dy) * 2;
          break;
        case 'right':
          isValidDirection = dx > 10;
          score = Math.abs(dx) + Math.abs(dy) * 2;
          break;
      }

      if (isValidDirection && score < bestScore) {
        bestScore = score;
        bestElement = element;
      }
    });

    if (bestElement) {
      focusElement(bestElement);
      currentFocusIndexRef.current = elements.indexOf(bestElement);
    }
  }, [getFocusableElements, focusElement]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!tvMode.isTVMode) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key;

      switch (key) {
        case 'ArrowUp':
          e.preventDefault();
          moveFocus('up');
          break;
        case 'ArrowDown':
          e.preventDefault();
          moveFocus('down');
          break;
        case 'ArrowLeft':
          e.preventDefault();
          moveFocus('left');
          break;
        case 'ArrowRight':
          e.preventDefault();
          moveFocus('right');
          break;
        case 'Enter':
        case ' ':
          // Let the browser handle click on focused element
          const focusedEl = document.activeElement as HTMLElement;
          if (focusedEl && focusedEl !== document.body) {
            e.preventDefault();
            focusedEl.click();
          }
          break;
        case 'Escape':
        case 'Backspace':
          // Navigate back
          e.preventDefault();
          if (location.pathname !== '/') {
            navigate(-1);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [tvMode.isTVMode, moveFocus, navigate, location.pathname]);

  // Focus first element when page changes
  useEffect(() => {
    if (!tvMode.isTVMode) return;
    
    const timer = setTimeout(() => {
      const elements = getFocusableElements();
      if (elements.length > 0) {
        focusElement(elements[0]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [tvMode.isTVMode, location.pathname, getFocusableElements, focusElement]);

  return (
    <TVModeContext.Provider value={tvMode}>
      {children}
    </TVModeContext.Provider>
  );
};

export default TVModeProvider;
