import { useEffect, useState } from 'react';

export const useCountUp = (end: number, duration: number = 2000, start: number = 0) => {
  const [count, setCount] = useState(start);
  const [hasAnimated, setHasAnimated] = useState(false);

  const startCounting = (targetEnd?: number) => {
    if (hasAnimated) return;
    
    const finalEnd = targetEnd ?? end;
    setHasAnimated(true);
    const increment = finalEnd / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
      current += increment;
      if (current >= finalEnd) {
        setCount(finalEnd);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, 16);

    return () => clearInterval(timer);
  };

  return { count, startCounting };
};
