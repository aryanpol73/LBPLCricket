import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SignIn, useAuth } from "@clerk/clerk-react";
import { Card } from "@/components/ui/card";
import { Users, Home } from "lucide-react";
import { Link } from "react-router-dom";

const Auth = () => {
  const navigate = useNavigate();
  const { isSignedIn, isLoaded } = useAuth();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      navigate("/community");
    }
  }, [isSignedIn, isLoaded, navigate]);

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center px-4">
      <Card className="w-full max-w-md p-8 bg-card shadow-glow border-primary/20">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6"
        >
          <Home size={16} />
          Back to Home
        </Link>
        
        <div className="flex items-center justify-center gap-3 mb-6">
          <Users className="text-primary" size={32} />
          <h1 className="text-3xl font-bold text-foreground">LBPL Community</h1>
        </div>
        
        <p className="text-center text-muted-foreground mb-6">
          Join the LBPL community to interact with other fans
        </p>

        <div className="flex justify-center">
          <SignIn 
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "bg-transparent shadow-none border-none p-0",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                socialButtonsBlockButton: "w-full h-12 text-base border-border hover:bg-accent",
                formButtonPrimary: "w-full bg-gradient-hero text-white hover:opacity-90",
                footerAction: "hidden",
                dividerLine: "bg-border",
                dividerText: "text-muted-foreground text-xs uppercase",
                formFieldInput: "bg-background border-border",
                formFieldLabel: "text-foreground",
                identifierPreviewText: "text-foreground",
                formFieldAction: "text-primary hover:text-primary/80",
              },
            }}
            routing="path"
            path="/auth"
            redirectUrl="/community"
            signUpUrl="/auth"
          />
        </div>
      </Card>
    </div>
  );
};

export default Auth;
