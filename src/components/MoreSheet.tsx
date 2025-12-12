import { useRef, useCallback, useEffect } from "react";
import { Settings } from "lucide-react";

interface NavItem {
  label: string;
  icon: React.ElementType;
  path: string;
}

interface MoreSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: NavItem[];
  isActive: (path: string) => boolean;
  onItemClick: (path: string) => void;
  triggerHaptic: () => void;
  isPwa: boolean;
}

export default function MoreSheet({
  open,
  onOpenChange,
  items,
  isActive,
  onItemClick,
  triggerHaptic,
  isPwa,
}: MoreSheetProps) {
  // Add Settings item only in PWA mode
  const allItems = isPwa
    ? [...items, { label: "Settings", icon: Settings, path: "/settings" }]
    : items;
  const sheetRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef(0);
  const currentTranslateY = useRef(0);

  // Handle swipe down to close
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    currentTranslateY.current = 0;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    const deltaY = e.touches[0].clientY - touchStartY.current;
    if (deltaY > 0 && sheetRef.current) {
      currentTranslateY.current = deltaY;
      sheetRef.current.style.transform = `translateY(${deltaY}px)`;
      sheetRef.current.style.transition = "none";
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (sheetRef.current) {
      // If swiped down more than 80px, close the sheet
      if (currentTranslateY.current > 80) {
        triggerHaptic();
        onOpenChange(false);
      }
      // Reset transform with spring animation
      sheetRef.current.style.transform = "";
      sheetRef.current.style.transition = "";
    }
    currentTranslateY.current = 0;
  }, [onOpenChange, triggerHaptic]);

  // Close on backdrop click
  const handleBackdropClick = useCallback(() => {
    triggerHaptic();
    onOpenChange(false);
  }, [onOpenChange, triggerHaptic]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        onOpenChange(false);
      }
    };
    
    if (open) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60]">
      {/* Backdrop with fade animation */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={handleBackdropClick}
        style={{
          animation: "fadeIn 0.2s ease-out forwards",
        }}
      />

      {/* Sheet with spring animation */}
      <div
        ref={sheetRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="absolute bottom-0 left-0 right-0 rounded-t-2xl border-t border-[#f0b429]/20"
        style={{
          background: "linear-gradient(to bottom, #0b1c3d, #081428)",
          paddingBottom: "calc(80px + env(safe-area-inset-bottom, 0px))",
          animation: "springUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
          willChange: "transform",
        }}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 bg-gray-500/50 rounded-full" />
        </div>

        {/* Grid of items */}
        <div className="grid grid-cols-3 gap-4 px-4 pt-2 pb-4">
          {allItems.map((item) => {
            const active = isActive(item.path);
            const Icon = item.icon;

            return (
              <button
                key={item.path}
                onClick={() => onItemClick(item.path)}
                className={`flex flex-col items-center justify-center p-4 rounded-xl transition-all duration-200 active:scale-95 ${
                  active
                    ? "bg-[#f0b429]/10 scale-105"
                    : "bg-white/5 hover:bg-white/10"
                }`}
              >
                <Icon
                  size={24}
                  className={`transition-colors duration-200 ${
                    active ? "text-[#f0b429]" : "text-gray-300"
                  }`}
                  strokeWidth={active ? 2.5 : 2}
                />
                <span
                  className={`text-xs mt-2 font-medium transition-colors duration-200 ${
                    active ? "text-[#f0b429]" : "text-gray-300"
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Keyframe animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes springUp {
          0% { 
            transform: translateY(100%); 
            opacity: 0.5;
          }
          60% { 
            transform: translateY(-8px); 
          }
          80% { 
            transform: translateY(4px); 
          }
          100% { 
            transform: translateY(0); 
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
