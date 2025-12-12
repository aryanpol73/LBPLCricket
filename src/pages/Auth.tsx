import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Users, Mail, Loader2, Home, Lock, ArrowLeft, KeyRound } from "lucide-react";
import { z } from "zod";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

const emailSchema = z.string().email("Please enter a valid email address");
const passwordSchema = z.string().min(6, "Password must be at least 6 characters");

type AuthStep = "email" | "otp" | "set-password";

const Auth = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<AuthStep>("email");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | undefined>();
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | undefined>();
  const [lastOtpSentAt, setLastOtpSentAt] = useState<number | null>(null);
  const [cooldownRemaining, setCooldownRemaining] = useState(0);
  const [isNewUser, setIsNewUser] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/community");
      }
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          // Don't navigate immediately if we need to set password
          if (!isNewUser) {
            navigate("/community");
          }
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate, isNewUser]);

  // Cooldown timer
  useEffect(() => {
    if (lastOtpSentAt) {
      const interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - lastOtpSentAt) / 1000);
        const remaining = Math.max(0, 30 - elapsed);
        setCooldownRemaining(remaining);
        if (remaining === 0) {
          clearInterval(interval);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [lastOtpSentAt]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const emailResult = emailSchema.safeParse(email);
    if (!emailResult.success) {
      setEmailError(emailResult.error.errors[0].message);
      return;
    }

    // Check cooldown
    if (lastOtpSentAt && Date.now() - lastOtpSentAt < 30000) {
      toast.error(`Please wait ${cooldownRemaining} seconds before requesting another OTP`);
      return;
    }
    
    setLoading(true);
    setEmailError(undefined);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
      },
    });

    if (error) {
      toast.error(error.message);
    } else {
      setLastOtpSentAt(Date.now());
      setCooldownRemaining(30);
      toast.success("OTP Sent! Check your email.");
      setStep("otp");
    }
    setLoading(false);
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      toast.error("Please enter the complete 6-digit OTP");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: 'email',
    });

    if (error) {
      if (error.message.includes("expired")) {
        toast.error("OTP expired. Please request a new one.");
      } else {
        toast.error("Invalid OTP. Please try again.");
      }
      setOtp("");
      setLoading(false);
      return;
    }

    if (data.user) {
      // Check if user has a password set by checking user metadata or identities
      const hasPassword = data.user.identities?.some(
        (identity) => identity.provider === 'email' && identity.identity_data?.email_verified
      );
      
      // For new users (just created via OTP), they won't have confirmed their password
      // We check if the user was created recently (within the last minute)
      const createdAt = new Date(data.user.created_at).getTime();
      const now = Date.now();
      const isRecentlyCreated = now - createdAt < 60000; // Created within last minute
      
      // Also check if user has ever logged in with password
      const lastSignIn = data.user.last_sign_in_at;
      const isFirstLogin = !lastSignIn || new Date(lastSignIn).getTime() === createdAt;
      
      if (isRecentlyCreated || isFirstLogin) {
        setIsNewUser(true);
        setStep("set-password");
        toast.success("OTP verified! Please set your password.");
      } else {
        toast.success("Logged in successfully!");
        navigate("/community");
      }
    }
    
    setLoading(false);
  };

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    const passwordResult = passwordSchema.safeParse(password);
    if (!passwordResult.success) {
      setPasswordError(passwordResult.error.errors[0].message);
      return;
    }

    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    setLoading(true);
    setPasswordError(undefined);

    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Password set successfully! Welcome to LBPL Community!");
      navigate("/community");
    }
    
    setLoading(false);
  };

  const handleResendOtp = async () => {
    if (cooldownRemaining > 0) {
      toast.error(`Please wait ${cooldownRemaining} seconds`);
      return;
    }
    
    setLoading(true);
    
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
      },
    });

    if (error) {
      toast.error(error.message);
    } else {
      setLastOtpSentAt(Date.now());
      setCooldownRemaining(30);
      toast.success("New OTP sent!");
    }
    
    setLoading(false);
  };

  const goBack = () => {
    if (step === "otp") {
      setStep("email");
      setOtp("");
    } else if (step === "set-password") {
      // Can't go back from password step as user is already authenticated
    }
  };

  // Email Input Screen
  if (step === "email") {
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

          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" /> Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError(undefined);
                }}
                required
                placeholder="your@email.com"
                className={emailError ? "border-destructive" : ""}
              />
              {emailError && (
                <p className="text-sm text-destructive mt-1">{emailError}</p>
              )}
            </div>
            
            <Button
              type="submit"
              className="w-full bg-gradient-hero text-white"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending OTP...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Continue
                </>
              )}
            </Button>
            
            <p className="text-xs text-center text-muted-foreground">
              We'll send you a 6-digit code to verify your email.
            </p>
          </form>
        </Card>
      </div>
    );
  }

  // OTP Input Screen
  if (step === "otp") {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center px-4">
        <Card className="w-full max-w-md p-8 bg-card shadow-glow border-primary/20">
          <button
            onClick={goBack}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          
          <div className="flex items-center justify-center gap-3 mb-4">
            <KeyRound className="text-primary" size={32} />
            <h1 className="text-2xl font-bold text-foreground">Enter OTP</h1>
          </div>
          
          <p className="text-center text-muted-foreground mb-2">
            We've sent a 6-digit code to
          </p>
          <p className="text-center text-primary font-medium mb-6">
            {email}
          </p>

          <div className="flex justify-center mb-6">
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={(value) => setOtp(value)}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>

          <Button
            onClick={handleVerifyOtp}
            className="w-full bg-gradient-hero text-white mb-4"
            disabled={loading || otp.length !== 6}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify OTP"
            )}
          </Button>

          <div className="text-center">
            <button
              onClick={handleResendOtp}
              disabled={cooldownRemaining > 0 || loading}
              className={`text-sm ${
                cooldownRemaining > 0
                  ? "text-muted-foreground cursor-not-allowed"
                  : "text-primary hover:underline"
              }`}
            >
              {cooldownRemaining > 0
                ? `Resend OTP in ${cooldownRemaining}s`
                : "Resend OTP"}
            </button>
          </div>
        </Card>
      </div>
    );
  }

  // Set Password Screen
  if (step === "set-password") {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center px-4">
        <Card className="w-full max-w-md p-8 bg-card shadow-glow border-primary/20">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Lock className="text-primary" size={32} />
            <h1 className="text-2xl font-bold text-foreground">Set Password</h1>
          </div>
          
          <p className="text-center text-muted-foreground mb-6">
            Create a password for your account to login faster next time.
          </p>

          <form onSubmit={handleSetPassword} className="space-y-4">
            <div>
              <Label htmlFor="password" className="flex items-center gap-2">
                <Lock className="h-4 w-4" /> Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError(undefined);
                }}
                required
                placeholder="Enter password (min 6 characters)"
                className={passwordError ? "border-destructive" : ""}
              />
            </div>

            <div>
              <Label htmlFor="confirmPassword" className="flex items-center gap-2">
                <Lock className="h-4 w-4" /> Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setPasswordError(undefined);
                }}
                required
                placeholder="Confirm your password"
                className={passwordError ? "border-destructive" : ""}
              />
              {passwordError && (
                <p className="text-sm text-destructive mt-1">{passwordError}</p>
              )}
            </div>
            
            <Button
              type="submit"
              className="w-full bg-gradient-hero text-white"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Setting Password...
                </>
              ) : (
                <>
                  <Lock className="mr-2 h-4 w-4" />
                  Set Password & Continue
                </>
              )}
            </Button>
            
            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => navigate("/community")}
            >
              Skip for now
            </Button>
          </form>
        </Card>
      </div>
    );
  }

  return null;
};

export default Auth;
