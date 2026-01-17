import React from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, CornerDownLeft } from 'lucide-react';
import { useTVModeContext } from '@/contexts/TVModeContext';

const TVNavHelper: React.FC = () => {
  const { isTVMode } = useTVModeContext();

  if (!isTVMode) return null;

  return (
    <>
      {/* TV Mode Badge */}
      <div className="tv-mode-badge">
        📺 TV Mode
      </div>

      {/* Navigation Helper */}
      <div className="tv-nav-helper">
        <div className="tv-nav-helper-item">
          <span className="tv-nav-helper-key">
            <ArrowUp className="h-4 w-4" />
          </span>
          <span className="tv-nav-helper-key">
            <ArrowDown className="h-4 w-4" />
          </span>
          <span className="tv-nav-helper-key">
            <ArrowLeft className="h-4 w-4" />
          </span>
          <span className="tv-nav-helper-key">
            <ArrowRight className="h-4 w-4" />
          </span>
          <span>Navigate</span>
        </div>
        <div className="tv-nav-helper-item">
          <span className="tv-nav-helper-key">OK</span>
          <span>Select</span>
        </div>
        <div className="tv-nav-helper-item">
          <span className="tv-nav-helper-key">
            <CornerDownLeft className="h-4 w-4" />
          </span>
          <span>Back</span>
        </div>
      </div>
    </>
  );
};

export default TVNavHelper;
