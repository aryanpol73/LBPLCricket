import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Lock, Loader2, AlertTriangle, CheckCircle } from "lucide-react";
import { z } from "zod";
import { checkPasswordBreach } from "@/lib/passwordCheck";

const passwordSchema = z.string().min(6, "Password must be at least 6 characters");

const ResetPassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string }>({});
  const [isValidSession, setIsValidSession] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    // Check if user has a valid recovery session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setIsValidSession(true);
      } else {
        toast.error("Invalid or expired reset link. Please request a new one.");
      }
      setCheckingSession(false);
    });

    // Listen for auth events (recovery link clicked)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setIsValidSession(true);
        setCheckingSession(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const validateInputs = () => {
    const newErrors: { password?: string; confirmPassword?: string } = {};
    
    const passwordResult = passwordSchema.safeParse(password);
    if (!passwordResult.success) {
      newErrors.password = passwordResult.error.errors[0].message;
    }
    
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateInputs()) return;
    
    setLoading(true);

    // Check if password has been exposed in data breaches
    const breachResult = await checkPasswordBreach(password);
    if (breachResult.breached) {
      toast.error(
        `This password has been found in ${breachResult.count.toLocaleString()} data breaches. Please choose a different password.`,
        {
          icon: <AlertTriangle className="h-5 w-5 text-destructive" />,
          duration: 6000,
        }
      );
      setErrors((prev) => ({ ...prev, password: "This password has been compromised. Please choose a stronger one." }));
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Password updated successfully!", {
        icon: <CheckCircle className="h-5 w-5 text-green-500" />,
      });
      navigate("/community");
    }
    setLoading(false);
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center px-4">
        <Card className="w-full max-w-md p-8 bg-card shadow-glow border-primary/20">
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </Card>
      </div>
    );
  }

  if (!isValidSession) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center px-4">
        <Card className="w-full max-w-md p-8 bg-card shadow-glow border-primary/20">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-foreground mb-2">Invalid Reset Link</h1>
            <p className="text-muted-foreground mb-6">
              This password reset link is invalid or has expired.
            </p>
            <Button
              onClick={() => navigate("/auth")}
              className="bg-gradient-hero text-white"
            >
              Back to Login
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center px-4">
      <Card className="w-full max-w-md p-8 bg-card shadow-glow border-primary/20">
        <div className="flex items-center justify-center gap-3 mb-6">
          <Lock className="text-primary" size={32} />
          <h1 className="text-2xl font-bold text-foreground">Reset Password</h1>
        </div>
        
        <p className="text-center text-muted-foreground mb-6">
          Enter your new password below
        </p>

        <form onSubmit={handleResetPassword} className="space-y-4">
          <div>
            <Label htmlFor="new-password" className="flex items-center gap-2">
              <Lock className="h-4 w-4" /> New Password
            </Label>
            <Input
              id="new-password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrors((prev) => ({ ...prev, password: undefined }));
              }}
              required
              placeholder="••••••••"
              minLength={6}
              className={errors.password ? "border-destructive" : ""}
            />
            {errors.password && (
              <p className="text-sm text-destructive mt-1">{errors.password}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="confirm-password" className="flex items-center gap-2">
              <Lock className="h-4 w-4" /> Confirm Password
            </Label>
            <Input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
              }}
              required
              placeholder="••••••••"
              minLength={6}
              className={errors.confirmPassword ? "border-destructive" : ""}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-destructive mt-1">{errors.confirmPassword}</p>
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
                Updating password...
              </>
            ) : (
              "Update Password"
            )}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default ResetPassword;
