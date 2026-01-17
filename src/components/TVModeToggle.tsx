import React from 'react';
import { Tv, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTVModeContext } from '@/contexts/TVModeContext';

const TVModeToggle: React.FC = () => {
  const { isTVMode, toggleTVMode } = useTVModeContext();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTVMode}
      className="tv-focusable relative"
      title={isTVMode ? 'Exit TV Mode' : 'Enter TV Mode'}
    >
      {isTVMode ? (
        <Monitor className="h-5 w-5" />
      ) : (
        <Tv className="h-5 w-5" />
      )}
    </Button>
  );
};

export default TVModeToggle;
