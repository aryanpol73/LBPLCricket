import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("Processing...");
  const hasRedirected = useRef(false);

  useEffect(() => {
    // Check URL for email confirmation type
    const type = searchParams.get("type");
    const errorDescription = searchParams.get("error_description");
    
    if (errorDescription) {
      setStatus("Verification failed");
      setTimeout(() => {
        navigate("/auth?error=callback_failed", { replace: true });
      }, 1500);
      return;
    }

    // Set up auth state listener - only for OAuth (Google) sign-in, not email verification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        // Only handle OAuth sign-in here (when no type param = OAuth flow)
        if (event === 'SIGNED_IN' && session && !type && !hasRedirected.current) {
          hasRedirected.current = true;
          setStatus("Sign in successful!");
          navigate("/community", { replace: true });
        } else if (event === 'SIGNED_OUT' && !hasRedirected.current) {
          hasRedirected.current = true;
          navigate("/auth", { replace: true });
        }
      }
    );

    // Check current session (handles email verification)
    const checkSession = async () => {
      if (hasRedirected.current) return;
      
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Auth callback error:", error.message);
        setStatus("Authentication failed");
        hasRedirected.current = true;
        setTimeout(() => navigate("/auth?error=callback_failed", { replace: true }), 1500);
        return;
      }
      
      // If this is an email verification callback
      if (type === "signup" || type === "email") {
        if (hasRedirected.current) return;
        hasRedirected.current = true;
        
        setStatus("Email verified successfully!");
        toast.success("Your email has been successfully verified!", {
          duration: 5000,
        });
        // Redirect directly to Community page after verification
        setTimeout(() => {
          if (session) {
            navigate("/community", { replace: true });
          } else {
            // If no session, redirect to auth to sign in
            navigate("/auth", { replace: true });
          }
        }, 1500);
        return;
      }
      
      // For OAuth flow without type param, session check handles refresh scenarios
      if (session && !hasRedirected.current) {
        hasRedirected.current = true;
        setStatus("Sign in successful!");
        navigate("/community", { replace: true });
      }
    };
    
    // Small delay to allow Supabase to process OAuth response from URL
    const timer = setTimeout(checkSession, 500);
    
    // Fallback: if nothing happens after 5 seconds, redirect to auth
    const fallback = setTimeout(() => {
      if (!hasRedirected.current) {
        hasRedirected.current = true;
        setStatus("Taking too long, redirecting...");
        navigate("/auth", { replace: true });
      }
    }, 5000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timer);
      clearTimeout(fallback);
    };
  }, [navigate, searchParams]);

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-foreground">{status}</p>
        <p className="text-muted-foreground text-sm mt-2">Please wait...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
