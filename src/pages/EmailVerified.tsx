import { CheckCircle, LogIn } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const EmailVerified = () => {
  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-card/95 backdrop-blur-sm border-primary/20">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">
            Email Verified!
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Your email has been successfully verified. You can now sign in to access the LBPL Community.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Link to="/auth" className="block">
            <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              <LogIn className="w-4 h-4 mr-2" />
              Continue to Sign In
            </Button>
          </Link>
          <Link to="/" className="block">
            <Button variant="outline" className="w-full border-border hover:bg-accent">
              Back to Home
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailVerified;
