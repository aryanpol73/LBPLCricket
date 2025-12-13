import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

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

    // Find valid OTP
    const { data: otpRecord, error: otpError } = await supabase
      .from("email_otps")
      .select("*")
      .eq("email", email.toLowerCase())
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
      // Check if OTP exists but expired
      const { data: expiredOtp } = await supabase
        .from("email_otps")
        .select("id")
        .eq("email", email.toLowerCase())
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
        .eq("email", email.toLowerCase())
        .eq("otp", otp)
        .eq("used", true)
        .limit(1);

      // If OTP was used and password is provided, this is a password setup request
      if (usedOtp && usedOtp.length > 0 && password) {
        // Check if user exists
        const { data: existingUsers } = await supabase.auth.admin.listUsers();
        const existingUser = existingUsers?.users?.find(
          (u) => u.email?.toLowerCase() === email.toLowerCase()
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
            email: email.toLowerCase(),
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

      return new Response(
        JSON.stringify({ error: "Invalid OTP" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Mark OTP as used
    await supabase
      .from("email_otps")
      .update({ used: true })
      .eq("id", otpRecord.id);

    // Check if user exists
    const { data: existingUsers } = await supabase.auth.admin.listUsers();
    const existingUser = existingUsers?.users?.find(
      (u) => u.email?.toLowerCase() === email.toLowerCase()
    );

    if (existingUser) {
      // User exists - they need to sign in with password
      return new Response(
        JSON.stringify({ 
          success: true, 
          isNewUser: false,
          requiresPassword: true,
          message: "OTP verified. Please enter your password to sign in."
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } else {
      // New user - they need to set password
      return new Response(
        JSON.stringify({ 
          success: true, 
          isNewUser: true,
          message: "OTP verified. Please set your password."
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

  } catch (error: any) {
    console.error("Error in verify-otp function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
