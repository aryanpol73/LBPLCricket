import { useState, useEffect } from "react";
import { Menu, X, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import lbplLogo from "@/assets/lbpl-logo-new.jpg";

const navLinks = [
  { href: "#home", label: "Home" },
  { href: "#pointsTable", label: "Points Table" },
  { href: "#results", label: "Match Results" },
  { href: "#playerStats", label: "Player Statistics" },
  { href: "#matches", label: "Matches" },
  { href: "#teams", label: "Teams" },
  { href: "#sponsors", label: "Sponsors" },
  { href: "#gallery", label: "Gallery" },
];

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    const targetId = href.replace("#", "");
    const element = document.getElementById(targetId);
    if (element) {
      const navHeight = 64;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - navHeight,
        behavior: "smooth"
      });
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-[image:var(--gradient-hero)] shadow-lg backdrop-blur-sm border-b border-secondary/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left Side - Hamburger Menu + Logo + Text */}
          <div className="flex items-center gap-3">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/10 rounded-full"
                  aria-label="Open menu"
                >
                  {isOpen ? <X size={24} /> : <Menu size={24} />}
                </Button>
              </SheetTrigger>
              <SheetContent 
                side="left" 
                className="w-72 bg-[image:var(--gradient-hero)] border-r border-secondary/30"
              >
                <div className="flex flex-col gap-2 mt-8">
                  {navLinks.map((link) => (
                    <button
                      key={link.href}
                      onClick={() => handleNavClick(link.href)}
                      className="px-4 py-3 rounded-lg font-medium text-white hover:bg-secondary/20 hover:text-secondary transition-all duration-300 text-left"
                    >
                      {link.label}
                    </button>
                  ))}
                </div>
              </SheetContent>
            </Sheet>

            <button 
              onClick={() => handleNavClick("#home")}
              className="flex items-center gap-2 group"
            >
              <img 
                src={lbplLogo} 
                alt="LBPL Logo" 
                className="w-10 h-10 rounded-full object-cover border-2 border-secondary/50"
              />
              <div className="flex flex-col items-center text-center">
                <span className="text-lg md:text-xl font-bold text-white group-hover:text-secondary transition-colors leading-tight">
                  LBPL
                </span>
                <span className="text-xs text-secondary font-medium leading-tight">
                  Season 3 • 2026
                </span>
              </div>
            </button>
          </div>

          {/* Right Side - Dark Mode Toggle */}
          <div className="flex items-center">
            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="text-white hover:bg-white/10 rounded-full w-10 h-10"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
