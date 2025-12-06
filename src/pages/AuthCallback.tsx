import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const AuthCallback = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState("Processing...");

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          // Redirect to main domain after successful OAuth on old domain
          window.location.href = "https://lbpl-official.lovable.app/community";
        } else if (event === 'SIGNED_OUT') {
          window.location.href = "https://lbpl-official.lovable.app/auth";
        }
      }
    );

    // Also check current session (handles page refresh scenarios)
    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Auth callback error:", error.message);
        setStatus("Authentication failed");
        setTimeout(() => navigate("/auth?error=callback_failed", { replace: true }), 1500);
        return;
      }
      
      if (session) {
        window.location.href = "https://lbpl-official.lovable.app/community";
      }
    };
    
    // Small delay to allow Supabase to process OAuth response from URL
    const timer = setTimeout(checkSession, 500);
    
    // Fallback: if nothing happens after 5 seconds, redirect to auth
    const fallback = setTimeout(() => {
      setStatus("Taking too long, redirecting...");
      window.location.href = "https://lbpl-official.lovable.app/auth";
    }, 5000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timer);
      clearTimeout(fallback);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-foreground">{status}</p>
        <p className="text-muted-foreground text-sm mt-2">Completing sign in...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
