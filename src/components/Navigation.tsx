import { Link, useLocation } from "react-router-dom";
import { Menu, X, Moon, Sun } from "lucide-react";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import lbplLogo from "@/assets/lbpl-logo-new.jpg";
import { supabase } from "@/integrations/supabase/client";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const checkAdminStatus = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        const { data: roleData } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .eq('role', 'admin')
          .single();
        
        setIsAdmin(!!roleData);
      }
    };

    checkAdminStatus();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const { data: roleData } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', session.user.id)
            .eq('role', 'admin')
            .single();
          
          setIsAdmin(!!roleData);
        } else {
          setIsAdmin(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const baseNavLinks = [
    { path: "#home", label: "Home" },
    { path: "#timeline", label: "Match Timeline" },
    { path: "#points", label: "Points Table" },
    { path: "#results", label: "Results" },
    { path: "#player-stats", label: "Player Stats" },
    { path: "#matches", label: "Matches" },
    { path: "#teams", label: "Teams" },
    { path: "#sponsors", label: "Sponsors" },
    { path: "#gallery", label: "Gallery" },
  ];

  const navLinks = isAdmin 
    ? [...baseNavLinks, { path: "/admin", label: "Admin" }] 
    : baseNavLinks;

  const isActive = (path: string) => {
    if (path.startsWith('#')) {
      return location.hash === path || (path === '#home' && !location.hash);
    }
    return location.pathname === path;
  };

  const handleNavClick = (path: string) => {
    if (path.startsWith('#')) {
      setIsOpen(false);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-gradient-hero shadow-glow backdrop-blur-sm bg-gradient-to-r from-primary via-primary to-primary-glow animate-gradient-x" style={{ backgroundSize: '200% 100%' }}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-3">
            {/* Universal Menu - Left */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <button
                  className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
                  aria-label="Menu"
                >
                  {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 bg-gradient-hero border-primary/20">
                <div className="flex flex-row items-center justify-between pb-4">
                  <h2 className="text-lg font-semibold text-white">Navigate</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="text-white hover:bg-white/10 rounded-lg transition-all duration-300"
                  >
                    {theme === "dark" ? (
                      <Sun className="h-5 w-5" />
                    ) : (
                      <Moon className="h-5 w-5" />
                    )}
                  </Button>
                </div>
                <div className="mt-4 flex flex-col gap-2">
                  {navLinks.map((link) => {
                    const isAnchor = link.path.startsWith('#');
                    return isAnchor ? (
                      <a
                        key={link.path}
                        href={link.path}
                        onClick={() => handleNavClick(link.path)}
                        className={`px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                          isActive(link.path)
                            ? "bg-secondary text-primary shadow-gold"
                            : "text-white hover:bg-white/10"
                        }`}
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        key={link.path}
                        to={link.path}
                        onClick={() => setIsOpen(false)}
                        className={`px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                          isActive(link.path)
                            ? "bg-secondary text-primary shadow-gold"
                            : "text-white hover:bg-white/10"
                        }`}
                      >
                        {link.label}
                      </Link>
                    );
                  })}
                </div>
              </SheetContent>
            </Sheet>

            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <img 
                src={lbplLogo} 
                alt="LBPL Logo" 
                className="h-14 w-14 rounded-full shadow-gold group-hover:shadow-glow transition-all duration-300"
              />
              <div className="flex flex-col">
                <span className="text-xl font-bold text-white">LBPL</span>
                <span className="text-xs text-secondary">Season 3 • 2026</span>
              </div>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isAnchor = link.path.startsWith('#');
              return isAnchor ? (
                <a
                  key={link.path}
                  href={link.path}
                  onClick={() => handleNavClick(link.path)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    isActive(link.path)
                      ? "bg-secondary text-primary shadow-gold"
                      : "text-white hover:bg-white/10"
                  }`}
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    isActive(link.path)
                      ? "bg-secondary text-primary shadow-gold"
                      : "text-white hover:bg-white/10"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Sheet Content rendered above; no separate mobile nav needed */}
      </div>
    </nav>
  );
};
