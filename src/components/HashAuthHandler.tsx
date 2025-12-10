import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

/**
 * This component handles Supabase email verification links that come with hash fragments.
 * Supabase sends verification emails with URLs like: https://domain.com/#access_token=...&type=signup
 * This component detects those hash fragments and redirects to /auth/callback with proper params.
 */
export const HashAuthHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if there's a hash with auth tokens
    const hash = window.location.hash;
    
    if (hash && hash.length > 1) {
      // Parse the hash fragment (remove the leading #)
      const hashParams = new URLSearchParams(hash.substring(1));
      
      const accessToken = hashParams.get("access_token");
      const refreshToken = hashParams.get("refresh_token");
      const type = hashParams.get("type");
      const errorDescription = hashParams.get("error_description");
      
      // If this looks like a Supabase auth callback (has access_token or error)
      if (accessToken || errorDescription) {
        // Clear the hash from the URL
        window.history.replaceState(null, "", window.location.pathname);
        
        // Redirect to auth callback with the type as query param
        if (type) {
          navigate(`/auth/callback?type=${type}`, { replace: true });
        } else if (errorDescription) {
          navigate(`/auth/callback?error_description=${encodeURIComponent(errorDescription)}`, { replace: true });
        } else {
          navigate("/auth/callback", { replace: true });
        }
      }
    }
  }, [navigate, location]);

  return null;
};
