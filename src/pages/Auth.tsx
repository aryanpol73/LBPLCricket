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
          navigate("/community");
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  // Cooldown timer
  useEffect(() => {
    if (lastOtpSentAt) {
      const interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - lastOtpSentAt) / 1000);
        const remaining = Math.max(0, 60 - elapsed);
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
    if (lastOtpSentAt && Date.now() - lastOtpSentAt < 60000) {
      toast.error(`Please wait ${cooldownRemaining} seconds before requesting another OTP`);
      return;
    }
    
    setLoading(true);
    setEmailError(undefined);

    try {
      const response = await supabase.functions.invoke("send-otp", {
        body: { email: email.toLowerCase() },
      });

      if (response.error) {
        toast.error(response.error.message || "Failed to send OTP");
        setLoading(false);
        return;
      }

      if (response.data?.error) {
        toast.error(response.data.error);
        setLoading(false);
        return;
      }

      setLastOtpSentAt(Date.now());
      setCooldownRemaining(60);
      toast.success("OTP Sent! Check your email.");
      setStep("otp");
    } catch (error: any) {
      toast.error(error.message || "Failed to send OTP");
    }
    
    setLoading(false);
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      toast.error("Please enter the complete 6-digit OTP");
      return;
    }

    setLoading(true);

    try {
      const response = await supabase.functions.invoke("verify-otp", {
        body: { email: email.toLowerCase(), otp },
      });

      if (response.error) {
        toast.error(response.error.message || "Failed to verify OTP");
        setOtp("");
        setLoading(false);
        return;
      }

      if (response.data?.error) {
        toast.error(response.data.error);
        setOtp("");
        setLoading(false);
        return;
      }

      if (response.data?.isNewUser) {
        toast.success("OTP verified! Please set your password.");
        setStep("set-password");
      } else if (response.data?.actionLink) {
        // User exists - follow the magic link to sign in
        window.location.href = response.data.actionLink;
      } else {
        toast.success("Logged in successfully!");
        navigate("/community");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to verify OTP");
      setOtp("");
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

    try {
      const response = await supabase.functions.invoke("verify-otp", {
        body: { email: email.toLowerCase(), otp, password },
      });

      if (response.error) {
        toast.error(response.error.message || "Failed to create account");
        setLoading(false);
        return;
      }

      if (response.data?.error) {
        toast.error(response.data.error);
        setLoading(false);
        return;
      }

      if (response.data?.actionLink) {
        toast.success("Account created! Signing you in...");
        window.location.href = response.data.actionLink;
      } else {
        toast.success("Account created successfully!");
        navigate("/community");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to create account");
    }
    
    setLoading(false);
  };

  const handleResendOtp = async () => {
    if (cooldownRemaining > 0) {
      toast.error(`Please wait ${cooldownRemaining} seconds`);
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await supabase.functions.invoke("send-otp", {
        body: { email: email.toLowerCase() },
      });

      if (response.error || response.data?.error) {
        toast.error(response.data?.error || response.error?.message || "Failed to resend OTP");
      } else {
        setLastOtpSentAt(Date.now());
        setCooldownRemaining(60);
        toast.success("New OTP sent!");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to resend OTP");
    }
    
    setLoading(false);
  };

  const goBack = () => {
    if (step === "otp") {
      setStep("email");
      setOtp("");
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
                  Creating Account...
                </>
              ) : (
                <>
                  <Lock className="mr-2 h-4 w-4" />
                  Create Account
                </>
              )}
            </Button>
          </form>
        </Card>
      </div>
    );
  }

  return null;
};

export default Auth;
