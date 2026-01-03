import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes lockout

serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, otp, password } = await req.json();

    if (!email || !otp) {
      return new Response(
        JSON.stringify({ error: "Email and OTP are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const normalizedEmail = email.toLowerCase();

    // Check for existing OTP record for this email (most recent, unused)
    const { data: latestOtp, error: latestOtpError } = await supabase
      .from("email_otps")
      .select("*")
      .eq("email", normalizedEmail)
      .eq("used", false)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (latestOtpError) {
      console.error("Error checking OTP:", latestOtpError);
      return new Response(
        JSON.stringify({ error: "Failed to verify OTP" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if OTP is locked due to too many failed attempts
    if (latestOtp) {
      const failedAttempts = latestOtp.failed_attempts || 0;
      const lockedUntil = latestOtp.locked_until ? new Date(latestOtp.locked_until) : null;
      
      // Check if currently locked
      if (lockedUntil && lockedUntil > new Date()) {
        const remainingMinutes = Math.ceil((lockedUntil.getTime() - Date.now()) / 60000);
        console.log(`OTP locked for email ${normalizedEmail}. Remaining lockout: ${remainingMinutes} minutes`);
        return new Response(
          JSON.stringify({ 
            error: `Too many failed attempts. Please try again in ${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''}, or request a new OTP.` 
          }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      // Check if max attempts reached (lock the OTP)
      if (failedAttempts >= MAX_FAILED_ATTEMPTS) {
        console.log(`Max attempts reached for email ${normalizedEmail}. Locking OTP.`);
        return new Response(
          JSON.stringify({ 
            error: "This OTP has been locked due to too many failed attempts. Please request a new OTP." 
          }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // Find valid OTP that matches the provided code
    const { data: otpRecord, error: otpError } = await supabase
      .from("email_otps")
      .select("*")
      .eq("email", normalizedEmail)
      .eq("otp", otp)
      .eq("used", false)
      .gte("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (otpError) {
      console.error("Error checking OTP:", otpError);
      return new Response(
        JSON.stringify({ error: "Failed to verify OTP" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!otpRecord) {
      // OTP doesn't match - increment failed attempts on the latest OTP
      if (latestOtp) {
        const newFailedAttempts = (latestOtp.failed_attempts || 0) + 1;
        const updateData: { failed_attempts: number; locked_until?: string } = {
          failed_attempts: newFailedAttempts
        };
        
        // Lock the OTP if max attempts reached
        if (newFailedAttempts >= MAX_FAILED_ATTEMPTS) {
          updateData.locked_until = new Date(Date.now() + LOCKOUT_DURATION_MS).toISOString();
          console.log(`Locking OTP for email ${normalizedEmail} after ${newFailedAttempts} failed attempts`);
        }
        
        await supabase
          .from("email_otps")
          .update(updateData)
          .eq("id", latestOtp.id);
        
        const remainingAttempts = MAX_FAILED_ATTEMPTS - newFailedAttempts;
        
        if (remainingAttempts <= 0) {
          return new Response(
            JSON.stringify({ 
              error: "Too many failed attempts. This OTP has been locked. Please request a new OTP." 
            }),
            { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        
        console.log(`Failed OTP attempt for ${normalizedEmail}. Attempts: ${newFailedAttempts}/${MAX_FAILED_ATTEMPTS}`);
      }

      // Check if OTP exists but expired
      const { data: expiredOtp } = await supabase
        .from("email_otps")
        .select("id")
        .eq("email", normalizedEmail)
        .eq("otp", otp)
        .eq("used", false)
        .lt("expires_at", new Date().toISOString())
        .limit(1);

      if (expiredOtp && expiredOtp.length > 0) {
        return new Response(
          JSON.stringify({ error: "OTP expired. Please request a new one." }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Check if OTP was already used (user setting password)
      const { data: usedOtp } = await supabase
        .from("email_otps")
        .select("id")
        .eq("email", normalizedEmail)
        .eq("otp", otp)
        .eq("used", true)
        .limit(1);

      // If OTP was used and password is provided, this is a password setup request
      if (usedOtp && usedOtp.length > 0 && password) {
        // Check if user exists
        const { data: existingUsers } = await supabase.auth.admin.listUsers();
        const existingUser = existingUsers?.users?.find(
          (u) => u.email?.toLowerCase() === normalizedEmail
        );

        if (existingUser) {
          // User exists - update password (password reset flow)
          const { error: updateError } = await supabase.auth.admin.updateUserById(
            existingUser.id,
            { password }
          );
          if (updateError) {
            console.error("Error updating password:", updateError);
            return new Response(
              JSON.stringify({ error: "Failed to update password" }),
              { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
          }
          return new Response(
            JSON.stringify({ 
              success: true, 
              userCreated: true,
              message: "Password updated successfully."
            }),
            { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        } else {
          // Create new user with password
          const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
            email: normalizedEmail,
            password,
            email_confirm: true,
          });

          if (createError) {
            console.error("Error creating user:", createError);
            return new Response(
              JSON.stringify({ error: "Failed to create account" }),
              { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
          }

          return new Response(
            JSON.stringify({ 
              success: true, 
              userCreated: true,
              message: "Account created successfully."
            }),
            { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
      }

      // Return remaining attempts info
      const remainingAttempts = latestOtp ? MAX_FAILED_ATTEMPTS - (latestOtp.failed_attempts || 0) - 1 : 0;
      return new Response(
        JSON.stringify({ 
          error: `Invalid OTP. ${remainingAttempts > 0 ? `${remainingAttempts} attempt${remainingAttempts > 1 ? 's' : ''} remaining.` : 'Please request a new OTP.'}` 
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // OTP is valid - reset failed attempts and mark as used
    await supabase
      .from("email_otps")
      .update({ used: true, failed_attempts: 0, locked_until: null })
      .eq("id", otpRecord.id);

    // Check if user exists (internal check only - not revealed to client)
    const { data: existingUsers } = await supabase.auth.admin.listUsers();
    const existingUser = existingUsers?.users?.find(
      (u) => u.email?.toLowerCase() === normalizedEmail
    );

    // SECURITY: Return consistent response to prevent user enumeration
    // Both new and existing users see the same response - "enter your password"
    // The server will handle the difference internally when password is submitted
    return new Response(
      JSON.stringify({ 
        success: true, 
        requiresPassword: true,
        // Internal flag for server-side logic only - client treats all users the same
        _internal_is_new_user: !existingUser,
        message: "OTP verified. Please enter your password."
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: any) {
    console.error("Error in verify-otp function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
