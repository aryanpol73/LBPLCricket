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
    const handleAuth = async () => {
      if (hasRedirected.current) return;

      // Check URL for type param (email verification) or error
      const type = searchParams.get("type");
      const errorDescription = searchParams.get("error_description");
      
      if (errorDescription) {
        setStatus("Verification failed");
        hasRedirected.current = true;
        setTimeout(() => {
          navigate("/auth?error=callback_failed", { replace: true });
        }, 1500);
        return;
      }

      // First, check if there are hash tokens in the URL that need processing
      const hash = window.location.hash;
      if (hash && hash.length > 1) {
        const hashParams = new URLSearchParams(hash.substring(1));
        const accessToken = hashParams.get("access_token");
        
        if (accessToken) {
          // Supabase will automatically pick up the tokens from the hash
          // Just wait for the session to be established
          setStatus("Verifying your email...");
        }
      }

      // Wait a moment for Supabase to process any tokens
      await new Promise(resolve => setTimeout(resolve, 500));

      // Get the current session
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Auth callback error:", error.message);
        setStatus("Authentication failed");
        hasRedirected.current = true;
        setTimeout(() => navigate("/auth?error=callback_failed", { replace: true }), 1500);
        return;
      }
      
      // If this is an email verification callback (type=signup or type=email)
      if (type === "signup" || type === "email") {
        hasRedirected.current = true;
        
        if (session) {
          setStatus("Email verified successfully!");
          toast.success("Your email has been successfully verified!", {
            duration: 5000,
          });
          // Redirect to Community page after verification
          setTimeout(() => {
            navigate("/community", { replace: true });
          }, 1500);
        } else {
          // Email verified but no session - redirect to login
          setStatus("Email verified! Please sign in.");
          toast.success("Your email has been verified! Please sign in.", {
            duration: 5000,
          });
          setTimeout(() => {
            navigate("/auth?verified=true", { replace: true });
          }, 1500);
        }
        return;
      }
      
      // For OAuth flow or general session check
      if (session) {
        hasRedirected.current = true;
        setStatus("Sign in successful!");
        navigate("/community", { replace: true });
        return;
      }
    };

    // Set up auth state listener for OAuth flows
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (hasRedirected.current) return;
        
        if (event === 'SIGNED_IN' && session) {
          hasRedirected.current = true;
          setStatus("Sign in successful!");
          navigate("/community", { replace: true });
        }
      }
    );

    handleAuth();
    
    // Fallback: if nothing happens after 8 seconds, redirect to auth
    const fallback = setTimeout(() => {
      if (!hasRedirected.current) {
        hasRedirected.current = true;
        setStatus("Taking too long, redirecting...");
        navigate("/auth", { replace: true });
      }
    }, 8000);

    return () => {
      subscription.unsubscribe();
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
