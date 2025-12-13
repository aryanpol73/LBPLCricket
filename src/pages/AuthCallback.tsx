import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Listen for auth state changes - this catches OAuth token exchange
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          // Force redirect to community - use window.location for PWA compatibility
          window.location.href = `${window.location.origin}/community`;
        }
      }
    );

    // Check for existing session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        window.location.href = `${window.location.origin}/community`;
        return;
      }

      // Fallback: If no session after 3 seconds, redirect to auth
      setTimeout(async () => {
        const { data: { session: retrySession } } = await supabase.auth.getSession();
        if (retrySession) {
          window.location.href = `${window.location.origin}/community`;
        } else {
          window.location.href = `${window.location.origin}/auth`;
        }
      }, 3000);
    };

    checkSession();

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-foreground">Signing you in...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
