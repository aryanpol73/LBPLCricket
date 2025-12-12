import { useState, useEffect } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // Start fade out after 2.5 seconds
    const fadeTimer = setTimeout(() => {
      setIsFading(true);
    }, 2500);

    // Complete after fade animation (500ms)
    const completeTimer = setTimeout(() => {
      setIsVisible(false);
      onComplete();
    }, 3000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] transition-opacity duration-500 ${
        isFading ? 'opacity-0' : 'opacity-100'
      }`}
      style={{ backgroundColor: '#0a2351' }}
    >
      <img
        src="/splash-screen.png"
        alt="LBPL Cricket Season 3"
        className="w-full h-full object-cover object-center"
        style={{
          width: '100vw',
          height: '100vh',
          objectFit: 'cover',
          objectPosition: 'center',
        }}
      />
    </div>
  );
};

export default SplashScreen;
